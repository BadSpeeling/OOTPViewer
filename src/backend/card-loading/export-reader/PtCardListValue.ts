import { OotpExportDataColumnType } from '../../types'

export class PtCardListValue {

    fieldName: string;
    fieldValue: string;
    fieldType: OotpExportDataColumnType;

    constructor (fieldName: string, fieldValue: string, fieldType: OotpExportDataColumnType) {
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
        this.fieldType = fieldType;
    }

    isValueNull () {
        return this.fieldValue === '';
    }

    getValue () {

        const valueNullFlag = this.isValueNull();

        if (valueNullFlag) {
            switch (this.fieldType) {
                case "INTEGER":                
                case "REAL":
                    return 0;
                case "TEXT":
                    return `''`;
                case "DATETIME":
                    return "'1970-01-01'"                    
                default:
                    return 'UNKNOWN';
            }
        }
        else {
            switch (this.fieldType) {                
                case "INTEGER":                
                case "REAL":
                    return this.fieldValue;
                case "TEXT":
                    return `'${this.fieldValue.replaceAll("'","''")}'`;
                case "DATETIME":
                    return `'${this.fieldValue}'`;
                default:
                    return 'UNKNOWN';
            }            
        }

    }

}