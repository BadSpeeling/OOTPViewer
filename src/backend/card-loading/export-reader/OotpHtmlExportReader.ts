import { OotpExportDataColumn } from '../../types';
import { OotpExportReader, PtCardListValue } from './index'
import { OotpDataExportStats } from '../export-stats'
import { parse, HTMLElement } from 'node-html-parser';

export class OotpHtmlExportReader extends OotpExportReader {
    
    constructor (expectedHeaders: OotpExportDataColumn[], ptCardListFile: string[], exportedStats: OotpDataExportStats) {
        super(expectedHeaders, ptCardListFile, exportedStats);
    }

    async readExport () {

        const ptCardListText: string = await this.readFile();
        const htmlSections = this.getHtmlSections(ptCardListText);

        const sourceHeaders = this.parseHeaderSection(htmlSections.headerSection);
        this.validateHeaders(sourceHeaders);
        this.parseDataSections(htmlSections.dataSection);

        return Promise.resolve(this.exportedStats);

    }

    private getHtmlSections (ptCardListText: string) {

        const root = parse(ptCardListText);
    
        const statsTable = root.querySelector('table.data.sortable')
        
        if (statsTable === null) {
            throw Error ("Could not find export table");
        }

        const headers = statsTable.querySelector('tr:first-child')
        const statsRows = statsTable.querySelectorAll('tr:not(:first-child)')
        
        if (headers === null || headers.querySelectorAll('th').length === 0) {
            throw Error ("Could not find headers");
        }
            
        if (statsRows.length === 0) {
            throw Error ("Could not find data");
        }

        const sections: PtCardListSections = {
            headerSection: headers,
            dataSection: statsRows,
        }

        return sections;

    }
    
    private parseHeaderSection (headerSection: HTMLElement) {
        return headerSection.querySelectorAll('th').map((curHeader) => curHeader.text)
    }

    private parseDataSections (dataSections: HTMLElement[]) {

        for (const curRow of dataSections) {

            const parsedRow = this.parseDataSection(curRow);
            this.exportedStats.addStatsRow(parsedRow);

        }

    }

    private parseDataSection (dataSection: HTMLElement) {

        const parsedRow: PtCardListValue[] = [];

        const dataCols = dataSection.querySelectorAll('td')

        if (dataCols.length !== this.expectedHeaders.length) {
            throw Error ("The row did not have the expected amount of columns per the provided expected headers");
        }

        for (const colIndex of [...Array(dataCols.length).keys()]) {

            const curDataColumn = this.expectedHeaders[colIndex];
            parsedRow.push(new PtCardListValue(curDataColumn.nameInSource, dataCols[colIndex].removeWhitespace().text, curDataColumn.type))

        }

        return parsedRow;            

    }

}

export type PtCardListSections =  {
    headerSection: HTMLElement,
    dataSection: HTMLElement[],
}