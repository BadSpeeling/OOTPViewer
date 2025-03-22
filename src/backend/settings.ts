import * as path from "node:path";
import * as fs from "node:fs";

const settingsPath = () => {
    return [".","settings1.json"];
}

export const checkIfSettingsExist = () => {
    return fs.existsSync(path.join(...settingsPath()))
}

export const updateSettings = (key: string, value: any) => {

    const filePath = path.join(...settingsPath());

    const settings = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
    settings[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(settings));

}

export const createSettings = () => {
    fs.closeSync(fs.openSync(path.join(...settingsPath()),'w'));
}

export const getSetting  = (key: string) => {

    const filePath = path.join(...settingsPath());

    const settings = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
    return settings[key];

}