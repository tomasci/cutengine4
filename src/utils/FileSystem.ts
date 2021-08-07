import fs from "fs";

class FileSystem {
    static deleteFile(path) {
        try {
            fs.unlinkSync(path)
        } catch (e) {
            console.log('Delete-file: ' + e)
        }
    }

    static deleteFolder(path) {
        try {
            fs.rmdirSync(path, {
                recursive: true
            })
        } catch (e) {
            console.log('Delete-folder: ' + e)
        }
    }
}

export default FileSystem