import { OotpExportDataColumn } from "../types";
import { IOotpExportReader, OotpDataExportStats } from "./";
import { readFileAsync } from '../../utilities'

export abstract class OotpExportReader implements IOotpExportReader {

    abstract readExport (): Promise<OotpDataExportStats>;

    protected expectedHeaders: OotpExportDataColumn[]
    protected ptCardListFilePath: string[]

    constructor (expectedHeaders: OotpExportDataColumn[], ptCardListFile: string[]) {
        this.expectedHeaders = expectedHeaders;
        this.ptCardListFilePath = ptCardListFile;
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
                throw Error(`${sourceHeaders[index]} is not the expected column name in place ${index}, expecting ${this.expectedHeaders[index]}`)
            }
        }

    }

}