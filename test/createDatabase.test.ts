import { test, expect, beforeAll, afterAll } from '@jest/globals'

import * as fs from 'node:fs'
import * as path from 'node:path';
import { IDatabaseCreator, LocalSqliteDatabaseCreator } from '../src/backend/database-creator/'
import { Database } from '../src/backend/database/Database';

const databaseFilePathRoot = ['E:','ootp_data','sqlite','test','init-db-tests']

beforeAll(() => {

  	fs.writeFileSync(path.join(...[...databaseFilePathRoot, 'existing.db']), '');

})

afterAll(() => {

  	fs.readdir(path.join(...databaseFilePathRoot), (err, files) => {
    	if (err) throw err;

    	for (const file of files) {
      		fs.unlink(path.join(...databaseFilePathRoot, file), (err) => {
        		if (err) throw err;
      		});
    	}
  	});

})

test('Create database', async () => {

    const databaseFilePath = getDatabaseFilePath();
    const creator: IDatabaseCreator = new LocalSqliteDatabaseCreator(databaseFilePath);  
    
    let db: Database|null = null; 
    
    try {
      	db = creator.createDatabase();
    }
    catch {

    }
    
    expect(db !== null).toBeTruthy();
    expect(databaseExists(path.join(...databaseFilePath)));

})

test('Fail if existing', async () => {

  	const existingPath = [...databaseFilePathRoot, 'existing.db'];
  	const creator: IDatabaseCreator = new LocalSqliteDatabaseCreator(existingPath);  

  	let errMsg: string = '';

  	try {
    	creator.createDatabase();
  	}
  	catch (error) {
    	if (error instanceof Error) {
      		errMsg = error.message;
    	}
  	}

  	expect(errMsg.includes('is already an existing SQLite db file')).toBeTruthy();

})

test('Fail if not db file', async () => {

  	const existingPath = [...databaseFilePathRoot, 'not-db'];
  	const creator: IDatabaseCreator = new LocalSqliteDatabaseCreator(existingPath);  

  	let errMsg: string = '';

  	try {
    	creator.createDatabase();
  	}
  	catch (error) {
    	if (error instanceof Error) {
      		errMsg = error.message;
    	}
  	}

  	expect(errMsg.includes('is not a SQLite db file')).toBeTruthy();

})

test('Fail if folder does not exist', async () => {

  	const existingPath = [...databaseFilePathRoot, 'not-a-folder','pt.db'];
  	const creator: IDatabaseCreator = new LocalSqliteDatabaseCreator(existingPath);  

  	let errMsg: string = '';

  	try {
    	creator.createDatabase();
  	}
  	catch (error) {
    	if (error instanceof Error) {
      		errMsg = error.message;
    	}
  	}

  	expect(errMsg.includes('is not a folder that exists')).toBeTruthy();

})

// test('Add table to database', async () => {

// })

// test('Run table load', async () => {
  
//   //const currTime = 1742076082472;

//   const cards = await getCards("C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 26\\online_data\\pt_card_list.csv")
//   await writeCards(`C:\\Users\\efrye\\Documents\\data\\${currTime}.db`,cards)

//   const db = await open({
//       filename: `C:\\Users\\efrye\\Documents\\data\\${currTime}.db`,
//       driver: sqlite3.Database
//     });

//   const result = await db.get("SELECT COUNT(*) cnt FROM PtCard");

//   expect(result["cnt"] === cards.length).toBeTruthy();

//   //console.log(result);

// })

// test('Run table load', async () => {

//     const db = getDatabase();
//     await processPtCardList(db);

//     const result = await db.get("SELECT COUNT(*) FROM PtCard");

//     console.log(result);

// })

const databaseExists = (databaseFilePath: string) => {
  return fs.existsSync(databaseFilePath);
}

const getDatabaseFilePath = () => {
  const currTime = Date.now();    
  return [...databaseFilePathRoot, `${currTime}.db`];
}