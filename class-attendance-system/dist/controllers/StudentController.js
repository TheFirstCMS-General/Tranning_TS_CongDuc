"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileOperations_1 = require("../utils/fileOperations");
const router = (0, express_1.Router)();
const studentsFilePath = 'data/students.json';
const sessionsFilePath = 'data/sessions.json';
// Tạo một ID mới cho học sinh
function generateNewId(students) {
    const maxId = students.reduce((max, student) => Math.max(max, parseInt(student.id)), 0);
    return maxId + 1;
}
// Lấy tất cả học sinh
router.get('/', (req, res) => {
    try {
        const students = (0, fileOperations_1.readJsonFile)(studentsFilePath);
        res.json(students);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lấy danh sách học sinh: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi lấy danh sách học sinh');
        }
    }
});
// Thêm học sinh vào phiên
router.post('/', (req, res) => {
    try {
        const { name, dob, gender, address, phone, sessionId } = req.body;
        const students = (0, fileOperations_1.readJsonFile)(studentsFilePath);
        const sessions = (0, fileOperations_1.readJsonFile)(sessionsFilePath);
        // Kiểm tra sự tồn tại của phiên
        const session = sessions.find((s) => s.id === sessionId);
        if (!session) {
            return res.status(404).send('Session not found');
        }
        // Tạo học sinh mới
        const newStudent = {
            id: String(generateNewId(students)),
            name,
            dateOfBirth: dob,
            gender,
            address,
            phone
        };
        students.push(newStudent);
        (0, fileOperations_1.writeJsonFile)(studentsFilePath, students);
        // Thêm học sinh vào phiên tương ứng nếu không có trong danh sách học sinh của phiên
        if (!session.students.find((s) => s.id === newStudent.id)) {
            session.students.push(newStudent);
            (0, fileOperations_1.writeJsonFile)(sessionsFilePath, sessions);
        }
        res.status(201).json(newStudent);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi thêm học sinh: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi thêm học sinh');
        }
    }
});
// Xóa học sinh
router.delete('/:id', (req, res) => {
    try {
        const studentId = req.params.id;
        let students = (0, fileOperations_1.readJsonFile)(studentsFilePath);
        let sessions = (0, fileOperations_1.readJsonFile)(sessionsFilePath);
        // Xóa học sinh khỏi danh sách học sinh
        students = students.filter((student) => student.id !== studentId);
        // Cập nhật các phiên để xóa học sinh
        sessions = sessions.map((session) => {
            session.students = session.students.filter((student) => student.id !== studentId);
            return session;
        });
        (0, fileOperations_1.writeJsonFile)(studentsFilePath, students);
        (0, fileOperations_1.writeJsonFile)(sessionsFilePath, sessions);
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi xóa học sinh: ' + error.message);
        }
        else {
            res.status(500).send('Lỗi không xác định khi xóa học sinh');
        }
    }
});
exports.default = router;
