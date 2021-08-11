import express from "express"
import db from "../../utils/Database/Database"
import {users} from "../../../prisma/client"
import Response from "../../utils/Response/Response"

async function getMe(req: express.Request, res: express.Response) {
	let userID = Number(req.user.id)
	let user = await getUser(userID)

	return Response(
		res,
		{
			error: false,
		},
		{
			user,
		}
	)
}

async function getUser(id: number): Promise<users> {
	let user = await db.users.findUnique({
		where: {
			id: id,
		},
	})
	user.hash = null

	return user
}

export default getMe
