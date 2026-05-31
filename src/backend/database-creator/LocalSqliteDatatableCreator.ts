import { Database } from "../database/Database";
import { Datatable } from "../database/Datatable";
import { IDatatableCreator, IDatatableModelReader } from "./index";

export class LocalSqliteDatatableCreator implements IDatatableCreator {
    
    modelReader: IDatatableModelReader;
    database: Database;

    constructor (modelReader: IDatatableModelReader, database: Database) {
        this.modelReader = modelReader;
        this.database = database;
    }

    async createDataTables () {

        const tableModels = this.modelReader.getDatatableModels();
        const datatables = tableModels.map((tableModel) => new Datatable(tableModel, false))
        const createTableScripts = datatables.map((datatable) => datatable.createTableString());

        try {
            await this.database.execute(createTableScripts.join(''));            
        }
        catch (error) {
            if (error instanceof Error) {
                throw Error("Failed executing the create table script: " + error.message);
            }
            else {
                throw error;
            }
        }

    }


}