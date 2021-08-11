import express from "express"
import getMod from "../logic/Mods/getMod"

const router = express()

router.get("/get/:id", async (req: express.Request, res: express.Response) => {
	await getMod(req, res)
})

export const modsRouter = router
