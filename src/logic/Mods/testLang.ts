// import express from "express"
// import findInDir from "../../utils/Search/FindInDir"
// import path from "path"
// import * as fs from "fs"
// import Utils from "../../utils/Utils"
//
// async function testLang(req: express.Request, res: express.Response) {
// 	// 1. get lang files in dir -> [] | ['lang_LANG', ...]
// 	// 2. check is en_US or en_GB there and if not select first -> string(lang_LANG)
// 	// 3. read file
// 	// 4. parse file and make array
// 	let folderHash: string = "1f916255-da9b-4234-881b-7a362639b6b7"
// 	// 1f916255-da9b-4234-881b-7a362639b6b7
// 	// 44a98d20-f704-41ae-8815-fd34f6371813
// 	let folderPath: string = path.resolve(
// 		process.env.STATIC_DIR + "/extracted/" + folderHash
// 	)
// 	let langList: string[] = getLangList(folderPath)
// 	let lang: string = findInArray(langList, ["en_US.lang", "en_GB.lang"])
// 	let langFile = readFile(folderPath, lang)
// 	let parsedFile = parseFile(langFile)
//
// 	for (let l of parsedFile) {
// 		if (l.key === "pack.name" || l.key === "pack.nam") {
// 			console.log(true)
// 		}
// 	}
// }
//
// function getLangList(folderPath: string): string[] {
// 	let listOfFiles: string[] = findInDir(folderPath + "/texts", /\.lang$/)
// 	let formattedList: string[] = []
//
// 	for (let file of listOfFiles) {
// 		let f: string[] = file.split("/")
// 		formattedList.push(f[f.length - 1])
// 	}
//
// 	return formattedList
// }
//
// function findInArray(array: any[], query: any[]): string {
// 	for (let q of query) {
// 		let search = array.includes(q)
//
// 		if (search) {
// 			return q
// 		}
// 	}
//
// 	return array[0]
// }
//
// function readFile(folderPath: string, lang: string) {
// 	return fs.readFileSync(folderPath + "/texts/" + lang, "utf-8")
// }
//
// function parseFile(fileContent: string) {
// 	let lines = fileContent.split(/\r?\n/)
// 	let parsed: {key: string; value: string}[] = []
//
// 	for (let line of lines) {
// 		let kv = line.split("=")
//
// 		if (kv[0] && kv[1] && !Utils.isEmpty(kv[0]) && !Utils.isEmpty(kv[1])) {
// 			parsed.push({
// 				key: kv[0],
// 				value: kv[1],
// 			})
// 		}
// 	}
//
// 	return parsed
// }
//
// export default testLang
