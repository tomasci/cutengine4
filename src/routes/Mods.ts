import express from "express"
// import getMod from "../logic/Mods/getMod"
import getByPage from "../logic/Mods/getByPage"
import getAddon from "../logic/Mods/getAddon"
// import testLang from "../logic/Mods/testLang"

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

// router.get("/testLang", async (req: express.Request, res: express.Response) => {
// 	await testLang(req, res)
// })

export const modsRouter = router
