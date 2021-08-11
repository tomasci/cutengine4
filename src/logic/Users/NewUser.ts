import db from "../../utils/Database/Database"
import express from "express"
import Response from "../../utils/Response/Response"
import {users} from "../../../prisma/client"
import Utils from "../../utils/Utils"
import bcrypt from "bcrypt"

interface IUserData {
	username: string
	password: string
	email: string
}

const saltRounds: number = Number(process.env.SALT_ROUNDS)

async function signUp(req: express.Request, res: express.Response) {
	let userData: IUserData = req.body
	let empty: boolean = await isEmpty(userData)

	if (empty) {
		return Response(res, {
			error: true,
			code: 500,
			message: "Empty username, password or email.",
		})
	}

	let exists: boolean = await isExists(userData.username)

	if (exists) {
		return Response(res, {
			error: true,
			code: 500,
			message: "User with this username is already exists.",
		})
	}

	let user: users = await newUser(
		userData.username,
		userData.password,
		userData.email
	)
	user.hash = null
	// because there are no sense to send it back

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

async function isEmpty(userData): Promise<boolean> {
	return (
		Utils.isEmpty(userData.username) &&
		Utils.isEmpty(userData.password) &&
		Utils.isEmpty(userData.email)
	)
}

async function isExists(username: string): Promise<boolean> {
	let search = await db.users.count({
		where: {
			username: username,
		},
	})

	return search > 0
}

async function newUser(
	username: string,
	password: string,
	email: string
): Promise<users> {
	let salt: string = await bcrypt.genSalt(saltRounds)
	let hash: string = await bcrypt.hash(password, salt)

	return db.users.create({
		data: {
			username: username,
			hash: hash,
			email: email,
		},
	})
}

export default signUp
