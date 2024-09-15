"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonFile = exports.readJsonFile = void 0;
const fs_1 = __importDefault(require("fs"));
function readJsonFile(filePath) {
    try {
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        throw new Error(`Error reading file from disk: ${error}`);
    }
}
exports.readJsonFile = readJsonFile;
function writeJsonFile(filePath, data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs_1.default.writeFileSync(filePath, jsonData, 'utf8');
    }
    catch (error) {
        throw new Error(`Error writing file to disk: ${error}`);
    }
}
exports.writeJsonFile = writeJsonFile;
