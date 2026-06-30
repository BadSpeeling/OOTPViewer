import { OotpExportDataColumn } from '../../types';
import { OotpExportReader, PtCardListValue } from './index'
import { OotpDataExportStats } from '../export-stats'

export class OotpCsvExportReader extends OotpExportReader {
    
    constructor (expectedHeaders: OotpExportDataColumn[], ptCardListFile: string[], exportedStats: OotpDataExportStats) {
        super(expectedHeaders, ptCardListFile, exportedStats);
    }
    
    async readExport () {
        
        const csvText: string = await this.readFile();
        const csvListSections: PtCardListSections = this.getCsvSections(csvText);

        const sourceHeaders = this.parseHeaderSection(csvListSections.headerSection);
        this.validateHeaders(sourceHeaders);
        this.parseDataSections(csvListSections.dataSection);

        return Promise.resolve(this.exportedStats);

    }

    private getCsvSections (ptCardListText: string) {

        const lines = ptCardListText.split('\r\n');
        
        const headerSection: string = lines[0];
        const dataSection: string[] = lines.slice(1, lines.length);

        const sections: PtCardListSections = {
            headerSection,
            dataSection,
        }

        return sections;

    }

    private parseHeaderSection (headerSection: string) {
        return headerSection.replace('//','').split(',');
    }

    private parseDataSections (dataSections: string[]) {

        for (const curRow of dataSections) {

            if (curRow.length !== 0) {
                
                const parsedRow = this.parseDataSection(curRow);
                this.exportedStats.addStatsRow(parsedRow);

            }

        }

    }

    private parseDataSection (dataSection: string) {

        const parsedRow: PtCardListValue[] = [];
            
        const cleanedDataLine = this.removeTrailingComma(dataSection);
        const csvRow = cleanedDataLine.split(',');

        if (csvRow.length !== this.expectedHeaders.length) {
            throw Error ("The row did not have the expected amount of columns per the provided expected headers");
        }

        for (const colIndex of [...Array(csvRow.length).keys()]) {

            const curDataColumn = this.expectedHeaders[colIndex];
            parsedRow.push(new PtCardListValue(curDataColumn.nameInSource, csvRow[colIndex].trim(), curDataColumn.type))

        }

        return parsedRow;            

    }

    private removeTrailingComma (line: string) {
        return line.substring(0,line.length-1)
    }


}

type PtCardListSections =  {
    headerSection: string,
    dataSection: string[],
}