import path from "path"
import fs from "fs"
import {v4 as uuid} from "uuid"
import extractZip from "extract-zip"
import FileSystem from "../utils/FileSystem"
import findInDir from "../utils/Search/FindInDir"
import express from "express"
import {FileArray, UploadedFile} from "express-fileupload"
import Response from "../utils/Response/Response"
import db from "../utils/Database/Database"
import Utils from "../utils/Utils"
import findInArray from "../utils/Search/FindInArray"

async function Upload(
	req: express.Request,
	res: express.Response
): Promise<void> {
	// check for empty files array
	const isEmpty: boolean = emptyFilesCheck(req.files)
	if (!isEmpty) {
		Response(res, {
			error: true,
			code: 400,
			message: "File was not selected.",
		})
		return
	}

	// not good, but https://github.com/richardgirges/express-fileupload/issues/156
	const file: UploadedFile = req.files.addon as UploadedFile
	// let fileExtension = mime.extension(file.mimetype) // this is bad, because when .mc* uploaded it is detected as bin.
	const fileExtension: string = file.name.toString().split(".").pop()
	const fileHash: string = uuid()
	const fileName: string = fileHash + "." + fileExtension
	const filePath: string = [
		path.resolve(process.env.STATIC_DIR + "/source") + "/",
	].join("")

	// check extension before continue
	const isExtensionCorrect: boolean = extensionCheck(fileExtension)
	if (!isExtensionCorrect) {
		Response(res, {
			error: true,
			code: 500,
			message: "File format error. #202131108200500",
		})
		return
	}

	// move
	file.mv(filePath + fileName, async (err) => {
		if (err) {
			Response(res, {
				error: true,
				code: 500,
				message: err,
			})
			return
		}

		// extract pack after moving but before sending result
		const zipPath: string = filePath + fileName
		const extractedPath: string =
			path.resolve(process.env.STATIC_DIR + "/extracted") + "/" + fileHash
		const isExtracted: boolean = await extract(zipPath, extractedPath)
		if (!isExtracted) {
			clear(zipPath, extractedPath)

			Response(res, {
				error: true,
				code: 500,
				message: "The archive may be damaged. #202131108200505",
			})
			return
		}

		// if isExtracted is true check manifest here
		const isManifest: boolean = checkManifest(extractedPath)
		if (!isManifest) {
			clear(zipPath, extractedPath)

			Response(res, {
				error: true,
				code: 500,
				message: "Bad manifest.",
			})
			return
		}

		// if all "is" is "true" then work with files and DB
		const mcAddonID: boolean | number = await saveAddon(fileName, fileHash)
		if (mcAddonID < 0) {
			clear(zipPath, extractedPath)

			Response(res, {
				error: true,
				code: 500,
				message:
					"This addon is already uploaded and saved. #202131108200510",
			})
			return
		}

		// if addon saved - then save all the data
		// let savedFiles = await saveFiles(mcAddonID, extractedPath)
		await saveFiles(mcAddonID, extractedPath)
		// console.log(savedFiles)

		Response(
			res,
			{
				error: false,
			},
			{
				fileName,
				filePath,
				mcAddonID,
			}
		)
		return
	})
}

function clear(zipPath: string, extractedPath: string) {
	FileSystem.deleteFile(zipPath)
	FileSystem.deleteFolder(extractedPath)
}

function emptyFilesCheck(files: FileArray): boolean {
	return !(!files || Object.keys(files).length === 0)
}

function extensionCheck(fileExtension: string): boolean {
	const allowed: string[] = ["zip", "mcpack", "mcworld", "mcaddon"]
	return !!allowed.find((line) => line === fileExtension)
}

async function extract(
	zipPath: string,
	extractedPath: string
): Promise<boolean> {
	try {
		await extractZip(zipPath, {
			dir: extractedPath,
		})

		return true
	} catch (e) {
		console.log("Zip-extract: " + e)
		return false
	}
}

