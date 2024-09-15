// src/models/AttendanceSession.ts

import { Student } from './Student';

export interface IAttendanceRecord {
    studentId: string;
    studentName: string; // Thêm thuộc tính studentName nếu cần
    status: 'Present' | 'Late' | 'Excused' | 'Absent';
    note?: string;
}

export interface IAttendanceSession {
    id: string;
    className: string;
    dateTime: string;
    students: IAttendanceRecord[]; // Đảm bảo rằng students là mảng IAttendanceRecord
}

export class AttendanceSession implements IAttendanceSession {
    constructor(
        public id: string,
        public className: string,
        public dateTime: string,
        public students: IAttendanceRecord[]
    ) {}

    addRecord(record: IAttendanceRecord) {
        this.students.push(record);
    }

    removeRecord(studentId: string) {
        this.students = this.students.filter(record => record.studentId !== studentId);
    }
}
