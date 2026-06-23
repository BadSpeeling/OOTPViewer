import { OotpExportDataColumn } from '../types';
import { PtCardListValue } from './index'

export class OotpDataExportStats {

    expectedHeaders: OotpExportDataColumn[]
    private stats: PtCardListValue[][]

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

}