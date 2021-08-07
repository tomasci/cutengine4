import path from "path"
import fs from "fs"
import {v4 as uuid} from "uuid"
import extractZip from 'extract-zip'
import FileSystem from "../utils/FileSystem";
import findInDir from "../utils/Search/FindInDir";
import express from "express";
import {FileArray, UploadedFile} from "express-fileupload";
import Response from "../utils/Response/Response";

async function Upload(req: express.Request, res: express.Response) {
    // check for empty files array
    let isEmpty: boolean = emptyFilesCheck(req.files)
    if (!isEmpty) {
        return Response(res, {
            error: true,
            code: 400,
            message: 'File was not selected.'
        })
    }

    // not good, but https://github.com/richardgirges/express-fileupload/issues/156
    let file: UploadedFile = req.files.addon as UploadedFile
    // let fileExtension = mime.extension(file.mimetype) // this is bad, because when .mc* uploaded it is detected as bin.
    let fileExtension: string = file.name.toString().split('.').pop()
    let fileHash: string = uuid()
    let fileName: string = fileHash + '.' + fileExtension
    let filePath: string = [path.resolve('./uploads/source') + '/'].join('')

    // check extension before continue
    let isExtensionCorrect: boolean = extensionCheck(fileExtension)
    if(!isExtensionCorrect) {
        return Response(res, {
            error: true,
            code: 500,
            message: 'File format error.'
        })
    }

    // move
    file.mv(filePath + fileName, async (err) => {
        if (err) {
            return Response(res, {
                error: true,
                code: 500,
                message: err
            })
        }

        // extract pack after moving but before sending result
        let zipPath: string = filePath + fileName
        let extractedPath: string = path.resolve('./uploads/extracted') + '/' + fileHash
        let isExtracted: boolean = await extract(zipPath, extractedPath)
        if (!isExtracted) {
            clear(zipPath, extractedPath)

            return Response(res, {
                error: true,
                code: 500,
                message: 'The archive may be damaged.'
            })
        }

        // todo: if isExtracted is true check manifest here
        let isManifest: boolean = checkManifest(extractedPath)
        if (!isManifest) {
            clear(zipPath, extractedPath)

            return Response(res, {
                error: true,
                code: 500,
                message: 'Bad manifest.'
            })
        }

        // todo: if all "is" is "true" then work with files and DB


        return Response(res, {
            error: false
        }, {
            fileName,
            filePath
        })
    })
}

function clear(zipPath, extractedPath) {
    FileSystem.deleteFile(zipPath)
    FileSystem.deleteFolder(extractedPath)
}

function emptyFilesCheck(files: FileArray): boolean {
    return !(!files || Object.keys(files).length === 0)
}

function extensionCheck(fileExtension: string): boolean {
    let allowed: string[] = ['zip', 'mcpack', 'mcworld', 'mcaddon']
    return !!allowed.find(line => line === fileExtension)
}

async function extract(zipPath: string, extractedPath: string): Promise<boolean> {
    try {
        await extractZip(zipPath, {
            dir: extractedPath
        })

        return true
    } catch (e) {
        console.log('Zip-extract: ' + e)
        return false
    }
}

function checkManifest(extractedPath: string): boolean {
    try {
        let manifestFile: string = fs.readFileSync(extractedPath + '/manifest.json', 'utf-8') // is file exists...
        JSON.parse(manifestFile) // try to read result

        return true
    } catch (e) {
        console.log('Manifest-check: ' + e)
        return false
    }
}

function saveToDatabase(zipPath: string, extractedPath: string) {
    // save addon itself
    saveAddon(zipPath, extractedPath)

    // save all addon files
    saveFiles(extractedPath)
}

function saveAddon(zipPath: string, extractedPath: string) {
    // todo: insert into db manifest data (mc_addons, mc_dependencies)
    let manifestFile = fs.readFileSync(extractedPath + '/manifest.json', 'utf-8') // is file exists...
    let manifest = JSON.parse(manifestFile) // try to read result
    console.log(manifest)
}

function saveFiles(extractedPath: string) {
    // todo: work with db
    let fileList: string[] = findInDir(extractedPath, /\.json$/)

    for (let file of fileList) {
        let path: string[] = file
            .toString()
            .split(extractedPath)
            .pop()
            .split('/')
            .filter(Boolean) // clear [' ', ''] (empty elements)

        if (path.length > 1) {
            let fileType: string = path[0]
            let fileName: string = path[path.length - 1]
            let fileRelativePath: string = path.join('/')

            workWithDatabase(fileType, fileName, fileRelativePath)
        }
        // else -> json files in root, manifest.json for example.
    }
}

function workWithDatabase(fileType: string, fileName: string, fileRelativePath: string) {
    console.log(fileType, fileName, fileRelativePath)
}

export default Upload