function checkManifest(extractedPath: string): boolean {
	try {
		const manifestFile: string = fs.readFileSync(
			extractedPath + "/manifest.json",
			"utf-8"
		) // is file exists...
		// console.log(manifestFile)
		// let json = JSON.parse(manifestFile) // try to read result
		JSON.parse(manifestFile) // try to read result
		// console.log(json)

		return true
	} catch (e) {
		console.log("Manifest-check: " + e)
		return false
	}
}

async function saveAddon(fileName: string, fileHash: string): Promise<number> {
	const extractedPath: string =
		path.resolve(process.env.STATIC_DIR + "/extracted") + "/" + fileHash

	const manifestFile = fs.readFileSync(
		extractedPath + "/manifest.json",
		"utf-8"
	) // is file exists...

	const manifest = JSON.parse(manifestFile) // try to read result

	// search for duplicates
	const search = await db.mc_addons.findMany({
		where: {
			uuid: manifest.header.uuid,
			pack_version: manifest.header.version.join("."),
		},
	})

	// if existed = return false
	if (search.length > 0) {
		return -1
	}

	// todo: check here for pack.name and if -> get lang
	const names = {
		packName: manifest.header.name,
		packDescription: manifest.header.description,
	}

	const namesCorrect: boolean = isPackNamesCorrect(
		names.packName,
		names.packDescription
	)

	if (!namesCorrect) {
		// let lang = await getAddonLanguage(fileHash)
		const folderPath: string = path.resolve(
			process.env.STATIC_DIR + "/extracted/" + fileHash
		)
		const langList: string[] = getLangList(folderPath)
		const lang: string = findInArray(langList, ["en_US.lang", "en_GB.lang"])
		const langFile = readFile(folderPath, lang)
		const parsedFile = parseFile(langFile)

		console.log(parsedFile.find((s) => s.key == "pack.name"))

		names.packName = parsedFile.find((s) => s.key === "pack.name").value
		names.packDescription = parsedFile.find(
			(s) => s.key === "pack.description"
		).value
	}

	// insert addon itself
	const mcAddon = await db.mc_addons.create({
		data: {
			filepath: fileName,
			folderpath: fileHash,
			uuid: manifest.header.uuid,
			pack_name: names.packName,
			pack_description: names.packDescription,
			pack_type: manifest.modules[0].type,
			pack_version: manifest.header.version.join("."),
			pack_engine_version: manifest.header.min_engine_version
				? manifest.header.min_engine_version.join(".")
				: "",
			isPublished: true,
		},
	})

	// insert all dependencies
	const dependencies = manifest.dependencies
	const insertedDepsList = []
	if (manifest && dependencies && dependencies.length > 0) {
		for (const dep of dependencies) {
			const insertedDep = await db.mc_dependencies.create({
				data: {
					mca_id: mcAddon.id,
					uuid: dep.uuid,
				},
			})

			insertedDepsList.push(insertedDep)
		}
	}

	return mcAddon.id
}

function isPackNamesCorrect(
	packName: string,
	packDescription: string
): boolean {
	return !(packName === "pack.name" || packDescription === "pack.description")
}

function getLangList(folderPath: string): string[] {
	const listOfFiles: string[] = findInDir(folderPath + "/texts", /\.lang$/)
	const formattedList: string[] = []

	for (const file of listOfFiles) {
		const f: string[] = file.split("/")
		formattedList.push(f[f.length - 1])
	}

	return formattedList
}

function readFile(folderPath: string, lang: string) {
	return fs.readFileSync(folderPath + "/texts/" + lang, "utf-8")
}

function parseFile(fileContent: string) {
	const lines = fileContent.split(/\r?\n/)
	const parsed: {key: string; value: string}[] = []

	for (const line of lines) {
		const kv = line.split("=")

		if (kv[0] && kv[1] && !Utils.isEmpty(kv[0]) && !Utils.isEmpty(kv[1])) {
			parsed.push({
				key: kv[0].toString().trim(),
				value: kv[1].toString().trim(),
			})
		}
	}

	return parsed
}

