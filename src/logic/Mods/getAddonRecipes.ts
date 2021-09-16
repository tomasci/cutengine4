import express from "express"
import Response from "../../utils/Response/Response"
import db from "../../utils/Database/Database"
import {mc_addons, mca_recipes} from "../../../prisma/client"
import path from "path"
import * as fs from "fs"

async function getAddonRecipes(
	req: express.Request,
	res: express.Response
): Promise<void> {
	const addonID = Number(req.params.id)
	const isNumber = Boolean(addonID)

	if (!isNumber) {
		Response(res, {
			error: true,
			code: 500,
			message: "Post ID must be Number.",
		})
		return
	}

	const exists = await doesExists(addonID)
	if (!exists) {
		Response(res, {
			error: true,
			code: 404,
			message: "Addon not Found.",
		})
		return
	}

	let packs: {dp: mc_addons; rp: mc_addons}
	try {
		packs = await getPacks(addonID)
	} catch (e) {
		Response(res, {
			error: true,
			code: 404,
			message: "Data-pack not found.",
		})
		return
	}

	let recipesMeta: mca_recipes[]
	try {
		recipesMeta = await getRecipesMeta(packs)
	} catch (e) {
		Response(res, {
			error: true,
			code: 404,
			message: "This pack doesn't contain any recipes.",
		})
		return
	}

	let recipes
	try {
		recipes = await getRecipes(packs, recipesMeta)
	} catch (e) {
		Response(res, {
			error: true,
			code: 500,
			message: "Something went wrong with reading recipe list.",
		})
		return
	}

	Response(
		res,
		{
			error: false,
		},
		{
			// packs,
			// recipesMeta,
			recipes,
		}
	)
	return
}

async function doesExists(id: number): Promise<boolean> {
	const search = await db.mc_addons.count({
		where: {
			id: id,
			isPublished: true,
		},
	})

	return search > 0
}

async function getPacks(id: number) {
	// if it is already data-pack - then just return it mc_addons record
	// if not (resources-pack) - then try to find data-pack for it
	// and if nothing found return error.

	const mc_addon = await db.mc_addons.findUnique({
		where: {
			id: id,
		},
	})

	if (mc_addon.pack_type === "data") {
		// already data-pack
		// todo: need to return not only datapack, but also RP
		const mc_dep = await db.mc_dependencies.findFirst({
			where: {
				mca_id: mc_addon.id,
			},
		})

		// return resource pack
		const resourcesPack = await db.mc_addons.findFirst({
			where: {
				uuid: mc_dep.uuid,
				pack_version: mc_addon.pack_version,
			},
		})

		return {
			dp: mc_addon,
			rp: resourcesPack,
		}
	} else if (mc_addon.pack_type === "resources") {
		// search for dependency
		const mc_dep = await db.mc_dependencies.findFirst({
			where: {
				uuid: mc_addon.uuid,
			},
		})

		// return data-pack
		const dataPack = await db.mc_addons.findFirst({
			where: {
				id: mc_dep.mca_id,
				pack_version: mc_addon.pack_version,
			},
		})

		return {
			dp: dataPack,
			rp: mc_addon,
		}
	} else {
		// other types of packs.
		throw new Error(
			"Data-pack not found. There are now way to get recipes for this ID."
		)
	}
}

async function getRecipesMeta(packs: {
	rp: mc_addons
	dp: mc_addons
}): Promise<mca_recipes[]> {
	const mc_recipes = await db.mca_recipes.findMany({
		where: {
			mca_id: packs.dp.id,
		},
	})

	if (mc_recipes.length < 1) {
		throw new Error("No recipes for this addon.")
	}

	return mc_recipes
}

async function getRecipes(
	packs: {rp: mc_addons; dp: mc_addons},
	recipesMeta: mca_recipes[]
) {
	let recipeList = []

	for (const recipe of recipesMeta) {
		const data = await sysReadFileJson(packs.dp.folderpath, recipe.filepath)
		if (data && data["minecraft:recipe_shaped"]) {
			const pattern = data["minecraft:recipe_shaped"].pattern
			const keys = data["minecraft:recipe_shaped"].key
			const result = data["minecraft:recipe_shaped"].result

			let computedPattern = []
			for (const line of pattern) {
				const lineArray = line.split("")
				computedPattern.push(lineArray)
			}

			let computedKeys = []
			Object.keys(keys).map((entry) => {
				const keyObj: {
					key: string
					value: string
				} = {
					key: entry,
					value: keys[entry].item,
				}

				// todo: get lang for value (item) here
				if (keyObj.value.startsWith("minecraft:")) {
					// it is default minecraft
				} else {
					// it is current pack
				}
				//

				computedKeys.push(keyObj)
			})

			let recipeObject = {
				pattern: computedPattern,
				keys: computedKeys,
				result: Array.isArray(result) ? result[0] : result,
			}

			recipeList.push(recipeObject)
		}
	}

	return recipeList
}

async function sysReadFileJson(folderPath: string, filePath: string) {
	// todo: move to FileSystem.ts and update all other logic files with this.
	const addonDir: string = path.resolve(
		process.env.STATIC_DIR + "/extracted/" + folderPath
	)
	const jsonFile: string = fs
		.readFileSync(addonDir + "/" + filePath, "utf-8")
		.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
			g ? "" : m
		) // clear comments. fucking stupid mod creators.

	return JSON.parse(jsonFile)
}

export default getAddonRecipes
