import { OotpDataExportStats } from './index'

export interface IOotpExportReader {

    readExport: () => Promise<OotpDataExportStats>;

}