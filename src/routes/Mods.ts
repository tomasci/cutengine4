import express, {NextFunction} from "express"
import getByPage from "../logic/Mods/getByPage"
import getAddon from "../logic/Mods/getAddon"

const router = express()

router.get(
	"/page/:page",
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			await getByPage(req, res)
		} catch (e) {
			next(e)
		}
	}
)

router.get(
	"/addon/:id",
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			await getAddon(req, res)
		} catch (e) {
			next(e)
		}
	}
)

export const modsRouter = router
