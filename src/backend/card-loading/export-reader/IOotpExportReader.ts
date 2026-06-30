import { OotpDataExportStats } from '../export-stats/index'

export interface IOotpExportReader {

    readExport: () => Promise<OotpDataExportStats>;

}