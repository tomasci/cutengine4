import express from "express"
import fileUpload from "express-fileupload"
import path from "path"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import morgan from "morgan"
import bodyParser from "body-parser"
import cors from "cors"

import Upload from "./logic/Upload"
import db from "./utils/Database/Database"
import {usersRouter} from "./routes/Users"
import {modsRouter} from "./routes/Mods"

dotenv.config()

const app = express()
const port: number = Number(process.env.PORT)

// logger
app.use(morgan("tiny"))

// cors
app.use(cors())

// body parser
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
)
app.use(bodyParser.json())

// file upload
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.resolve("./uploads/_temp"),
	})
)

app.use("/uploads", express.static(path.resolve("./uploads")))

app.use("/users", usersRouter)
app.use("/mods", modsRouter)

app.post("/upload", async (req: express.Request, res: express.Response) => {
	await Upload(req, res)
})

// app.get("/mods", async (req: express.Request, res: express.Response) => {
// 	res.json({
// 		page: "first",
// 	})
// })
//
// app.get("/mods/:page", async (req: express.Request, res: express.Response) => {
// 	// await Mods.getAll()
// 	res.json({
// 		page: req.params.page,
// 	})
// })

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
