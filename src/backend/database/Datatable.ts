import {DataTableColumn,Constraint,DatatableModel,OotpExportDataColumn,Index,PrimaryKey} from "../types"
import {parseCsvDataColumnToDatatype} from "../../utilities"

export class Datatable {

    tableColumns: DataTableColumn[];
    tableName: string;
    primaryKey?: PrimaryKey;
    constraints?: Constraint[];
    isTemporaryFlag: boolean;
    foreignKeyTables?: string[];
    indicies?: Index[];

    constructor(model: DatatableModel, isTemporaryFlag: boolean) {
        this.tableName = model.tableName;
        this.tableColumns = model.columns;
        this.primaryKey = model.primaryKey;
        this.constraints = model.constraints;
        this.foreignKeyTables = model.foreignKeyTables;
        this.indicies = model.indicies;
        this.isTemporaryFlag = isTemporaryFlag;
    }

    createTableString () {

        const columnBody = this.tableColumns.map((column) => {
            return `"${column.name}" ${column.type.toString()} ${column.notNull ? "NOT NULL" : ""}`
        }).join(', ');

        const primaryKeyPart = this.primaryKey ? `, PRIMARY KEY(${this.primaryKey.column}${this.primaryKey.autoincrement ? " AUTOINCREMENT" : ""})` : "";
        
        let createConstraintsSQL: string = ""; 

        if (this.constraints) {
            createConstraintsSQL = this.constraints.map(c => this.#getCreateUniqueConstraintString(c)).join('\n');
        }

        let createForeignKeysSQL: string = "";

        if (this.foreignKeyTables) {
            createForeignKeysSQL = ','+this.foreignKeyTables.map((fk) => this.#getCreateForeignKeyString(fk)).join(',\n');
        }

        let createIndiciesSQL: string = "";

        if (this.indicies) {
            createIndiciesSQL = this.indicies.map((i) => this.#getCreateIndexString(i)).join('\n');
        }

        return `
CREATE TABLE ${this.isTemporaryFlag ? "temp." : ""}${this.tableName} (${columnBody}${primaryKeyPart} ${createForeignKeysSQL});
${createIndiciesSQL}
${createConstraintsSQL}
`

    }

    #getCreateUniqueConstraintString (constraint: Constraint) {
        return `
CREATE UNIQUE INDEX UC_${this.tableName}_${constraint.fields.join('_')} ON ${this.tableName}(${constraint.fields.join(', ')});
`
    }

    #getCreateForeignKeyString (referenceTableName: string) {
        return `
CONSTRAINT "FK_${this.tableName}_${referenceTableName}ID_${referenceTableName}ID" FOREIGN KEY("${referenceTableName}ID") REFERENCES "${referenceTableName}"("${referenceTableName}ID")
`
    }

    #getCreateIndexString (index: Index) {
        return `
CREATE INDEX "NIX_${this.tableName}_${index.columns.join('_')}" ON "${this.tableName}" (
    ${index.columns.map(c => `"${c}"  ASC`)}
);
`
    }

}