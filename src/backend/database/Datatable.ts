export class Datatable {

    tableColumns: DatatableColumn[];
    tableName: string;
    primaryKey: string | null;

    constructor(tableName: string, tableColumns: DatatableColumn[], primaryKey: string | null) {
        this.tableName = tableName;
        this.tableColumns = tableColumns;
        this.primaryKey = primaryKey;
    }

    createTableString () {

        const columnBody = this.tableColumns.map((column) => {
            return `"${column.name}" ${column.type.toString()} ${!column.isNullable ? "NOT NULL" : ""}`
        }).join(', ');

        const primaryKeyPart = this.primaryKey ? `, PRIMARY KEY(${this.primaryKey})` : "";

        return `CREATE TABLE ${this.tableName} (${columnBody}${primaryKeyPart});`

    }

}

export interface DatatableColumn {
    name: string,
    type: string,
    isNullable: boolean 
}