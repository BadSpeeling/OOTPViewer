import { OotpExportDataColumn } from '../../types';
import { OotpExportReader } from './index'
import { OotpDataExport } from '../export-stats'

export class OotpCsvExportReader extends OotpExportReader {
    
    constructor (expectedHeaders: OotpExportDataColumn[], ptCardListFile: string[]) {
        super(expectedHeaders, ptCardListFile);
    }
    
    async readExport () {
        
        const csvText: string = await this.readFile();
        const csvListSections: PtCardListSections = this.getCsvSections(csvText);

        const sourceHeaders = this.parseHeaderSection(csvListSections.headerSection);
        this.validateHeaders(sourceHeaders);
        const exportedOotpData = this.parseDataSections(csvListSections.dataSection);

        return Promise.resolve(exportedOotpData);

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

        const exportedOotpData = new OotpDataExport(this.expectedHeaders);

        for (const curRow of dataSections) {

            if (curRow.length !== 0) {
                
                const parsedRow = this.parseDataSection(curRow);
                exportedOotpData.addStatsRow(parsedRow);

            }

        }

        return exportedOotpData;

    }

    private parseDataSection (dataSection: string) {

        const cleanedDataLine = this.removeTrailingComma(dataSection);
        const csvRow = cleanedDataLine.split(',');

        if (csvRow.length !== this.expectedHeaders.length) {
            throw Error ("The row did not have the expected amount of columns per the provided expected headers");
        }

        return csvRow.map(record => record.trim());            

    }

    private removeTrailingComma (line: string) {
        return line.substring(0,line.length-1)
    }


}

type PtCardListSections =  {
    headerSection: string,
    dataSection: string[],
}