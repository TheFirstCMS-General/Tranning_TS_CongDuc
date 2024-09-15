import { Router, Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileOperations';

const router = Router();
const dataFilePath = 'data/reports.json';

router.get('/', (req: Request, res: Response) => {
    try {
        const reports = readJsonFile(dataFilePath);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu báo cáo' });
    }
});

router.post('/', (req: Request, res: Response) => {
    try {
        const newReport = req.body;
        const reports = readJsonFile(dataFilePath);
        reports.push(newReport);
        writeJsonFile(dataFilePath, reports);
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi thêm báo cáo' });
    }
});

export default router;
