export interface CsvRecord {
    [index:string]: string|number,
}

export interface DatabaseRecord {
    [index:string]: string|number,
}

export interface CsvDataColumn {
    nameInSource: string,
    databaseColumnName: string,
    type: string,
}

export interface DatatableColumn {
    name: string,
    type: string,
    isNullable: boolean,
}

export interface Constraint {
    name: string,
    fields: string[],
}

export interface DatatableModel {
    columns: DatatableColumn[],
    primaryKey?: string,
    constraints?: Constraint[],
}