// src/models/Student.ts

export interface IStudent {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    phone: string;
}

export class Student implements IStudent {
    constructor(
        public id: string,
        public name: string,
        public dateOfBirth: string,
        public gender: string,
        public address: string,
        public phone: string
    ) {}
}
