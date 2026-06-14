import { OotpExportDataColumn } from '../types';
import { IOotpExportReader, PtCardListValue } from '.'
import { readFileAsync } from '../../utilities'

export class OotpCsvExportReader implements IOotpExportReader {
    
    expectedHeaders: OotpExportDataColumn[]
    ptCardListFilePath: string[]

    constructor (expectedHeaders: OotpExportDataColumn[], ptCardListFile: string[]) {
        this.expectedHeaders = expectedHeaders;
        this.ptCardListFilePath = ptCardListFile;
    } 

    async readExport () {
        
        const ptCardListText: string = await readFileAsync(this.ptCardListFilePath);
        const ptCardListSections: PtCardListSections = this.#getPtCardListSections(ptCardListText);

        const sourceHeaders = this.#parseHeaderSection(ptCardListSections.headerSection);
        this.#validateHeaders(sourceHeaders);
        const parsedDataSection = this.#parseDataSections(ptCardListSections.dataSection);

        return Promise.resolve(parsedDataSection);

    }

    #getPtCardListSections (ptCardListText: string) {

        const lines = ptCardListText.split('\r\n');
        
        const headerSection: string = lines[0];
        const dataSection: string[] = lines.slice(1, lines.length);

        const sections: PtCardListSections = {
            headerSection,
            dataSection,
        }

        return sections;

    }

    #parseHeaderSection (headerSection: string) {
        return headerSection.replace('//','').split(',');
    }

    #parseDataSections (dataSections: string[]) {

        const parsedDataSections: Map<string, PtCardListValue>[] = [];

        for (const rowIndex of [...Array(dataSections.length).keys()]) {

            const curRow = dataSections[rowIndex];

            if (curRow.length !== 0) {
                
                const parsedRow = this.#parseDataSection(curRow);
                parsedDataSections.push(parsedRow);

            }

        }

        return parsedDataSections;

    }

    #parseDataSection (dataSection: string) {

        const parsedRow: Map<string, PtCardListValue> = new Map<string, PtCardListValue> ();
            
        const cleanedDataLine = this.#removeTrailingComma(dataSection);
        const csvRow = cleanedDataLine.split(',');

        for (const colIndex of [...Array(csvRow.length).keys()]) {

            const curDataColumn = this.expectedHeaders[colIndex];

            parsedRow.set(curDataColumn.nameInSource, {
                fieldName: curDataColumn.nameInSource,
                fieldType: curDataColumn.type,
                fieldValue: csvRow[colIndex],
            })

        }

        return parsedRow;            

    }

    #validateHeaders (headers: string[]) {

        if (headers.length !== this.expectedHeaders.length) {
            throw Error("The expected input and actual input do not have the same amount of columns");
        }

        for (const index of [...Array(headers.length).keys()]) {
            if (headers[index] !== this.expectedHeaders[index].nameInSource) {
                throw Error(`${headers[index]} is not the expected column name in place ${index}, expecting ${this.expectedHeaders[index]}`)
            }
        }

    }

    #removeTrailingComma (line: string) {
        return line.substring(0,line.length-1)
    }


}

type PtCardListSections =  {
    headerSection: string,
    dataSection: string[],
}
