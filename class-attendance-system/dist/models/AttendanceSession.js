"use strict";
// src/models/AttendanceSession.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceSession = void 0;
class AttendanceSession {
    constructor(id, className, dateTime, students) {
        this.id = id;
        this.className = className;
        this.dateTime = dateTime;
        this.students = students;
    }
    addRecord(record) {
        this.students.push(record);
    }
    removeRecord(studentId) {
        this.students = this.students.filter(record => record.studentId !== studentId);
    }
}
exports.AttendanceSession = AttendanceSession;
