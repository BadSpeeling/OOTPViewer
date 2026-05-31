import { IDatatableModelReader } from "./index";
import { DatatableModel } from "../types";

import * as fs from "node:fs"
import * as process from "node:process"
import * as path from "node:path"

//reads tableColumns configuration that lives in this project structure, at $/json/tableColumns.json
export class ProjectDatatableModelReader implements IDatatableModelReader {
    
    getDatatableModels() {

        const jsonFilePath = path.join(process.cwd(), 'json', 'tableColumns.json');
        
        const readTableModelJsonFile = () => {

            try {
                return fs.readFileSync(jsonFilePath).toString();                
            }
            catch (error) {
                if (error instanceof Error) {
                    throw Error("Could not load table model from Local Project: " + error.message);
                }
                else {
                    throw error;
                }
            }

        }

        const jsonText = readTableModelJsonFile();
        const datatableModels: DatatableModel[] = JSON.parse(jsonText);
        return datatableModels;

    }

}