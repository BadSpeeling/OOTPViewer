import { IDatatableModelReader } from "../../../src/backend/database-creator/";
import { DataTableColumn, DatatableModel } from '../../../src/backend/types'

export class FakeTwoDatatableModelReader implements IDatatableModelReader {
    
    getDatatableModels () {

        const tableOneColumns: DataTableColumn[] = [
            {
                name: 'IntegerColumn',
                type: 'INTEGER',
                notNull: false
            }
        ] 

        const tableTwoColumns: DataTableColumn[] = [
            {
                name: 'IntegerColumn',
                type: 'INTEGER',
                notNull: false
            }
        ] 

        const dataTableModel: DatatableModel[] = [
            {
                tableName: 'Table1',
                columns: tableOneColumns
            },
            {
                tableName: 'Table2',
                columns: tableTwoColumns
            }
        ]

        return dataTableModel;

    }

}