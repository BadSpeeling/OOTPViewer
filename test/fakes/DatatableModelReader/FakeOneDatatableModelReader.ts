import { IDatatableModelReader } from "../../../src/backend/database-creator/";
import { DataTableColumn, DatatableModel } from '../../../src/backend/types'

export class FakeOneDatatableModelReader implements IDatatableModelReader {
    
    async getDatatableModels () {

        const columns: DataTableColumn[] = [
            {
                name: 'IntegerColumn',
                type: 'INTEGER',
                notNull: true
            },
            {
                name: 'TextColumn',
                type: 'TEXT',
                notNull: false
            },
            {
                name: 'RealColumn',
                type: 'REAL',
                notNull: false
            }
        ] 

        const dataTableModel: DatatableModel[] = [
            {
                tableName: 'TestTableName',
                columns
            }
        ]

        return dataTableModel;

    }

}