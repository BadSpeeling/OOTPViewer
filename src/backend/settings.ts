import * as path from "node:path";
import * as fs from "node:fs";

const settingsPath = () => {
    return [".","settings.json"];
}

export const checkIfSettingsExist = () => {
    return fs.existsSync(path.join(...settingsPath()))
}

export const updateSetting = (key: string, value: any) => {

    const filePath = path.join(...settingsPath());

    try {
        const settings = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
        settings[key] = value;
        fs.writeFileSync(filePath, JSON.stringify(settings));

        return true;
    }
    catch (err) {
        return false;
    }

}

export const createSettings = () => {
    fs.closeSync(fs.openSync(path.join(...settingsPath()),'w'));
}

export function getSetting<T> (key: string) {

    const filePath = path.join(...settingsPath());

    try {
        const settings = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
        const value = settings[key];
        
        if (value) {
            return value as T;
        }
        else {
            throw Error(`"${key}" does not have a value`);
        }    
    }   
    catch (err) {
        throw Error(`Could not load "${key}" - ${err}`);
    }

}