// async function getAddonLanguage(folderPath: string) {
// 	folderPath = path.resolve("./uploads/extracted/" + folderPath)
// 	let languages: string = fs.readFileSync(
// 		folderPath + "/texts/languages.json",
// 		"utf-8"
// 	)
// 	let languagesJson: string[] = JSON.parse(languages)
//
// 	for (let lang of languagesJson) {
// 		if (lang === "en_US" || lang === "en_GB") {
// 			let readTextFile = fs
// 				.readFileSync(folderPath + "/texts/" + lang + ".lang", "utf-8")
// 				.split("\r\n")
//
// 			let correctLang = []
//
// 			for (let line of readTextFile) {
// 				let l = line.split("=")
//
// 				if (
// 					l[0] &&
// 					l[1] &&
// 					!Utils.isEmpty(l[0]) &&
// 					!Utils.isEmpty(l[1])
// 				) {
// 					correctLang.push({
// 						key: l[0],
// 						value: l[1],
// 					})
// 				}
//
// 				// correctLang.push({
// 				// 	key: l[0],
// 				// 	value: l[1],
// 				// })
// 			}
//
// 			return correctLang
// 		}
// 	}
//
// 	// else if it is not en_us or en_gb
// 	let readTextFile = fs
// 		.readFileSync(
// 			folderPath + "/texts/" + languagesJson[0] + ".lang",
// 			"utf-8"
// 		)
// 		.split("\r\n")
//
// 	let correctLang = []
//
// 	for (let line of readTextFile) {
// 		let l = line.split("=")
//
// 		if (l[0] && l[1] && !Utils.isEmpty(l[0]) && !Utils.isEmpty(l[1])) {
// 			correctLang.push({
// 				key: l[0],
// 				value: l[1],
// 			})
// 		}
//
// 		// correctLang.push({
// 		// 	key: l[0],
// 		// 	value: l[1],
// 		// })
// 	}
//
// 	return correctLang
// }

async function saveFiles(mcAddonID: number, extractedPath: string) {
	// todo: work with db
	const fileList: string[] = findInDir(extractedPath, /\.json$/)

	const results = []

	for (const file of fileList) {
		const path: string[] = file
			.toString()
			.split(extractedPath)
			.pop()
			.split("/")
			.filter(Boolean) // clear [' ', ''] (empty elements)

		const fileName: string = path[path.length - 1]
		const fileRelativePath: string = path.join("/")

		if (path.length > 1) {
			// json files in directories
			const fileType: string = path[0]

			const result = await fileSwitcher(
				mcAddonID,
				fileType,
				fileName,
				fileRelativePath
			)
			results.push(result)
		} else {
			// else -> json files in root, manifest.json for example.
			const fileType = "other"

			const result = await fileSwitcher(
				mcAddonID,
				fileType,
				fileName,
				fileRelativePath
			)

			results.push(result)
		}
	}

	return results
}

async function fileSwitcher(
	mcAddonID: number,
	fileType: string,
	fileName: string,
	fileRelativePath: string
) {
	let result

	switch (fileType) {
		case "entities":
			result = await db.mca_entities.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "items":
			result = await db.mca_items.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "loot_tables":
			result = await db.mca_loot_tables.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "recipes":
			result = await db.mca_recipes.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "scripts":
			result = await db.mca_scripts.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "spawn_rules":
			result = await db.mca_spawn_rules.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "trading":
			result = await db.mca_trading.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "ui":
			result = await db.mca_ui.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "textures":
			result = await db.mca_textures.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "texts":
			result = await db.mca_texts.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "sounds":
			result = await db.mca_sounds.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "render_controllers":
			result = await db.mca_render_controllers.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "particles":
			result = await db.mca_particles.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "models":
			result = await db.mca_models.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "fogs":
			result = await db.mca_fogs.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "entity":
			result = await db.mca_entities_rp.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "attachables":
			result = await db.mca_attachables.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "animations":
			result = await db.mca_animations.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		case "animation_controllers":
			result = await db.mca_animation_controllers.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break

		default:
			result = await db.mca_other.create({
				data: {
					mca_id: mcAddonID,
					filename: fileName,
					filepath: fileRelativePath,
				},
			})
			break
	}

	return result
}

export default Upload
