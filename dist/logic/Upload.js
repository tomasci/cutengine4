"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const extract_zip_1 = __importDefault(require("extract-zip"));
const FileSystem_1 = __importDefault(require("../utils/FileSystem"));
const FindInDir_1 = __importDefault(require("../utils/Search/FindInDir"));
const Response_1 = __importDefault(require("../utils/Response/Response"));
function Upload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // check for empty files array
        let isEmpty = emptyFilesCheck(req.files);
        if (!isEmpty) {
            return Response_1.default(res, {
                error: true,
                code: 400,
                message: 'File was not selected.'
            });
        }
        // not good, but https://github.com/richardgirges/express-fileupload/issues/156
        let file = req.files.addon;
        // let fileExtension = mime.extension(file.mimetype) // this is bad, because when .mc* uploaded it is detected as bin.
        let fileExtension = file.name.toString().split('.').pop();
        let fileHash = uuid_1.v4();
        let fileName = fileHash + '.' + fileExtension;
        let filePath = [path_1.default.resolve('./uploads/source') + '/'].join('');
        // check extension before continue
        let isExtensionCorrect = extensionCheck(fileExtension);
        if (!isExtensionCorrect) {
            return Response_1.default(res, {
                error: true,
                code: 500,
                message: 'File format error.'
            });
        }
        // move
        file.mv(filePath + fileName, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return Response_1.default(res, {
                    error: true,
                    code: 500,
                    message: err
                });
            }
            // extract pack after moving but before sending result
            let zipPath = filePath + fileName;
            let extractedPath = path_1.default.resolve('./uploads/extracted') + '/' + fileHash;
            let isExtracted = yield extract(zipPath, extractedPath);
            if (!isExtracted) {
                clear(zipPath, extractedPath);
                return Response_1.default(res, {
                    error: true,
                    code: 500,
                    message: 'The archive may be damaged.'
                });
            }
            // todo: if isExtracted is true check manifest here
            let isManifest = checkManifest(extractedPath);
            if (!isManifest) {
                clear(zipPath, extractedPath);
                return Response_1.default(res, {
                    error: true,
                    code: 500,
                    message: 'Bad manifest.'
                });
            }
            // todo: if all "is" is "true" then work with files and DB
            return Response_1.default(res, {
                error: false
            }, {
                fileName,
                filePath
            });
        }));
    });
}
function clear(zipPath, extractedPath) {
    FileSystem_1.default.deleteFile(zipPath);
    FileSystem_1.default.deleteFolder(extractedPath);
}
function emptyFilesCheck(files) {
    return !(!files || Object.keys(files).length === 0);
}
function extensionCheck(fileExtension) {
    let allowed = ['zip', 'mcpack', 'mcworld', 'mcaddon'];
    return !!allowed.find(line => line === fileExtension);
}
function extract(zipPath, extractedPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield extract_zip_1.default(zipPath, {
                dir: extractedPath
            });
            return true;
        }
        catch (e) {
            console.log('Zip-extract: ' + e);
            return false;
        }
    });
}
function checkManifest(extractedPath) {
    try {
        let manifestFile = fs_1.default.readFileSync(extractedPath + '/manifest.json', 'utf-8'); // is file exists...
        JSON.parse(manifestFile); // try to read result
        return true;
    }
    catch (e) {
        console.log('Manifest-check: ' + e);
        return false;
    }
}
function saveToDatabase(zipPath, extractedPath) {
    // save addon itself
    saveAddon(zipPath, extractedPath);
    // save all addon files
    saveFiles(extractedPath);
}
function saveAddon(zipPath, extractedPath) {
    // todo: insert into db manifest data (mc_addons, mc_dependencies)
    let manifestFile = fs_1.default.readFileSync(extractedPath + '/manifest.json', 'utf-8'); // is file exists...
    let manifest = JSON.parse(manifestFile); // try to read result
    console.log(manifest);
}
function saveFiles(extractedPath) {
    // todo: work with db
    let fileList = FindInDir_1.default(extractedPath, /\.json$/);
    for (let file of fileList) {
        let path = file
            .toString()
            .split(extractedPath)
            .pop()
            .split('/')
            .filter(Boolean); // clear [' ', ''] (empty elements)
        if (path.length > 1) {
            let fileType = path[0];
            let fileName = path[path.length - 1];
            let fileRelativePath = path.join('/');
            workWithDatabase(fileType, fileName, fileRelativePath);
        }
        // else -> json files in root, manifest.json for example.
    }
}
function workWithDatabase(fileType, fileName, fileRelativePath) {
    console.log(fileType, fileName, fileRelativePath);
}
exports.default = Upload;
//# sourceMappingURL=Upload.js.map