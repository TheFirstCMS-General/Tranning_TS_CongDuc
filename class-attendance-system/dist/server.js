"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const StudentController_1 = __importDefault(require("./controllers/StudentController"));
const SessionController_1 = __importDefault(require("./controllers/SessionController"));
const ReportController_1 = __importDefault(require("./controllers/ReportController"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use('/students', StudentController_1.default);
app.use('/sessions', SessionController_1.default);
app.use('/reports', ReportController_1.default);
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
