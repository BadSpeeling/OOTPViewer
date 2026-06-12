import { test, expect, beforeAll, afterAll } from '@jest/globals'

import * as fs from 'node:fs'
import * as path from 'node:path';
import { Database } from '../src/backend/database/Database';
import { FakeOneDatatableModelReader, FakeTwoDatatableModelReader, FakeAutoIncrementDatatableModelReader, FakeForeignKeyDatatableModelReader, FakeUniqueConstraintDatatableModelReader, FakeNonclusteredDatatableModelReader } from './fakes/DatatableModelReader/';
import { IDatatableModelReader, IDatatableCreator, LocalSqliteDatatableCreator, ProjectDatatableModelReader } from '../src/backend/database-creator';

const databaseFilePath = ['E:','ootp_data','sqlite','test','add-database-tables-tests']

beforeAll(() => {

	const testPath = path.join(...databaseFilePath);

	//if the testing folder doesn't exist, create it
	if (!fs.existsSync(testPath)) {
		fs.mkdirSync(testPath);
	}

})

afterAll(() => {

  	fs.readdir(path.join(...databaseFilePath), (err, files) => {
    	if (err) throw err;

    	for (const file of files) {
      		fs.unlink(path.join(...databaseFilePath, file), (err) => {
        		if (err) throw err;
      		});
    	}
  	});

})

test('Create 1 table', async () => {

	const db = await initializeDatabase(new FakeOneDatatableModelReader());

	const columns = await getTableColumnsMetadata(db, 'TestTableName');

	const integerCol = columns.find(c => c.name === 'IntegerColumn');
	expect(integerCol?.type === "INTEGER").toBeTruthy();
	expect(integerCol?.notnull === 1).toBeTruthy();

	const textCol = columns.find(c => c.name === 'TextColumn');
	expect(textCol?.type === "TEXT").toBeTruthy();
	expect(textCol?.notnull === 0).toBeTruthy();

	const realCol = columns.find(c => c.name === 'RealColumn');
	expect(realCol?.type === "REAL").toBeTruthy();

})

test('Create 2 tables', async () => {

	const db = await initializeDatabase(new FakeTwoDatatableModelReader());

	const tables = await db.getAllMapped<SqliteTable>("select type,name,tbl_name from sqlite_master where type = 'table'");

	const tableOne = tables.find(t => t.name === 'Table1');
	expect(tableOne?.tbl_name === "Table1").toBeTruthy();

	const tableTwo = tables.find(t => t.name === 'Table2');
	expect(tableTwo?.tbl_name === "Table2").toBeTruthy();

})

test('Project datatable model reader test', async () => {

	const reader: IDatatableModelReader = new ProjectDatatableModelReader();
	const model = await reader.getDatatableModels()

	//verify we read something
	expect(model.length > 0).toBeTruthy();

})

test('Create primary key with autoincrement', async () => {

	const db = await initializeDatabase(new FakeAutoIncrementDatatableModelReader());
    
	//autoincrement will not be used and verifiable until table has at least 1 record
	await db.execute('insert into TestTableName (TextColumn) values ("tst");')

	const columns = await getTableColumnsMetadata(db, 'TestTableName');
	var pkColumn = columns.find(c => c.name === "IntegerColumn");
	expect(pkColumn?.pk === 1).toBeTruthy();
	expect(await doesDatatableHavePkAutoincrement(db)).toBeTruthy();
	
})

test('Create foreign key', async () => {

	const db = await initializeDatabase(new FakeForeignKeyDatatableModelReader());

	const foreignKeys = await getForeignKeyMetadata(db, 'ReferencingTable');
	const createdForeignKey = foreignKeys.find(fk => fk.table === 'BaseTable');

	expect(typeof createdForeignKey !== 'undefined').toBeTruthy();
	expect(createdForeignKey?.from === 'BaseTableID').toBeTruthy();
	expect(createdForeignKey?.to === 'BaseTableID').toBeTruthy();

})

