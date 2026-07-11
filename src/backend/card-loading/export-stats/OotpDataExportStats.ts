import { Constraint, DatatableModel, OotpExportDataColumn, PrimaryKey,  } from '../../types';
import { PtCardListValue } from '../export-reader'
import { Datatable } from '../../database/Datatable'

export class OotpDataExportStats {

    protected expectedHeaders: OotpExportDataColumn[]
    protected stats: PtCardListValue[][]

    constructor (expectedHeaders: OotpExportDataColumn[]) {
        this.expectedHeaders = expectedHeaders;
        this.stats = [];
    }

    addStatsRow (row: PtCardListValue[]) {
        this.stats.push(row);
    }

    recordCount () {
        return this.stats.length;
    }   

    getRecord (index: number) {
        return this.stats[index];
    }

    protected generateLoadExportedDataScript (filterStats: ((stats: PtCardListValue[][]) => PtCardListValue[][]) | undefined, tableName: string, primaryKey?: PrimaryKey, constraints?: Constraint[]) {

        const datatable = this.getExportDatatableSchema(tableName, primaryKey, constraints);

        const insertHeadersScript: string = this.expectedHeaders.map((column) => `[${column.databaseColumnName}]`).join(', ');
        const insertRecords = filterStats ? filterStats(this.stats) : this.stats;

        const insertValuesScript: string = insertRecords.map((record) => this.insertValueScript(record)).join(',\n');

        return `
    DROP TABLE IF EXISTS temp.${tableName};
    ${datatable.createTableString()}

    INSERT INTO temp.${tableName} (${insertHeadersScript})
    VALUES 
    ${insertValuesScript};
        `;

    }

    private insertValueScript (record: PtCardListValue[]) {
        return "(" + record.map((recordColumn) => recordColumn.getValue()).join(', ') + ")";
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
    
    public *makeIterator  () {
        for (const dataRow of this.stats) {
            yield dataRow;
        }
    }

}