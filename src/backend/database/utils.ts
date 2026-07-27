import { OotpExportDataColumnType } from "../types";

export function getValue (recordValue: string | null, fieldType: OotpExportDataColumnType) {

    const isValueNullFlag = recordValue === null || recordValue === '';

    if (isValueNullFlag) {
        switch (fieldType) {
            case "INTEGER":                
            case "REAL":
                return '0';
            case "TEXT":
                return `''`;
            case "DATETIME":
                return "'1970-01-01'"                    
            default:
                return 'UNKNOWN';
        }
    }
    else {
        switch (fieldType) {                
            case "INTEGER":                
            case "REAL":
                return recordValue;
            case "TEXT":
                return `'${recordValue.replaceAll("'","''")}'`;
            case "DATETIME":
                return `'${recordValue}'`;
            default:
                return 'UNKNOWN';
        }            
    }

}