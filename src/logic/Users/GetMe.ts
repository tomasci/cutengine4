import express from "express"
import db from "../../utils/Database/Database"
import {users} from "../../../prisma/client"
import Response from "../../utils/Response/Response"

async function getMe(
	req: express.Request,
	res: express.Response
): Promise<void> {
	const userID = Number(req.user.id)
	const user = await getUser(userID)

	Response(
		res,
		{
			error: false,
		},
		{
			user,
		}
	)
	return
}

async function getUser(id: number): Promise<users> {
	const user = await db.users.findUnique({
		where: {
			id: id,
		},
	})
	user.hash = null

	return user
}

export default getMe
