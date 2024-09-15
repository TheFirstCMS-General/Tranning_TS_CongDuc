import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const sessionsFile = path.join(__dirname, '..', 'data', 'sessions.json');

// Lấy điểm danh của một phiên học
router.get('/:id/attendance', (req, res) => {
    const sessionId = req.params.id;
    fs.readFile(sessionsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading sessions file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const sessions = JSON.parse(data);
        const session = sessions.find((s: any) => s.id === sessionId);
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
    fs.readFile(sessionsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading sessions file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const sessions = JSON.parse(data);
        const sessionIndex = sessions.findIndex((s: any) => s.id === sessionId);
        if (sessionIndex === -1) {
            return res.status(404).json({ error: 'Session not found' });
        }
        sessions[sessionIndex].attendance = attendance;
        fs.writeFile(sessionsFile, JSON.stringify(sessions, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing sessions file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json({ message: 'Attendance updated successfully' });
        });
    });
});

export default router;
