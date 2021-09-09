import db from "../../utils/Database/Database"
import express from "express"
import Response from "../../utils/Response/Response"
import {users} from "../../../prisma/client"
import Utils from "../../utils/Utils"
import bcrypt from "bcrypt"

interface ISignUpData {
	username: string
	password: string
	email: string
}

const saltRounds = Number(process.env.SALT_ROUNDS)

async function signUp(
	req: express.Request,
	res: express.Response
): Promise<void> {
	const userData: ISignUpData = req.body

	const empty: boolean = isEmpty(userData)
	if (empty) {
		Response(res, {
			error: true,
			code: 500,
			message: "Empty username, password or email. #202131108200410",
		})
		return
	}

	const exists: boolean = await isExists(userData.username)
	if (exists) {
		Response(res, {
			error: true,
			code: 500,
			message:
				"User with this username is already exists. #202131108200415",
		})
		return
	}

	const user: users = await newUser(
		userData.username,
		userData.password,
		userData.email
	)
	user.hash = null
	// because there are no sense to send it back

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

function isEmpty(userData: ISignUpData): boolean {
	return (
		Utils.isEmpty(userData.username) ||
		Utils.isEmpty(userData.password) ||
		Utils.isEmpty(userData.email)
	)
}

export async function isExists(username: string): Promise<boolean> {
	const search = await db.users.count({
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
	const salt: string = await bcrypt.genSalt(saltRounds)
	const hash: string = await bcrypt.hash(password, salt)

	return db.users.create({
		data: {
			username: username,
			hash: hash,
			email: email,
		},
	})
}

export default signUp
