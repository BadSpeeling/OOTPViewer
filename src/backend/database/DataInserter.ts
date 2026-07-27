import { DatatableModel } from "../types";
import { Database } from "./Database";
import { DataInserterType } from "./databaseTypes";
import { getValue } from './utils'

export class DataInserter {

    private database: Database;
    private dataModels: DatatableModel[];

    constructor (database: Database, dataModels: DatatableModel[]) {
        this.database = database;
        this.dataModels = dataModels;
    }

    public async insertRawDataAsync (insertableDataRows: object[], tableName: string) {

        const dataModel = this.dataModels.find(m => m.tableName === tableName);

        if (typeof dataModel === 'undefined') {
            throw Error(tableName + " was not found in the provided table model");
        }

        const parsedInsertableData = insertableDataRows.map(r => this.objectToMap(r));

        await this.insertDataAsync(parsedInsertableData, tableName, dataModel);

    }

    private objectToMap (insertableData: object) {

        const insertableDataMap: Map<string,string|number> = new Map();

        for (const [columnName,value] of Object.entries(insertableData)) {
            if (typeof value === 'string' || typeof value === 'number') {
                insertableDataMap.set(columnName, value);
            }
        }

        return insertableDataMap;

    }

    public async insertDataAsync (insertableDataRows: Map<string,string|number>[], tableName: string, dataModel: DatatableModel) {

        const insertScript = `
            INSERT INTO ${tableName} (${this.getTableColumnNames(dataModel)})
            VALUES ${this.generateInsertValues(insertableDataRows, dataModel)}
        `

        try {
            await this.database.execute(insertScript);
        }
        catch (err) {
            
            if (insertScript.length > 1000) {
                throw Error ("Failed executing the insert script.  The script is too long to include in error message: " + (err as Error).message);
            }
            else {
                throw Error ("Failed executing the insert script : " + (err as Error).message + "\n\nScript: " + insertScript);
            }
            
        }

    }

    private getTableColumnNames (dataModel: DatatableModel) {
        return dataModel.columns.map(c => `[${c.name}]`)
    }

    private generateInsertValues (insertableDataRows: Map<string,string|number>[], dataModel: DatatableModel) {

        const insertValues = insertableDataRows
            .map(r => this.generateInsertValue(r, dataModel))
            .join(',\n');

        return insertValues;

    }

    private generateInsertValue (insertableDataRow: Map<string,string|number>, dataModel: DatatableModel) {

        const values: string[] = []

        for (const column of dataModel.columns) {
            if (insertableDataRow.has(column.name)) {
                values.push(getValue(insertableDataRow.get(column.name)!.toString(), column.type));
            }
            else {
                values.push(getValue(null, column.type));
            }
        }

        return `(${values.join(', ')})`;

    }

}