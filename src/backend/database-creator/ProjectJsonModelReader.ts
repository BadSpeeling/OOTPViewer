import { IJsonModelReader } from "./index";

import * as process from "node:process"
import { readFileAsync } from '../../utilities'

//reads tableColumns configuration that lives in this project structure, at $/json/tableColumns.json
export class ProjectJsonModelReader<T> implements IJsonModelReader<T> {
    
    private fileName: string

    constructor (fileName: string) {
        this.fileName = fileName;
    }

    async getJsonModels() {

        const jsonFilePath = [process.cwd(), 'json', this.fileName];
        const jsonText = await readFileAsync(jsonFilePath);
        const datatableModels: T[] = JSON.parse(jsonText);
        return datatableModels;

    }

}