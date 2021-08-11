import express from "express"
import auth from "../utils/Security/Auth"
import signUp from "../logic/Users/NewUser"

const router = express()

router.post("/signin", async (req: express.Request, res: express.Response) => {
	// post username & password
	res.json({
		r: "sign in",
	})
})

router.post("/signup", async (req: express.Request, res: express.Response) => {
	await signUp(req, res)
})

router.get("/me", auth, async (req: express.Request, res: express.Response) => {
	// reply with current user info
	res.json({
		r: "get me",
	})
})

export const usersRouter = router
