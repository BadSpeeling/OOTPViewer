import { IDatatableModelReader } from "./index";
import { DatatableModel } from "../types";

import * as process from "node:process"
import { readFileAsync } from '../../utilities'

//reads tableColumns configuration that lives in this project structure, at $/json/tableColumns.json
export class ProjectDatatableModelReader implements IDatatableModelReader {
    
    async getDatatableModels() {

        const jsonFilePath = [process.cwd(), 'json', 'tableColumns.json'];
        const jsonText = await readFileAsync(jsonFilePath);
        const datatableModels: DatatableModel[] = JSON.parse(jsonText);
        return datatableModels;

    }

}