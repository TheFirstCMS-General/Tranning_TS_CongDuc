import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import studentRouter from './controllers/StudentController';
import sessionRouter from './controllers/SessionController';
import reportRouter from './controllers/ReportController';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/students', studentRouter);
app.use('/sessions', sessionRouter);
app.use('/reports', reportRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
