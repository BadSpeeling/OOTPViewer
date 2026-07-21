import { OotpDataExport } from '../export-stats/index'

export interface IOotpExportReader {

    readExport: () => Promise<OotpDataExport>;

}