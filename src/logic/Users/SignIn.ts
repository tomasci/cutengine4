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

async function signIn(req: express.Request, res: express.Response) {
	let userData: ISignInData = req.body

	let empty: boolean = isEmpty(userData)
	if (empty) {
		return Response(res, {
			error: true,
			code: 500,
			message: "Username or password is empty. #202131108200310",
		})
	}

	let exists: boolean = await isExists(userData.username)
	if (!exists) {
		return Response(res, {
			error: true,
			code: 500,
			message: "User does not exist. #202131108200320",
		})
	}

	let credentialsCorrect = await isCredentialsCorrect(
		userData.username,
		userData.password
	)
	if (!credentialsCorrect) {
		return Response(res, {
			error: true,
			code: 500,
			message: "Wrong password. #202131108200400",
		})
	}

	let user = await getUser(userData.username)
	let token = signToken({
		id: user.id,
	})

	return Response(
		res,
		{
			error: false,
		},
		{
			user,
			token,
		}
	)
}

function isEmpty(userData: ISignInData): boolean {
	return Utils.isEmpty(userData.username) || Utils.isEmpty(userData.password)
}

async function isCredentialsCorrect(
	username: string,
	password: string
): Promise<boolean> {
	let search = await db.users.findFirst({
		where: {
			username: username,
		},
	})

	return await bcrypt.compare(password, search.hash)
}

async function getUser(username: string): Promise<users> {
	let user = await db.users.findFirst({
		where: {
			username: username,
		},
	})
	user.hash = null

	return user
}

export default signIn
