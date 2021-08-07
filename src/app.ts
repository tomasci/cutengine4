import express from 'express'
import fileUpload from "express-fileupload"
import path from 'path'
import Upload from "./logic/Upload";

const app = express()
const port = 3000

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.resolve('./uploads/_temp')
}))

app.post('/upload', async (req: express.Request, res: express.Response) => {
    await Upload(req, res)
})

app.listen(port, () => {
    console.log(`Listening at: ${port}`)
})