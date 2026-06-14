import { PtCardListValue } from './PtCardListValue'

export interface IOotpExportReader {

    readExport: () => Promise<Map<string, PtCardListValue>[]>

}