import { Database } from "../src/backend/database/Database"
import { databaseObjectEqual } from "../src/utilities"
import * as fs from "node:fs"

import { readPtCardList } from "../src/backend/ptCardOperations"
import { ptCardList } from '../json/csvColumns.json'
import { writeCards, getLiveUpdates, upsertLiveUpdate, checkIfLiveUpdateOccured } from "../src/backend/ptCardOperations"

import * as readPtCardsTest from "./data/json/readPtCardsTestData"

const dir = 'E:\\ootp_data\\sqlite\\'

beforeAll(async () => {
    fs.copyFileSync(dir + 'pt-skeleton.db',dir + 'test.db');
});
  
afterAll(() => {
    fs.unlink(dir + 'test.db', () => {});
});

test('Read a card out of pt_card_list', async () => {

    const desiredData = readPtCardsTest.ptCardListTest;
    const cards = await readPtCardList(".\\test\\data\\1_card_pt_card_list.csv", ptCardList)

    expect(cards.length).toBe(1);
    const loadedCard = cards[0];
    expect(databaseObjectEqual(loadedCard,desiredData)).toBeTruthy();
    

})

test('LiveUpdate CRUD', async () => {

    const databasePath = dir + "test.db";
    const database = new Database(databasePath);

    const liveUpdateID = await upsertLiveUpdate(database, {LiveUpdateID: null, EffectiveDate: '2025-04-01'});
    const liveUpdates1 = await getLiveUpdates(databasePath);
    
    expect(liveUpdates1.find((liveUpdate) => liveUpdate.LiveUpdateID === liveUpdateID)?.EffectiveDate).toBe('2025-04-01');

    await upsertLiveUpdate(database, {LiveUpdateID: liveUpdateID, EffectiveDate: '2025-04-15'});
    const liveUpdates2 = await getLiveUpdates(databasePath);

    expect(liveUpdates2.find((liveUpdate) => liveUpdate.LiveUpdateID === liveUpdateID)?.EffectiveDate).toBe('2025-04-15');

})

test('Populate PtCard table with record', async () => {

    const liveCard = readPtCardsTest.populatePtCardTableTest.historicalCard;
    const expectedLiveCard = readPtCardsTest.populatePtCardTableTest.historicalCardExpectedData

    const database = new Database(dir + "test.db");
    await writeCards(database, [liveCard]);

    const liveCardRecord = await database.get(`select * from PtCard where CardID = ${expectedLiveCard.CardID}`)
    
    expect(databaseObjectEqual(liveCardRecord,expectedLiveCard)).toBeTruthy();

})

test('Populate PtCards table with updated live cards', async () => {

    const liveCardVersion1 = readPtCardsTest.populatePtCardLiveUpdateTest.liveCardVersion1;
    const liveCardVersion2 = readPtCardsTest.populatePtCardLiveUpdateTest.liveCardVersion2;

    const database = new Database(dir + "test.db");

    await writeCards(database, [liveCardVersion1]);
    const newLiveUpdateID = await database.insertOne("insert into LiveUpdate (EffectiveDate) values (UNIXEPOCH('2025-05-01'))");
    await writeCards(database, [liveCardVersion2]);

    const liveCards = await database.getAll(`select CardID,CardTitle,CardValue,LiveUpdateID from PtCard where CardID = ${liveCardVersion1["Card ID"]} order by LiveUpdateID asc`)

    expect(liveCards.length).toBe(2);
    expect(liveCards[0].LiveUpdateID !== newLiveUpdateID);
    expect(liveCards[1].LiveUpdateID === newLiveUpdateID)

})

test('Detect a live update has happened for live cards', async () => {
    
    const liveUpdateCardVersion1 = readPtCardsTest.checkLiveUpdateOccuredTest.liveCardVersion1;
    const liveUpdateCardVersion2 = readPtCardsTest.checkLiveUpdateOccuredTest.liveCardVersion2;

    const database = new Database(dir + "test.db");
    await writeCards(database, [liveUpdateCardVersion1]);

    const checkIfLiveUpdateOccuredResult = await checkIfLiveUpdateOccured(database, [liveUpdateCardVersion2]);
    expect(checkIfLiveUpdateOccuredResult).toBeTruthy();

    const checkIfLiveUpdateOccuredResultFalse = await checkIfLiveUpdateOccured(database, [liveUpdateCardVersion1]);
    expect(checkIfLiveUpdateOccuredResultFalse).toBeFalsy();

})