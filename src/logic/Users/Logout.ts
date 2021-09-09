import express from "express"
import db from "../../utils/Database/Database"
import {users_outdated_tokens} from "../../../prisma/client"
import Response from "../../utils/Response/Response"

async function logout(
	req: express.Request,
	res: express.Response
): Promise<void> {
	const token = req.user.token
	const save = await saveInDatabase(token)

	Response(
		res,
		{
			error: false,
		},
		{
			logout: save,
		}
	)
	return
}

async function saveInDatabase(token: string): Promise<users_outdated_tokens> {
	return db.users_outdated_tokens.create({
		data: {
			token: token,
			reason: "logout",
		},
	})
}

export default logout
