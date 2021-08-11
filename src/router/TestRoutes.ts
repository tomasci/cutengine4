import express from "express"

const testRouter = express()

testRouter.get("/abc", async (req, res) => {
	res.json({
		test: "/abc",
	})
})

export default testRouter
