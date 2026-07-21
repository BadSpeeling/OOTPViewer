import { OotpExportDataColumn } from '../../types';
import { OotpDataExport } from '../export-stats';
import { OotpExportReader } from './index'
import { parse, HTMLElement } from 'node-html-parser';

export class OotpHtmlExportReader extends OotpExportReader {
    
    constructor (expectedHeaders: OotpExportDataColumn[], ptCardListFile: string[]) {
        super(expectedHeaders, ptCardListFile);
    }

    async readExport () {

        const ptCardListText: string = await this.readFile();
        const htmlSections = this.getHtmlSections(ptCardListText);

        const sourceHeaders = this.parseHeaderSection(htmlSections.headerSection);
        this.validateHeaders(sourceHeaders);
        const exportedOotpData = this.parseDataSections(htmlSections.dataSection);

        return Promise.resolve(exportedOotpData);

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

        const exportedOotpData = new OotpDataExport(this.expectedHeaders);

        for (const curRow of dataSections) {

            const parsedRow = this.parseDataSection(curRow);
            exportedOotpData.addStatsRow(parsedRow);

        }

        return exportedOotpData;

    }

    private parseDataSection (dataSection: HTMLElement) {

        const dataCols = dataSection.querySelectorAll('td')

        if (dataCols.length !== this.expectedHeaders.length) {
            throw Error ("The row did not have the expected amount of columns per the provided expected headers");
        }

        return dataCols.map(r => r.removeWhitespace().text);            

    }

}

export type PtCardListSections =  {
    headerSection: HTMLElement,
    dataSection: HTMLElement[],
}