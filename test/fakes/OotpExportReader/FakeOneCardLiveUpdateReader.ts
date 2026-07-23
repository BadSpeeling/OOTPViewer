import { IOotpExportReader } from "../../../src/backend/card-loading/export-reader";
import { OotpDataExport } from "../../../src/backend/card-loading/export-stats";
import { OotpExportDataColumn } from "../../../src/backend/types";

export class FakeOneCardLiveUpdateReader implements IOotpExportReader{
    
    readExport () {

        const ootpDataColumns: OotpExportDataColumn[] = [
            {
                databaseColumnName: "CardID",
                nameInSource: "Card ID",
                type: "INTEGER",
            },
            {
                databaseColumnName: "CardValue",
                nameInSource: "Card Value",
                type: "INTEGER",
            }
        ];

        const ootpExport = new OotpDataExport (ootpDataColumns);
        ootpExport.addStatsRow(["1","90"]);
        return Promise.resolve(ootpExport);

    };

}