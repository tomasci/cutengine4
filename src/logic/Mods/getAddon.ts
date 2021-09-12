import express from "express"
import Response from "../../utils/Response/Response"
import db from "../../utils/Database/Database"

// /mods/getAddon/1

async function getAddon(
	req: express.Request,
	res: express.Response
): Promise<void> {
	const addonID = Number(req.params.id)
	const isNumber = Boolean(addonID)

	if (!isNumber) {
		Response(res, {
			error: true,
			code: 500,
			message: "Post ID must be Number. #202131108200300",
		})
		return
	}

	// try {
	const exists = await isExists(addonID)
	// } catch (e) {
	// 	console.log(e)
	// }
	if (!exists) {
		Response(res, {
			error: true,
			code: 404,
			message: "Not Found. #202131108220400",
		})
		return
	}

	const addon = await getAddonWithDeps(addonID)

	Response(
		res,
		{
			error: false,
		},
		{
			addon,
		}
	)
	return
}

async function isExists(id: number): Promise<boolean> {
	const search = await db.mc_addons.count({
		where: {
			id: id,
			isPublished: true,
		},
	})

	return search > 0
}

async function getAddonWithDeps(id: number) {
	const mc_addon = await db.mc_addons.findUnique({
		where: {
			id: id,
		},
	}) // тут уже пусто

	const mc_dependenciesList = await db.mc_dependencies.findFirst({
		where: {
			OR: [
				{
					mca_id: mc_addon.id, // значит и тут уже null
				},
				{
					uuid: mc_addon.uuid,
				},
			],
		},
	})

	const mc_dependencies = []

	if (mc_dependenciesList) {
		if (mc_dependenciesList.uuid === mc_addon.uuid) {
			const dep = await db.mc_addons.findFirst({
				where: {
					id: mc_dependenciesList.mca_id,
					pack_version: mc_addon.pack_version,
				},
			})
			mc_dependencies.push(dep)
		} else if (mc_dependenciesList.mca_id === mc_addon.id) {
			const dep = await db.mc_addons.findFirst({
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
}

export default getAddon
