"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class FileSystem {
    static deleteFile(path) {
        try {
            fs_1.default.unlinkSync(path);
        }
        catch (e) {
            console.log('Delete-file: ' + e);
        }
    }
    static deleteFolder(path) {
        try {
            fs_1.default.rmdirSync(path, {
                recursive: true
            });
        }
        catch (e) {
            console.log('Delete-folder: ' + e);
        }
    }
}
exports.default = FileSystem;
//# sourceMappingURL=FileSystem.js.map