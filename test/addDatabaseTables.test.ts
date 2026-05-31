import { test, expect, beforeAll, afterAll } from '@jest/globals'

import * as fs from 'node:fs'
import * as path from 'node:path';
import { Database } from '../src/backend/database/Database';
import { FakeOneDatatableModelReader, FakeTwoDatatableModelReader, FakeAutoIncrementDatatableModelReader } from './fakes/DatatableModelReader/';
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

    const databaseFile = createDatabase();
	const db = new Database(databaseFile)
    const creator: IDatatableCreator = new LocalSqliteDatatableCreator(new FakeOneDatatableModelReader(), db);  
    await creator.createDataTables();

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

    const databaseFile = createDatabase();
	const db = new Database(databaseFile)
    const creator: IDatatableCreator = new LocalSqliteDatatableCreator(new FakeTwoDatatableModelReader(), db);  
    await creator.createDataTables();

	const tables = await db.getAllMapped<SqliteTable>("select type,name,tbl_name from sqlite_master where type = 'table'");

	const tableOne = tables.find(t => t.name === 'Table1');
	expect(tableOne?.tbl_name === "Table1").toBeTruthy();

	const tableTwo = tables.find(t => t.name === 'Table2');
	expect(tableTwo?.tbl_name === "Table2").toBeTruthy();

})

test('Project datatable model reader test', () => {

	const reader: IDatatableModelReader = new ProjectDatatableModelReader();
	const model = reader.getDatatableModels()

	//verify we read something
	expect(model.length > 0).toBeTruthy();

})

test('Create primary key with autoincrement', async () => {

    const databaseFile = createDatabase();
	const db = new Database(databaseFile)
    const creator: IDatatableCreator = new LocalSqliteDatatableCreator(new FakeAutoIncrementDatatableModelReader(), db);  
    await creator.createDataTables();

	//autoincrement will not be used and verifiable until table has at least 1 record
	await db.execute('insert into TestTableName (TextColumn) values ("tst");')

	const columns = await getTableColumnsMetadata(db, 'TestTableName');
	var pkColumn = columns.find(c => c.name === "IntegerColumn");
	expect(pkColumn?.pk === 1).toBeTruthy();
	expect(await doesDatatableHasPkAutoincrement(db)).toBeTruthy();
	
})

const createDatabase = () => {
  	const currTime = Date.now();    
  	const databaseFile = path.join(...databaseFilePath, `${currTime}.db`);
	fs.closeSync(fs.openSync(databaseFile, 'w'));
	return databaseFile;
}

const getTableColumnsMetadata = async (db: Database, tableName: string) => {
	return await db.getAllMapped<SqliteTableColumn>(`PRAGMA table_info('${tableName}')`);
}

const doesDatatableHasPkAutoincrement = async (db: Database) => {
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

type SqliteTable = {
	type: 'table'|'index',
	name: string,
	tbl_name: string,
	rootpage: number
}