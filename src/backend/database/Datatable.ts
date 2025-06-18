import {DatatableColumn,Constraint,DatatableModel,CsvDataColumn} from "../types"
import {parseCsvDataColumnToDatatype} from "../../utilities"

export class Datatable {

    tableColumns: DatatableColumn[];
    tableName: string;
    primaryKey?: string;
    constraints?: Constraint[];
    isTemporaryFlag: boolean;
    foreignKeyTables?: string[];

    constructor(tableName: string, isTemporaryFlag: boolean, model: DatatableModel) {
        this.tableName = tableName;
        this.tableColumns = model.columns;
        this.primaryKey = model.primaryKey;
        this.constraints = model.constraints;
        this.foreignKeyTables = model.foreignKeyTables;
        this.isTemporaryFlag = isTemporaryFlag;
    }

    createTableString () {

        const columnBody = this.tableColumns.map((column) => {
            return `"${column.name}" ${column.type.toString()} ${!column.isNullable ? "NOT NULL" : ""}`
        }).join(', ');

        const primaryKeyPart = this.primaryKey ? `, PRIMARY KEY(${this.primaryKey})` : "";
        
        let constraintsPart: string = ""; 

        if (this.constraints) {
            constraintsPart = "\n" + this.constraints.map((constraint) => {
                return `,${constraint.type} (${constraint.fields.join(',')})`
            }).join('\n');
        }

        let foreignKeysPart: string = "";

        if (this.foreignKeyTables) {
            foreignKeysPart = ','+this.foreignKeyTables.map((fk) => this.#foreignKey(fk)).join(',\n');
        }

        return `
CREATE TABLE ${this.isTemporaryFlag ? "temp." : ""}${this.tableName} (${columnBody}${primaryKeyPart} ${constraintsPart} ${foreignKeysPart});
`

    }

    #foreignKey (referenceTableName: string) {
        return `CONSTRAINT "FK_${this.tableName}_${referenceTableName}ID_${referenceTableName}_${referenceTableName}ID" FOREIGN KEY("${referenceTableName}ID") REFERENCES "${referenceTableName}"("${referenceTableName}ID")`
    }

}

export const createIndicies = () => {
    return `
CREATE INDEX "iBattingStats_StatsBatch" ON "BattingStats" (
	"StatsBatchID"	ASC
);
CREATE INDEX "iPitchingStats_StatsBatch" ON "PitchingStats" (
    "StatsBatchID"  ASC
);    
    `
}

export const CsvDataToTempTable = (tableName: string, columns: CsvDataColumn[], primaryKey?: string, constraints?: Constraint[], foreignKeyTables?: string[]) => {

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
        foreignKeyTables,
    }

    return new Datatable(tableName, isTemporaryFlag, datatableModel);

}