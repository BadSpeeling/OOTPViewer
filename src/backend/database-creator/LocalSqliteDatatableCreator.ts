import { Database } from "../database/Database";
import { Datatable } from "../database/Datatable";
import { IDatatableCreator, IJsonModelReader } from "./index";
import { DatatableModel } from '../types'

export class LocalSqliteDatatableCreator implements IDatatableCreator {
    
    modelReader: IJsonModelReader<DatatableModel>;
    database: Database;

    constructor (modelReader: IJsonModelReader<DatatableModel>, database: Database) {
        this.modelReader = modelReader;
        this.database = database;
    }

    async createDataTables () {

        const tableModels = await this.modelReader.getJsonModels();
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