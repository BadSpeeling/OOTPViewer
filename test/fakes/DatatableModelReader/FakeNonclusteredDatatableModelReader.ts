import { IJsonModelReader } from "../../../src/backend/database-creator/";
import { DataTableColumn, DatatableModel } from '../../../src/backend/types'

export class FakeNonclusteredDatatableModelReader implements IJsonModelReader<DatatableModel> {
    
    async getJsonModels () {

        const columns: DataTableColumn[] = [
            {
                name: 'IntegerColumn1',
                type: 'INTEGER',
                notNull: true
            },
            {
                name: 'IntegerColumn2',
                type: 'INTEGER',
                notNull: true
            }
        ] 

        const dataTableModel: DatatableModel[] = [
            {
                tableName: 'TestTableName',
                columns,
                indicies: [{
                    columns: ["IntegerColumn1","IntegerColumn2"]
                }]
            }
        ]

        return dataTableModel;

    }

}