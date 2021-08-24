import express from "express"
import Response from "../../utils/Response/Response"
import db from "../../utils/Database/Database"
import path from "path"
import fs from "fs"
import {site_posts} from "../../../prisma/client"

async function getAddon(req: express.Request, res: express.Response) {
	let addonID = Number(req.params.id)

	if (!Boolean(addonID)) {
		return Response(res, {
			error: true,
			code: 500,
			message: "Post ID must be Number. #202131108200300",
		})
	}

	let exists = await isExists(addonID)
	if (!exists) {
		return Response(res, {
			error: true,
			code: 404,
			message: "Not Found. #202131108220400",
		})
	}

	let addon = await getAddonWithDeps(addonID)
	// if (
	// 	addon.mc_addon.pack_name === "pack.name" ||
	// 	addon.mc_addon.pack_description === "pack.description"
	// ) {
	// 	let addonLanguage = await getAddonLanguage(addon.mc_addon.folderpath)
	// 	addon.mc_addon.pack_name = addonLanguage.find(
	// 		(s) => s.key === "pack.name"
	// 	).value
	// 	addon.mc_addon.pack_description = addonLanguage.find(
	// 		(s) => s.key === "pack.description"
	// 	).value
	// }

	return Response(
		res,
		{
			error: false,
		},
		{
			addon,
		}
	)
}

async function isExists(id: number): Promise<boolean> {
	let search = await db.mc_addons.count({
		where: {
			id: id,
			isPublished: true,
		},
	})

	return search > 0
}

async function getAddonWithDeps(id: number) {
	let mc_addon = await db.mc_addons.findUnique({
		where: {
			id: id,
		},
	})

	let mc_dependenciesList = await db.mc_dependencies.findFirst({
		where: {
			OR: [
				{
					mca_id: mc_addon.id,
				},
				{
					uuid: mc_addon.uuid,
				},
			],
		},
	})

	let mc_dependencies = []

	if (mc_dependenciesList) {
		if (mc_dependenciesList.uuid === mc_addon.uuid) {
			let dep = await db.mc_addons.findFirst({
				where: {
					id: mc_dependenciesList.mca_id,
					pack_version: mc_addon.pack_version,
				},
			})
			mc_dependencies.push(dep)
		} else if (mc_dependenciesList.mca_id === mc_addon.id) {
			let dep = await db.mc_addons.findFirst({
				where: {
					uuid: mc_dependenciesList.uuid,
					pack_version: mc_addon.pack_version,
				},
			})
			mc_dependencies.push(dep)
		}
	}

	return {
		mc_addon,
		mc_dependencies,
	}

	//
	// // console.log(mc_addon)
	//
	// let mc_dependenciesList = await db.mc_dependencies.findMany({
	// 	where: {
	// 		mca_id: mc_addon.id,
	// 	},
	// })
	//
	// // console.log(mc_dependenciesList)
	//
	// let mc_dependencies = []
	// for (let line of mc_dependenciesList) {
	// 	let dep = await db.mc_addons.findFirst({
	// 		where: {
	// 			uuid: line.uuid,
	// 			pack_version: mc_addon.pack_version,
	// 		},
	// 	})
	//
	// 	mc_dependencies.push(dep)
	// }
	//
	// // console.log(mc_dependencies)
	//
	// return {
	// 	mc_addon,
	// 	// mc_dependencies,
	// }

	// return db.site_posts.findUnique({
	// 	where: {
	// 		id: id,
	// 	},
	// 	include: {
	// 		site_post_attachments: {
	// 			include: {
	// 				mc_addons: true,
	// 			},
	// 		},
	// 	},
	// })
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
// 				correctLang.push({
// 					key: l[0],
// 					value: l[1],
// 				})
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
// 		correctLang.push({
// 			key: l[0],
// 			value: l[1],
// 		})
// 	}
//
// 	return correctLang
//
// 	// if (languagesJson.find((s) => s === "en_US")) {
// 	// 	let readTextFile = fs.readFileSync(folderPath + "/texts/en_US.lang", "utf-8")
// 	// 	console.log(readTextFile)
// 	// }
// 	//
// 	// if (languagesJson.find((s) => s === "en_GB")) {
// 	// 	let readTextFile = fs.readFileSync(folderPath + "/texts/en_US.lang", "utf-8")
// 	// 	console.log(readTextFile)
// 	// }
// }

export default getAddon
