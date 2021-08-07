import express from "express"
import fileUpload from "express-fileupload"
import path from "path"
import Upload from "./logic/Upload"
import db from "./utils/Database/Database"

const app = express()
const port = 3000

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.resolve("./uploads/_temp"),
	})
)

app.post("/upload", async (req: express.Request, res: express.Response) => {
	await Upload(req, res)
})

app.get(
	"/checkDatabase",
	async (req: express.Request, res: express.Response) => {
		let version = await db.$queryRaw("SELECT version()")

		return res.json({
			version,
		})
	}
)

app.listen(port, () => {
	console.log("Cute Engine 4")
	console.log(`Listening at: ${port}`)
})
