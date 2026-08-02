import * as fs from 'node:fs'
import * as path from "node:path"

export function dateTime (date: Date) {
    
    const month = date.getMonth()+1;
    const dateOfMonth = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    const digitHelper = (s: string) => {
        return s.length === 1 ? '0'+s : s;
    }

    return `${date.getFullYear()}-${digitHelper(month.toString())}-${digitHelper(dateOfMonth.toString())} ${digitHelper(hour.toString())}:${digitHelper(minute.toString())}`;
}

export const readFileAsync = (filePath: string[]) => {

    const fullFilePath = path.join(...filePath)

    if (!fs.existsSync(fullFilePath)) {
        throw Error(filePath + " does not exist");
    }

    return new Promise<string> ((resolve, reject) => {

        fs.readFile(fullFilePath, 'utf-8', (err, data) => {
            
            if (err) {
                reject(err.message);
            }
            resolve(data);

        });

    });            
    
}