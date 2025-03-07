import {DatatableColumn,Constraint,DatatableModel,CsvDataColumn} from "../types"
import {parseCsvDataColumnToDatatype} from "../../utilities"

export class Datatable {

    tableColumns: DatatableColumn[];
    tableName: string;
    primaryKey?: string;
    constraints?: Constraint[];
    isTemporaryFlag: boolean;

    constructor(tableName: string, isTemporaryFlag: boolean, model: DatatableModel) {
        this.tableName = tableName;
        this.tableColumns = model.columns;
        this.primaryKey = model.primaryKey;
        this.constraints = model.constraints;
        this.isTemporaryFlag = isTemporaryFlag;
    }

    createTableString () {

        const columnBody = this.tableColumns.map((column) => {
            return `"${column.name}" ${column.type.toString()} ${!column.isNullable ? "NOT NULL" : ""}`
        }).join(', ');

        const primaryKeyPart = this.primaryKey ? `, PRIMARY KEY(${this.primaryKey})` : "";
        let constraintsPart: string = ""; 

        if (this.constraints) {
            constraintsPart = this.constraints.map((constraint) => {
                return `CREATE INDEX ${this.isTemporaryFlag ? "temp." : ""}${constraint.name} ON ${this.tableName} (${constraint.fields.join(',')});`
            }).join('\n');
        }

        return `
CREATE TABLE ${this.isTemporaryFlag ? "temp." : ""}${this.tableName} (${columnBody}${primaryKeyPart});
${constraintsPart}
`

    }

}

export const CsvDataToTempTable = (tableName: string, columns: CsvDataColumn[], primaryKey?: string, constraints?: Constraint[]) => {

    const isTemporaryFlag = true;
    const datatableModel: DatatableModel = {
        columns: columns.map((column) => {
            return {
                name: column.databaseColumnName,
                type: parseCsvDataColumnToDatatype(column.type),
                isNullable: true,
            }
        }),
        constraints,
        primaryKey,
    }

    return new Datatable(tableName, isTemporaryFlag, datatableModel);

}