import express from "express"
import getMod from "../logic/Mods/getMod"
import getByPage from "../logic/Mods/getByPage"

const router = express()

router.get("/get/:id", async (req: express.Request, res: express.Response) => {
	await getMod(req, res)
})

router.get(
	"/page/:page",
	async (req: express.Request, res: express.Response) => {
		await getByPage(req, res)
	}
)

export const modsRouter = router
