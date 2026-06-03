import { IDatatableModelReader } from "../../../src/backend/database-creator/";
import { DataTableColumn, DatatableModel } from '../../../src/backend/types'

export class FakeForeignKeyDatatableModelReader implements IDatatableModelReader {

    getDatatableModels () {

        const baseTableColumns: DataTableColumn[] = [
            {
                name: 'BaseTableID',
                type: 'INTEGER',
                notNull: true
            }
        ] 

        const referencingTableColumns: DataTableColumn[] = [
            {
                name: 'ReferencingTableID',
                type: 'INTEGER',
                notNull: true
            },
            {
                name: 'BaseTableID',
                type: 'INTEGER',
                notNull: true
            }
        ] 

        const dataTableModel: DatatableModel[] = [
            {
                tableName: 'BaseTable',
                columns: baseTableColumns,
                primaryKey: {
                    autoincrement: true,
                    column: 'BaseTableID'
                }
            },
            {
                tableName: 'ReferencingTable',
                columns: referencingTableColumns,
                primaryKey: {
                    autoincrement: true,
                    column: 'ReferencingTableID'
                },
                foreignKeyTables: ['BaseTable']
            }
        ]

        return dataTableModel;

    }

}