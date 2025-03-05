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
