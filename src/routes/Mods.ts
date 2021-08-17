import express from "express"
import getMod from "../logic/Mods/getMod"
import getByPage from "../logic/Mods/getByPage"
import getAddon from "../logic/Mods/getAddon"

const router = express()

// router.get("/get/:id", async (req: express.Request, res: express.Response) => {
// 	await getMod(req, res)
// })

router.get(
	"/page/:page",
	async (req: express.Request, res: express.Response) => {
		await getByPage(req, res)
	}
)

router.get(
	"/addon/:id",
	async (req: express.Request, res: express.Response) => {
		await getAddon(req, res)
	}
)

export const modsRouter = router
