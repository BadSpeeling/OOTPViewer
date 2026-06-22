import { PtCardListValue } from './PtCardListValue'

export interface IOotpExportReader {

    readExport: () => Promise<PtCardListValue[][]>;
    
}