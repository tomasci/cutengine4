import express from "express"
import auth from "../utils/Security/Auth"
import signIn from "../logic/Users/SignIn"
import signUp from "../logic/Users/SignUp"
import getMe from "../logic/Users/GetMe"
import logout from "../logic/Users/Logout"

const router = express()

router.post("/signin", async (req: express.Request, res: express.Response) => {
	await signIn(req, res)
})

router.post("/signup", async (req: express.Request, res: express.Response) => {
	await signUp(req, res)
})

router.get("/me", auth, async (req: express.Request, res: express.Response) => {
	await getMe(req, res)
})

router.get(
	"/logout",
	auth,
	async (req: express.Request, res: express.Response) => {
		await logout(req, res)
	}
)

export const usersRouter = router
