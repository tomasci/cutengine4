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

async function Upload(req: express.Request, res: express.Response) {
	// check for empty files array
	let isEmpty: boolean = emptyFilesCheck(req.files)
	if (!isEmpty) {
		return Response(res, {
			error: true,
			code: 400,
			message: "File was not selected.",
		})
	}

	// not good, but https://github.com/richardgirges/express-fileupload/issues/156
	let file: UploadedFile = req.files.addon as UploadedFile
	// let fileExtension = mime.extension(file.mimetype) // this is bad, because when .mc* uploaded it is detected as bin.
	let fileExtension: string = file.name.toString().split(".").pop()
	let fileHash: string = uuid()
	let fileName: string = fileHash + "." + fileExtension
	let filePath: string = [path.resolve("./uploads/source") + "/"].join("")

	// check extension before continue
	let isExtensionCorrect: boolean = extensionCheck(fileExtension)
	if (!isExtensionCorrect) {
		return Response(res, {
			error: true,
			code: 500,
			message: "File format error.",
		})
	}

	// move
	file.mv(filePath + fileName, async (err) => {
		if (err) {
			return Response(res, {
				error: true,
				code: 500,
				message: err,
			})
		}

		// extract pack after moving but before sending result
		let zipPath: string = filePath + fileName
		let extractedPath: string =
			path.resolve("./uploads/extracted") + "/" + fileHash
		let isExtracted: boolean = await extract(zipPath, extractedPath)
		if (!isExtracted) {
			clear(zipPath, extractedPath)

			return Response(res, {
				error: true,
				code: 500,
				message: "The archive may be damaged.",
			})
		}

		// if isExtracted is true check manifest here
		let isManifest: boolean = checkManifest(extractedPath)
		if (!isManifest) {
			clear(zipPath, extractedPath)

			return Response(res, {
				error: true,
				code: 500,
				message: "Bad manifest.",
			})
		}

		// if all "is" is "true" then work with files and DB
		let mcAddonID: boolean | number = await saveAddon(fileName, fileHash)
		if (mcAddonID < 0) {
			clear(zipPath, extractedPath)

			return Response(res, {
				error: true,
				code: 500,
				message: "This addon is already uploaded and saved.",
			})
		}

		// if addon saved - then save all the data
		let savedFiles = await saveFiles(mcAddonID, extractedPath)
		console.log(savedFiles)

		return Response(
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
	let allowed: string[] = ["zip", "mcpack", "mcworld", "mcaddon"]
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
		let manifestFile: string = fs.readFileSync(
			extractedPath + "/manifest.json",
			"utf-8"
		) // is file exists...
		JSON.parse(manifestFile) // try to read result

		return true
	} catch (e) {
		console.log("Manifest-check: " + e)
		return false
	}
}

async function saveAddon(fileName: string, fileHash: string): Promise<number> {
	let extractedPath: string =
		path.resolve("./uploads/extracted") + "/" + fileHash

	let manifestFile = fs.readFileSync(
		extractedPath + "/manifest.json",
		"utf-8"
	) // is file exists...

	let manifest = JSON.parse(manifestFile) // try to read result

	// search for duplicates
	let search = await db.mc_addons.findMany({
		where: {
			uuid: manifest.header.uuid,
		},
	})

	// if existed = return false
	if (search.length > 0) {
		return -1
	}

	// insert addon itself
	let mcAddon = await db.mc_addons.create({
		data: {
			filepath: fileName,
			folderpath: fileHash,
			uuid: manifest.header.uuid,
		},
	})

	// insert all dependencies
	let dependencies = manifest.dependencies
	let insertedDepsList = []
	if (manifest && dependencies && dependencies.length > 0) {
		for (const dep of dependencies) {
			let insertedDep = await db.mc_dependencies.create({
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

async function saveFiles(mcAddonID: number, extractedPath: string) {
	// todo: work with db
	let fileList: string[] = findInDir(extractedPath, /\.json$/)

	let results = []

	for (let file of fileList) {
		let path: string[] = file
			.toString()
			.split(extractedPath)
			.pop()
			.split("/")
			.filter(Boolean) // clear [' ', ''] (empty elements)

		let fileName: string = path[path.length - 1]
		let fileRelativePath: string = path.join("/")

		if (path.length > 1) {
			// json files in directories
			let fileType: string = path[0]

			let result = await fileSwitcher(
				mcAddonID,
				fileType,
				fileName,
				fileRelativePath
			)
			results.push(result)
		} else {
			// else -> json files in root, manifest.json for example.
			let fileType = "other"

			let result = await fileSwitcher(
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
