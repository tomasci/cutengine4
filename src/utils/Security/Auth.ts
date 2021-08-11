import express, {NextFunction} from "express"
import jwt from "jsonwebtoken"
import Response from "../Response/Response"
import db from "../Database/Database"

interface User {
	id: number
}

declare global {
	namespace Express {
		interface Request {
			user: User
		}
	}
}

const jwtSecret = process.env.JWT_SECRET

const auth = async (
	req: express.Request,
	res: express.Response,
	next: NextFunction
) => {
	const header = req.headers.authorization

	if (header) {
		let token: string = header.split(" ")[1] // "Bearer a1b2..."

		jwt.verify(token, jwtSecret, async (err, decoded) => {
			if (err) {
				console.log("Auth error:", err)
				return Response(res, {
					error: true,
					code: 403,
					message: "Token expired. #202130908231520",
				})
			}

			if (decoded) {
				try {
					let findToken: number =
						await db.users_outdated_tokens.count({
							where: {
								token: token,
							},
						})

					if (findToken > 0) {
						return Response(res, {
							error: true,
							code: 403,
							message:
								"Token banned or expired. #202130908231545",
						})
					}
				} catch (err) {
					console.log("Auth error:", err)
					return Response(res, {
						error: true,
						code: 403,
						message: "Some authentication error. #202130908231427",
					})
				}

				let payload = JSON.parse(JSON.stringify(decoded))
				req.user = {
					id: payload.id,
				}

				next()
			}
		})
	} else {
		return Response(res, {
			error: true,
			code: 403,
			message: "Token must be provided. #202130908231700",
		})
	}
}

export default auth