test('Create unique constraint', async () => {

	const db = await initializeDatabase(new FakeUniqueConstraintDatatableModelReader());

	const uniqueConstraints = await getIndiciesForTable(db, 'TestTableName');
	const indexName = 'UC_TestTableName_IntegerColumn1_IntegerColumn2';
	const createdUniqueConstraint = uniqueConstraints.find(uc => uc.name === indexName);

	expect(typeof createdUniqueConstraint !== 'undefined').toBeTruthy();

	const constraintColumns = await getIndexColumns(db, indexName);
	const col1 = constraintColumns.find(c => c.name === "IntegerColumn1");
	const col2 = constraintColumns.find(c => c.name === "IntegerColumn2");

	expect(typeof col1 !== 'undefined').toBeTruthy();
	expect(typeof col2 !== 'undefined').toBeTruthy();

})

test('Create nonclustered index', async () => {

	const db = await initializeDatabase(new FakeNonclusteredDatatableModelReader());

	const indicies = await getIndiciesForTable(db, 'TestTableName');
	const indexName = 'NIX_TestTableName_IntegerColumn1_IntegerColumn2';
	const createdNonclusteredIndex = indicies.find(i => i.name === indexName);

	expect(typeof createdNonclusteredIndex !== 'undefined').toBeTruthy();

	const indexColumns = await getIndexColumns(db, indexName);
	const col1 = indexColumns.find(c => c.name === "IntegerColumn1");
	const col2 = indexColumns.find(c => c.name === "IntegerColumn2");

	expect(typeof col1 !== 'undefined').toBeTruthy();
	expect(typeof col2 !== 'undefined').toBeTruthy();

})

const initializeDatabase = async (reader: IDatatableModelReader) => {

    const databaseFile = createDatabase();
	const db = new Database(databaseFile)
    const creator: IDatatableCreator = new LocalSqliteDatatableCreator(reader, db);  
    await creator.createDataTables();

	return db;

}

const createDatabase = () => {
  	const currTime = Date.now();    
  	const databaseFile = path.join(...databaseFilePath, `${currTime}.db`);
	fs.closeSync(fs.openSync(databaseFile, 'w'));
	return databaseFile;
}

const getForeignKeyMetadata = async (db: Database, tableName: string) => {
	return await db.getAllMapped<SqliteForeignKey>(`PRAGMA foreign_key_list('${tableName}')`);
}

const getTableColumnsMetadata = async (db: Database, tableName: string) => {
	return await db.getAllMapped<SqliteTableColumn>(`PRAGMA table_info('${tableName}')`);
}

const getIndiciesForTable = async (db: Database, tableName: string) => {
	return await db.getAllMapped<SqliteIndex>(`PRAGMA index_list('${tableName}')`);
}

const getIndexColumns = async (db: Database, indexName: string) => {
	return await db.getAllMapped<SqliteIndexColumn>(`PRAGMA index_info('${indexName}')`);
}

const doesDatatableHavePkAutoincrement = async (db: Database) => {
	const queryResult = await db.getMapped<{cnt:number}>("SELECT COUNT(*) cnt FROM sqlite_sequence WHERE name='TestTableName';");
	return queryResult.cnt > 0;
}

type SqliteTableColumn = {
	cid: number,
	name: string,
	type: string,
	notnull: 0|1,
	dflt_value: any,
	pk: 0|1,
}

type SqliteForeignKey = {
	id: number,
	seq: number,
	table: string,
	from: string,
	to: string,
	on_update: string,
	on_delete: string,
	match: string,
}

type SqliteIndex = {
	seq: number,
	name: string,
	unique: 0|1,
	origin: string,
	partial: 0|1,
}

type SqliteIndexColumn = {
	seqno: number,
	cid: number,
	name: string,
}

type SqliteTable = {
	type: 'table'|'index',
	name: string,
	tbl_name: string,
	rootpage: number
}