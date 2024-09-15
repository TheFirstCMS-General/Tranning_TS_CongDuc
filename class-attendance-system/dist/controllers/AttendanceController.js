"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const sessionsFile = path_1.default.join(__dirname, '..', 'data', 'sessions.json');
// Lấy điểm danh của một phiên học
router.get('/:id/attendance', (req, res) => {
    const sessionId = req.params.id;
    fs_1.default.readFile(sessionsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading sessions file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const sessions = JSON.parse(data);
        const session = sessions.find((s) => s.id === sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json(session.attendance || []);
    });
});
// Cập nhật điểm danh cho một phiên học
router.patch('/:id', (req, res) => {
    const sessionId = req.params.id;
    const { attendance } = req.body;
    fs_1.default.readFile(sessionsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading sessions file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const sessions = JSON.parse(data);
        const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
        if (sessionIndex === -1) {
            return res.status(404).json({ error: 'Session not found' });
        }
        sessions[sessionIndex].attendance = attendance;
        fs_1.default.writeFile(sessionsFile, JSON.stringify(sessions, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing sessions file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json({ message: 'Attendance updated successfully' });
        });
    });
});
exports.default = router;
