import express, {NextFunction} from "express"
import getImage from "../logic/OpenGraph/Image"

const router = express()

router.get(
	"/image/:id",
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			await getImage(req, res)
		} catch (e) {
			next(e)
		}
	}
)

export const ogRouter = router
