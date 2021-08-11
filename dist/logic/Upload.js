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
const Database_1 = __importDefault(require("../utils/Database/Database"));
function Upload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // check for empty files array
        let isEmpty = emptyFilesCheck(req.files);
        if (!isEmpty) {
            return Response_1.default(res, {
                error: true,
                code: 400,
                message: "File was not selected.",
            });
        }
        // not good, but https://github.com/richardgirges/express-fileupload/issues/156
        let file = req.files.addon;
        // let fileExtension = mime.extension(file.mimetype) // this is bad, because when .mc* uploaded it is detected as bin.
        let fileExtension = file.name.toString().split(".").pop();
        let fileHash = uuid_1.v4();
        let fileName = fileHash + "." + fileExtension;
        let filePath = [path_1.default.resolve("./uploads/source") + "/"].join("");
        // check extension before continue
        let isExtensionCorrect = extensionCheck(fileExtension);
        if (!isExtensionCorrect) {
            return Response_1.default(res, {
                error: true,
                code: 500,
                message: "File format error.",
            });
        }
        // move
        file.mv(filePath + fileName, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return Response_1.default(res, {
                    error: true,
                    code: 500,
                    message: err,
                });
            }
            // extract pack after moving but before sending result
            let zipPath = filePath + fileName;
            let extractedPath = path_1.default.resolve("./uploads/extracted") + "/" + fileHash;
            let isExtracted = yield extract(zipPath, extractedPath);
            if (!isExtracted) {
                clear(zipPath, extractedPath);
                return Response_1.default(res, {
                    error: true,
                    code: 500,
                    message: "The archive may be damaged.",
                });
            }
            // if isExtracted is true check manifest here
            let isManifest = checkManifest(extractedPath);
            if (!isManifest) {
                clear(zipPath, extractedPath);
                return Response_1.default(res, {
                    error: true,
                    code: 500,
                    message: "Bad manifest.",
                });
            }
            // if all "is" is "true" then work with files and DB
            let mcAddonID = yield saveAddon(fileName, fileHash);
            if (mcAddonID < 0) {
                clear(zipPath, extractedPath);
                return Response_1.default(res, {
                    error: true,
                    code: 500,
                    message: "This addon is already uploaded and saved.",
                });
            }
            // if addon saved - then save all the data
            let savedFiles = yield saveFiles(mcAddonID, extractedPath);
            console.log(savedFiles);
            return Response_1.default(res, {
                error: false,
            }, {
                fileName,
                filePath,
                mcAddonID,
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
    let allowed = ["zip", "mcpack", "mcworld", "mcaddon"];
    return !!allowed.find((line) => line === fileExtension);
}
function extract(zipPath, extractedPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield extract_zip_1.default(zipPath, {
                dir: extractedPath,
            });
            return true;
        }
        catch (e) {
            console.log("Zip-extract: " + e);
            return false;
        }
    });
}
function checkManifest(extractedPath) {
    try {
        let manifestFile = fs_1.default.readFileSync(extractedPath + "/manifest.json", "utf-8"); // is file exists...
        JSON.parse(manifestFile); // try to read result
        return true;
    }
    catch (e) {
        console.log("Manifest-check: " + e);
        return false;
    }
}
function saveAddon(fileName, fileHash) {
    return __awaiter(this, void 0, void 0, function* () {
        let extractedPath = path_1.default.resolve("./uploads/extracted") + "/" + fileHash;
        let manifestFile = fs_1.default.readFileSync(extractedPath + "/manifest.json", "utf-8"); // is file exists...
        let manifest = JSON.parse(manifestFile); // try to read result
        // search for duplicates
        let search = yield Database_1.default.mc_addons.findMany({
            where: {
                uuid: manifest.header.uuid,
            },
        });
        // if existed = return false
        if (search.length > 0) {
            return -1;
        }
        // insert addon itself
        let mcAddon = yield Database_1.default.mc_addons.create({
            data: {
                filepath: fileName,
                folderpath: fileHash,
                uuid: manifest.header.uuid,
            },
        });
        // insert all dependencies
        let dependencies = manifest.dependencies;
        let insertedDepsList = [];
        if (manifest && dependencies && dependencies.length > 0) {
            for (const dep of dependencies) {
                let insertedDep = yield Database_1.default.mc_dependencies.create({
                    data: {
                        mca_id: mcAddon.id,
                        uuid: dep.uuid,
                    },
                });
                insertedDepsList.push(insertedDep);
            }
        }
        return mcAddon.id;
    });
}
function saveFiles(mcAddonID, extractedPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // todo: work with db
        let fileList = FindInDir_1.default(extractedPath, /\.json$/);
        let results = [];
        for (let file of fileList) {
            let path = file
                .toString()
                .split(extractedPath)
                .pop()
                .split("/")
                .filter(Boolean); // clear [' ', ''] (empty elements)
            let fileName = path[path.length - 1];
            let fileRelativePath = path.join("/");
            if (path.length > 1) {
                // json files in directories
                let fileType = path[0];
                let result = yield fileSwitcher(mcAddonID, fileType, fileName, fileRelativePath);
                results.push(result);
            }
            else {
                // else -> json files in root, manifest.json for example.
                let fileType = "other";
                let result = yield fileSwitcher(mcAddonID, fileType, fileName, fileRelativePath);
                results.push(result);
            }
        }
        return results;
    });
}
function fileSwitcher(mcAddonID, fileType, fileName, fileRelativePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        switch (fileType) {
            case "entities":
                result = yield Database_1.default.mca_entities.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "items":
                result = yield Database_1.default.mca_items.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "loot_tables":
                result = yield Database_1.default.mca_loot_tables.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "recipes":
                result = yield Database_1.default.mca_recipes.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "scripts":
                result = yield Database_1.default.mca_scripts.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "spawn_rules":
                result = yield Database_1.default.mca_spawn_rules.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "trading":
                result = yield Database_1.default.mca_trading.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "ui":
                result = yield Database_1.default.mca_ui.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "textures":
                result = yield Database_1.default.mca_textures.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "texts":
                result = yield Database_1.default.mca_texts.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "sounds":
                result = yield Database_1.default.mca_sounds.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "render_controllers":
                result = yield Database_1.default.mca_render_controllers.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "particles":
                result = yield Database_1.default.mca_particles.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "models":
                result = yield Database_1.default.mca_models.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "fogs":
                result = yield Database_1.default.mca_fogs.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "entity":
                result = yield Database_1.default.mca_entities_rp.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "attachables":
                result = yield Database_1.default.mca_attachables.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "animations":
                result = yield Database_1.default.mca_animations.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            case "animation_controllers":
                result = yield Database_1.default.mca_animation_controllers.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
            default:
                result = yield Database_1.default.mca_other.create({
                    data: {
                        mca_id: mcAddonID,
                        filename: fileName,
                        filepath: fileRelativePath,
                    },
                });
                break;
        }
        return result;
    });
}
exports.default = Upload;
//# sourceMappingURL=Upload.js.map