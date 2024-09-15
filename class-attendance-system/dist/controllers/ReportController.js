"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileOperations_1 = require("../utils/fileOperations");
const router = (0, express_1.Router)();
const dataFilePath = 'data/reports.json';
router.get('/', (req, res) => {
    try {
        const reports = (0, fileOperations_1.readJsonFile)(dataFilePath);
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu báo cáo' });
    }
});
router.post('/', (req, res) => {
    try {
        const newReport = req.body;
        const reports = (0, fileOperations_1.readJsonFile)(dataFilePath);
        reports.push(newReport);
        (0, fileOperations_1.writeJsonFile)(dataFilePath, reports);
        res.status(201).json(newReport);
    }
    catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi thêm báo cáo' });
    }
});
exports.default = router;
