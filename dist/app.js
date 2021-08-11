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
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const Upload_1 = __importDefault(require("./logic/Upload"));
const Database_1 = __importDefault(require("./utils/Database/Database"));
const Users_1 = require("./routes/Users");
dotenv_1.default.config();
const app = express_1.default();
const port = Number(process.env.PORT);
app.use(morgan_1.default("tiny"));
app.use(body_parser_1.default.urlencoded({
    extended: false,
}));
app.use(body_parser_1.default.json());
app.use(express_fileupload_1.default({
    useTempFiles: true,
    tempFileDir: path_1.default.resolve("./uploads/_temp"),
}));
app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Upload_1.default(req, res);
}));
app.use("/users", Users_1.usersRouter);
// app.get("/mods", async (req: express.Request, res: express.Response) => {
// 	res.json({
// 		page: "first",
// 	})
// })
//
// app.get("/mods/:page", async (req: express.Request, res: express.Response) => {
// 	// await Mods.getAll()
// 	res.json({
// 		page: req.params.page,
// 	})
// })
// app.post("/session/create", async (request, reply) => {
// 	let payload = {
// 		id: 1,
// 	}
//
// 	let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1m"})
//
// 	reply.json({
// 		accessToken: token,
// 	})
// })
//
// app.get("/private", auth, async (request: express.Request, reply) => {
// 	reply.json({
// 		private: true,
// 		// user: request.user.id
// 		user: request.user.id,
// 	})
// })
//
// app.use("/test", testRouter)
app.get("/checkDatabase", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let version = yield Database_1.default.$queryRaw("SELECT version()");
    return res.json({
        version,
    });
}));
app.listen(port, () => {
    console.log("Cute Engine 4");
    console.log(`Listening at: ${port}`);
});
//# sourceMappingURL=app.js.map