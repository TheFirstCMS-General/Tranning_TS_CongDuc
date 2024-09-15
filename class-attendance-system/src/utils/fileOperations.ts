import fs from 'fs';

export function readJsonFile(filePath: string) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading file from disk: ${error}`);
    }
}

export function writeJsonFile(filePath: string, data: any) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, 'utf8');
    } catch (error) {
        throw new Error(`Error writing file to disk: ${error}`);
    }
}
