"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileOperations_1 = require("../utils/fileOperations");
const router = (0, express_1.Router)();
const sessionsFilePath = 'data/sessions.json';
// Tạo một ID mới cho phiên
function generateNewId(sessions) {
    const maxId = sessions.reduce((max, session) => Math.max(max, parseInt(session.id)), 0);
    return maxId + 1;
}
// Lấy tất cả các phiên điểm danh
router.get('/', (req, res) => {
    try {
        const sessions = (0, fileOperations_1.readJsonFile)(sessionsFilePath);
        res.json(sessions);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lấy danh sách các phiên: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi lấy danh sách các phiên');
        }
    }
});
// Lấy phiên điểm danh theo ID
router.get('/:id', (req, res) => {
    try {
        const sessions = (0, fileOperations_1.readJsonFile)(sessionsFilePath);
        const session = sessions.find((s) => s.id === req.params.id);
        if (session) {
            res.json(session);
        }
        else {
            res.status(404).send('Session not found');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lấy phiên: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi lấy phiên');
        }
    }
});
// Tạo phiên mới
router.post('/', (req, res) => {
    try {
        const { className, dateTime } = req.body;
        const sessions = (0, fileOperations_1.readJsonFile)(sessionsFilePath);
        const newSession = {
            id: String(generateNewId(sessions)),
            className,
            dateTime,
            students: [],
            attendance: [] // Khởi tạo điểm danh rỗng
        };
        sessions.push(newSession);
        (0, fileOperations_1.writeJsonFile)(sessionsFilePath, sessions);
        res.status(201).json(newSession);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi thêm phiên: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi thêm phiên');
        }
    }
});
// Xóa phiên theo ID
router.delete('/:id', (req, res) => {
    try {
        let sessions = (0, fileOperations_1.readJsonFile)(sessionsFilePath);
        sessions = sessions.filter((s) => s.id !== req.params.id);
        (0, fileOperations_1.writeJsonFile)(sessionsFilePath, sessions);
        res.status(204).send(); // No content
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi xóa phiên: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi xóa phiên');
        }
    }
});
// Lưu điểm danh cho một phiên (PATCH)
router.patch('/:id/attendance', (req, res) => {
    try {
        const sessions = (0, fileOperations_1.readJsonFile)(sessionsFilePath);
        const session = sessions.find((s) => s.id === req.params.id);
        if (session) {
            // Cập nhật trạng thái điểm danh cho học sinh
            session.attendance = req.body;
            (0, fileOperations_1.writeJsonFile)(sessionsFilePath, sessions);
            res.status(200).json(session);
        }
        else {
            res.status(404).send('Session not found');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lưu điểm danh: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi lưu điểm danh');
        }
    }
});
// Lấy điểm danh cho một phiên
router.get('/:id/attendance', (req, res) => {
    try {
        const sessions = (0, fileOperations_1.readJsonFile)(sessionsFilePath);
        const session = sessions.find((s) => s.id === req.params.id);
        if (session) {
            res.json(session.attendance);
        }
        else {
            res.status(404).send('Session not found');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lấy điểm danh: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi lấy điểm danh');
        }
    }
});
exports.default = router;
