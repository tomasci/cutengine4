import express from "express"
import getImage from "../logic/OpenGraph/Image"

const router = express()

router.get(
	"/image/:id",
	async (req: express.Request, res: express.Response) => {
		await getImage(req, res)
	}
)

export const ogRouter = router
