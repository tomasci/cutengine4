import express from "express"

interface IStatusResponse {
	error: boolean
	code?: number
	message?: string
}

function Response<T>(
	res: express.Response,
	status: IStatusResponse,
	data?: T
): express.Response {
	return res.status(status.code ? status.code : 200).json({
		status,
		data: data ? data : {},
	})
}

export default Response
