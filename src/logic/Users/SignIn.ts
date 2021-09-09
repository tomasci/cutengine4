import express from "express"
import Utils from "../../utils/Utils"
import Response from "../../utils/Response/Response"
import {isExists} from "./SignUp"
import db from "../../utils/Database/Database"
import bcrypt from "bcrypt"
import {users} from "../../../prisma/client"
import signToken from "../../utils/Security/SignToken"

interface ISignInData {
	username: string
	password: string
}

async function signIn(
	req: express.Request,
	res: express.Response
): Promise<void> {
	const userData: ISignInData = req.body

	const empty: boolean = isEmpty(userData)
	if (empty) {
		Response(res, {
			error: true,
			code: 500,
			message: "Username or password is empty. #202131108200310",
		})
		return
	}

	const exists: boolean = await isExists(userData.username)
	if (!exists) {
		Response(res, {
			error: true,
			code: 500,
			message: "User does not exist. #202131108200320",
		})
		return
	}

	const credentialsCorrect = await isCredentialsCorrect(
		userData.username,
		userData.password
	)
	if (!credentialsCorrect) {
		Response(res, {
			error: true,
			code: 500,
			message: "Wrong password. #202131108200400",
		})
		return
	}

	const user = await getUser(userData.username)
	const token = signToken({
		id: user.id,
	})

	Response(
		res,
		{
			error: false,
		},
		{
			user,
			token,
		}
	)
	return
}

function isEmpty(userData: ISignInData): boolean {
	return Utils.isEmpty(userData.username) || Utils.isEmpty(userData.password)
}

async function isCredentialsCorrect(
	username: string,
	password: string
): Promise<boolean> {
	const search = await db.users.findFirst({
		where: {
			username: username,
		},
	})

	return await bcrypt.compare(password, search.hash)
}

async function getUser(username: string): Promise<users> {
	const user = await db.users.findFirst({
		where: {
			username: username,
		},
	})
	user.hash = null

	return user
}

export default signIn
