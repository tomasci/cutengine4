import fs from "fs"
import path from "path"

function findInDir(
	dir: string,
	filter: RegExp,
	fileList: string[] = []
): string[] {
	const files = fs.readdirSync(dir)

	files.forEach((file) => {
		const filePath = path.join(dir, file)
		const fileStat = fs.lstatSync(filePath)

		if (fileStat.isDirectory()) {
			findInDir(filePath, filter, fileList)
		} else if (filter.test(filePath)) {
			fileList.push(filePath)
		}
	})

	return fileList
}

export default findInDir
