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
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const Upload_1 = __importDefault(require("./logic/Upload"));
const Database_1 = require("./utils/Database/Database");
const app = express_1.default();
const port = 3000;
app.use(express_fileupload_1.default({
    useTempFiles: true,
    tempFileDir: path_1.default.resolve('./uploads/_temp')
}));
app.post('/upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Upload_1.default(req, res);
}));
app.post('/testdb', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield Database_1.db.$queryRaw('SELECT version()');
    console.log(test);
    res.json({
        test
    });
}));
app.listen(port, () => {
    console.log(`Listening at: ${port}`);
});
//# sourceMappingURL=app.js.map