import { Constraint, DatatableModel, OotpExportDataColumn, PrimaryKey,  } from '../../types';
import { Datatable } from '../../database/Datatable'

export class OotpDataExport {

    protected readonly expectedHeaders: OotpExportDataColumn[]
    private readonly databaseColumnNames: string[]
    protected stats: string[][]

    constructor (expectedHeaders: OotpExportDataColumn[]) {
        this.expectedHeaders = expectedHeaders;
        this.databaseColumnNames = expectedHeaders.map(h => h.databaseColumnName);
        this.stats = [];
    }

    addStatsRow (row: string[]) {
        this.stats.push(row);
    }

    recordCount () {
        return this.stats.length;
    }   

    getRecord (index: number) {
        return this.stats[index];
    }

    getColumnIndex (columnName: string) {

        const columnIndex = this.databaseColumnNames.indexOf(columnName);

        if (columnIndex === -1) {
            throw Error (`[${columnName}] is not present in the expected headers`);
        }

        return columnIndex;

    }

    sliceColumns (startingColumnName: string, endingColumnName?: string) {

        const startingColumnIndex = this.getColumnIndex(startingColumnName);

        if (endingColumnName) {
            const endingColumnIndex = this.getColumnIndex(endingColumnName);
            return this.expectedHeaders.slice(startingColumnIndex, endingColumnIndex);
        }  
        else {
            return this.expectedHeaders.slice(startingColumnIndex);
        }

    }

    generateLoadExportedDataScript (dataFilter: ((stats: string[][]) => string[][]) | undefined, tableName: string, primaryKey?: PrimaryKey, constraints?: Constraint[]) {

        const datatable = this.getExportDatatableSchema(tableName, primaryKey, constraints);

        const insertHeadersScript: string = this.expectedHeaders.map((column) => `[${column.databaseColumnName}]`).join(', ');
        const insertRecords = dataFilter ? dataFilter(this.stats) : this.stats;

        const insertValuesScript: string = insertRecords.map((record) => this.insertValueScript(record)).join(',\n');

        return `
    DROP TABLE IF EXISTS temp.${tableName};
    ${datatable.createTableString()}

    INSERT INTO temp.${tableName} (${insertHeadersScript})
    VALUES 
    ${insertValuesScript};
        `;

    }

    private insertValueScript (record: string[]) {
        return "(" + record.map((recordValue, headerIndex) => this.getValue(recordValue, headerIndex)).join(', ') + ")";
    }

    private getExportDatatableSchema (tableName: string, primaryKey?: PrimaryKey, constraints?: Constraint[]) {

        const isTemporaryFlag = true;
        const datatableModel: DatatableModel = {
            tableName,
            columns: this.expectedHeaders.map((column) => {
                return {
                    name: column.databaseColumnName,
                    type: column.type,
                    notNull: true,
                }
            }),
            constraints,
            primaryKey,
        }

        return new Datatable(datatableModel, isTemporaryFlag);

    }

    private getValue (recordValue: string, colIndex: number) {

        const isValueNullFlag = recordValue === '';
        const fieldType = this.expectedHeaders[colIndex].type;

        if (isValueNullFlag) {
            switch (fieldType) {
                case "INTEGER":                
                case "REAL":
                    return '0';
                case "TEXT":
                    return `''`;
                case "DATETIME":
                    return "'1970-01-01'"                    
                default:
                    return 'UNKNOWN';
            }
        }
        else {
            switch (fieldType) {                
                case "INTEGER":                
                case "REAL":
                    return recordValue;
                case "TEXT":
                    return `'${recordValue.replaceAll("'","''")}'`;
                case "DATETIME":
                    return `'${recordValue}'`;
                default:
                    return 'UNKNOWN';
            }            
        }

    }

    public getSelectedValues (columnNames: string[]) {

        const columnIndexes = columnNames.map(c => this.getColumnIndex(c));

        return this.stats.map(record => {
            const mappedRecord: string[] = [];

            for (const columnIndex of columnIndexes) {
                mappedRecord.push(this.getValue(record[columnIndex], columnIndex))
            }

            return mappedRecord;

        })

    }

    public *makeIterator  () {
        for (const dataRow of this.stats) {
            yield dataRow;
        }
    }

}