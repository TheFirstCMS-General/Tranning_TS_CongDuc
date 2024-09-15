import { Router, Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileOperations';
import { Student } from '../models/Student';

const router = Router();
const studentsFilePath = 'data/students.json';
const sessionsFilePath = 'data/sessions.json';

// Tạo một ID mới cho học sinh
function generateNewId(students: Student[]): number {
    const maxId = students.reduce((max, student) => Math.max(max, parseInt(student.id)), 0);
    return maxId + 1;
}

// Lấy tất cả học sinh
router.get('/', (req: Request, res: Response) => {
    try {
        const students = readJsonFile(studentsFilePath);
        res.json(students);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lấy danh sách học sinh: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi lấy danh sách học sinh');
        }
    }
});

// Thêm học sinh vào phiên
router.post('/', (req: Request, res: Response) => {
    try {
        const { name, dob, gender, address, phone, sessionId } = req.body;
        const students = readJsonFile(studentsFilePath);
        const sessions = readJsonFile(sessionsFilePath);

        // Kiểm tra sự tồn tại của phiên
        const session = sessions.find((s: any) => s.id === sessionId);
        if (!session) {
            return res.status(404).send('Session not found');
        }

        // Tạo học sinh mới
        const newStudent: Student = {
            id: String(generateNewId(students)),
            name,
            dateOfBirth: dob,
            gender,
            address,
            phone
        };

        students.push(newStudent);
        writeJsonFile(studentsFilePath, students);

        // Thêm học sinh vào phiên tương ứng nếu không có trong danh sách học sinh của phiên
        if (!session.students.find((s: any) => s.id === newStudent.id)) {
            session.students.push(newStudent);
            writeJsonFile(sessionsFilePath, sessions);
        }

        res.status(201).json(newStudent);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi thêm học sinh: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi thêm học sinh');
        }
    }
});

// Xóa học sinh
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const studentId = req.params.id;
        let students = readJsonFile(studentsFilePath);
        let sessions = readJsonFile(sessionsFilePath);

        // Xóa học sinh khỏi danh sách học sinh
        students = students.filter((student: any) => student.id !== studentId);

        // Cập nhật các phiên để xóa học sinh
        sessions = sessions.map((session: any) => {
            session.students = session.students.filter((student: any) => student.id !== studentId);
            return session;
        });

        writeJsonFile(studentsFilePath, students);
        writeJsonFile(sessionsFilePath, sessions);

        res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi xóa học sinh: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi xóa học sinh');
        }
    }
});

export default router;
