import { OotpExportDataColumnType } from '../types'

export class PtCardListValue {

    fieldName: string;
    fieldValue: string;
    fieldType: OotpExportDataColumnType;

    constructor (fieldName: string, fieldValue: string, fieldType: OotpExportDataColumnType) {
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
        this.fieldType = fieldType;
    }

}