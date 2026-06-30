import { OotpExportDataColumn } from "../../types";
import { OotpDataExportStats } from "../export-stats";
import { IOotpExportReader } from './index'
import { readFileAsync } from '../../../utilities'

export abstract class OotpExportReader implements IOotpExportReader {

    abstract readExport (): Promise<OotpDataExportStats>;

    protected expectedHeaders: OotpExportDataColumn[]
    protected ptCardListFilePath: string[]
    protected exportedStats: OotpDataExportStats;

    constructor (expectedHeaders: OotpExportDataColumn[], ptCardListFile: string[], exportedStats: OotpDataExportStats) {
        this.expectedHeaders = expectedHeaders;
        this.ptCardListFilePath = ptCardListFile;
        this.exportedStats = exportedStats;
    } 

    protected async readFile  () {
        return await readFileAsync(this.ptCardListFilePath);
    }

    protected validateHeaders (sourceHeaders: string[]) {

        if (sourceHeaders.length !== this.expectedHeaders.length) {
            throw Error("The expected input and actual input do not have the same amount of columns");
        }

        for (const index of [...Array(sourceHeaders.length).keys()]) {
            if (sourceHeaders[index] !== this.expectedHeaders[index].nameInSource) {
                throw Error(`${sourceHeaders[index]} is not the expected column name in place ${index}, expecting ${this.expectedHeaders[index].nameInSource}`)
            }
        }

    }

}