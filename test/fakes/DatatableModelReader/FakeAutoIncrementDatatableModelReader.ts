import { IDatatableModelReader } from "../../../src/backend/database-creator/";
import { DataTableColumn, DatatableModel } from '../../../src/backend/types'

export class FakeAutoIncrementDatatableModelReader implements IDatatableModelReader {
    
    getDatatableModels () {

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
            }
        ] 

        const dataTableModel: DatatableModel[] = [
            {
                tableName: 'TestTableName',
                columns,
                primaryKey: {
                    autoincrement: true,
                    column: "IntegerColumn"
                }
            }
        ]

        return dataTableModel;

    }

}