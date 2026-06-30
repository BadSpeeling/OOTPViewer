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

    protected rawDataLoadPart (tableName: string, primaryKey?: PrimaryKey, constraints?: Constraint[]) {

        const datatable = this.CsvDataToTempTable(tableName, primaryKey, constraints);

        const insertHeadersPart = this.expectedHeaders.map((column) => `[${column.databaseColumnName}]`).join(', ');
        const recordsPart = this.stats.map((record) => this.rawDataLoadRecordPart(record)).join(',\n');

        return `
    DROP TABLE IF EXISTS temp.${tableName};
    ${datatable.createTableString()}

    INSERT INTO temp.${tableName} (${insertHeadersPart})
    VALUES 
    ${recordsPart};
        `;

    }

    private rawDataLoadRecordPart (record: PtCardListValue[]) {
        return "(" + record.map((recordColumn) => recordColumn.getValue()).join(', ') + ")";
    }

    private CsvDataToTempTable (tableName: string, primaryKey?: PrimaryKey, constraints?: Constraint[]) {

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

}