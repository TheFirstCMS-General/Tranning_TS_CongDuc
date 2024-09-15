import { Router, Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileOperations';

const router = Router();
const sessionsFilePath = 'data/sessions.json';

// Tạo một ID mới cho phiên
function generateNewId(sessions: any[]): number {
    const maxId = sessions.reduce((max, session) => Math.max(max, parseInt(session.id)), 0);
    return maxId + 1;
}

// Lấy tất cả các phiên điểm danh
router.get('/', (req: Request, res: Response) => {
    try {
        const sessions = readJsonFile(sessionsFilePath);
        res.json(sessions);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lấy danh sách các phiên: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi lấy danh sách các phiên');
        }
    }
});

// Lấy phiên điểm danh theo ID
router.get('/:id', (req: Request, res: Response) => {
    try {
        const sessions = readJsonFile(sessionsFilePath);
        const session = sessions.find((s: any) => s.id === req.params.id);
        if (session) {
            res.json(session);
        } else {
            res.status(404).send('Session not found');
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lấy phiên: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi lấy phiên');
        }
    }
});

// Tạo phiên mới
router.post('/', (req: Request, res: Response) => {
    try {
        const { className, dateTime } = req.body;
        const sessions = readJsonFile(sessionsFilePath);
        const newSession = {
            id: String(generateNewId(sessions)),
            className,
            dateTime,
            students: [],
            attendance: [] // Khởi tạo điểm danh rỗng
        };
        sessions.push(newSession);
        writeJsonFile(sessionsFilePath, sessions);
        res.status(201).json(newSession);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi thêm phiên: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi thêm phiên');
        }
    }
});

// Xóa phiên theo ID
router.delete('/:id', (req: Request, res: Response) => {
    try {
        let sessions = readJsonFile(sessionsFilePath);
        sessions = sessions.filter((s: any) => s.id !== req.params.id);
        writeJsonFile(sessionsFilePath, sessions);
        res.status(204).send(); // No content
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi xóa phiên: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi xóa phiên');
        }
    }
});

// Lưu điểm danh cho một phiên (PATCH)
router.patch('/:id/attendance', (req: Request, res: Response) => {
    try {
        const sessions = readJsonFile(sessionsFilePath);
        const session = sessions.find((s: any) => s.id === req.params.id);
        if (session) {
            // Cập nhật trạng thái điểm danh cho học sinh
            session.attendance = req.body;
            writeJsonFile(sessionsFilePath, sessions);
            res.status(200).json(session);
        } else {
            res.status(404).send('Session not found');
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lưu điểm danh: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi lưu điểm danh');
        }
    }
});

// Lấy điểm danh cho một phiên
router.get('/:id/attendance', (req: Request, res: Response) => {
    try {
        const sessions = readJsonFile(sessionsFilePath);
        const session = sessions.find((s: any) => s.id === req.params.id);
        if (session) {
            res.json(session.attendance);
        } else {
            res.status(404).send('Session not found');
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Lỗi khi lấy điểm danh: ' + error.message);
        } else {
            res.status(500).send('Lỗi không xác định khi lấy điểm danh');
        }
    }
});

export default router;
