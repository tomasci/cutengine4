import express, {NextFunction} from "express"
import auth from "../utils/Security/Auth"
import signIn from "../logic/Users/SignIn"
import signUp from "../logic/Users/SignUp"
import getMe from "../logic/Users/GetMe"
import logout from "../logic/Users/Logout"

const router = express()

router.post(
	"/signin",
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			await signIn(req, res)
		} catch (e) {
			next(e)
		}
	}
)

router.post(
	"/signup",
	auth,
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			await signUp(req, res)
		} catch (e) {
			next(e)
		}
	}
)

// signup requires auth because I dont have a need to disable it fully, but also I dont want to allow anyone to create account, but me...

router.get(
	"/me",
	auth,
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			await getMe(req, res)
		} catch (e) {
			next(e)
		}
	}
)

router.get(
	"/logout",
	auth,
	async (req: express.Request, res: express.Response, next: NextFunction) => {
		try {
			await logout(req, res)
		} catch (e) {
			next(e)
		}
	}
)

export const usersRouter = router
