import express from "express"
import fileUpload from "express-fileupload"
import path from "path"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import morgan from "morgan"
import bodyParser from "body-parser"

import Upload from "./logic/Upload"
import db from "./utils/Database/Database"
import auth from "./utils/Security/Auth"
import testRouter from "./router/TestRoutes"
import {usersRouter} from "./routes/Users"

dotenv.config()

const app = express()
const port: number = Number(process.env.PORT)

app.use(morgan("tiny"))
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
)
app.use(bodyParser.json())

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.resolve("./uploads/_temp"),
	})
)

app.post("/upload", async (req: express.Request, res: express.Response) => {
	await Upload(req, res)
})

app.use("/users", usersRouter)

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

// app.post("/session/create", async (request, reply) => {
// 	let payload = {
// 		id: 1,
// 	}
//
// 	let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1m"})
//
// 	reply.json({
// 		accessToken: token,
// 	})
// })
//
// app.get("/private", auth, async (request: express.Request, reply) => {
// 	reply.json({
// 		private: true,
// 		// user: request.user.id
// 		user: request.user.id,
// 	})
// })
//
// app.use("/test", testRouter)

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
