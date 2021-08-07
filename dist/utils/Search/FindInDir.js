"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findInDir(dir, filter, fileList = []) {
    const files = fs_1.default.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path_1.default.join(dir, file);
        const fileStat = fs_1.default.lstatSync(filePath);
        if (fileStat.isDirectory()) {
            findInDir(filePath, filter, fileList);
        }
        else if (filter.test(filePath)) {
            fileList.push(filePath);
        }
    });
    return fileList;
}
exports.default = findInDir;
//# sourceMappingURL=FindInDir.js.map