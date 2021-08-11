import jwt from "jsonwebtoken"

function signToken(payload) {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES,
	})
}

export default signToken
