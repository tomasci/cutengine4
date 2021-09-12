import express, {NextFunction} from "express"
import fileUpload from "express-fileupload"
import path from "path"
import dotenv from "dotenv"
// import jwt from "jsonwebtoken"
import morgan from "morgan"
import bodyParser from "body-parser"
import cors from "cors"

import Upload from "./logic/Upload"
import db from "./utils/Database/Database"
import {usersRouter} from "./routes/Users"
import {modsRouter} from "./routes/Mods"
import auth from "./utils/Security/Auth"
import {ogRouter} from "./routes/OpenGraph"

dotenv.config()

const app = express()
const port = Number(process.env.PORT)

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
		tempFileDir: path.resolve(process.env.TEMP_FILE_DIR),
	})
)

// static
app.use("/uploads", express.static(path.resolve(process.env.STATIC_DIR)))

// console.log(path.resolve(process.env.TEMP_FILE_DIR))
// console.log(path.resolve(process.env.STATIC_DIR))

// routes
app.use("/users", usersRouter)
app.use("/mods", modsRouter)
app.use("/og", ogRouter)

app.post(
	"/upload",
	auth,
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			await Upload(req, res)
		} catch (e) {
			next(e)
		}
	}
)

app.get(
	"/checkDatabase",
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			const version = await db.$queryRaw("SELECT version()")

			return res.json({
				version,
			})
		} catch (e) {
			next(e)
		}
	}
)

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log("Cute Engine 4")
	// eslint-disable-next-line no-console
	console.log(`Listening at: ${port}`)
})
