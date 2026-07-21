import { OotpDataExport } from "./OotpDataExport";

export interface IExportWriter {
    exportOotpData (data: OotpDataExport)
}