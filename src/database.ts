const fs = require('fs');
const jsonio = require('./utils/jsonio');

const dataJson = 'data.json';

const readData = () => jsonio.read(dataJson);

const readValues = (key: string) => readData()[key];

exports.readAllItems = () => readValues("items");

exports.readAllTags = () => readValues("tags");

exports.readApplicationPaths = () => readValues('applications');

exports.readTags = (dirPath: string) => exports.readAllItems()[dirPath].tags;

exports.writeTags = (dirPath: string, tags: string[]) => {
    const data = readData();
    data["items"][dirPath].tags = tags;
    jsonio.write(dataJson, data);
};

exports.backupDataFile = () => fs.copyFile(dataJson, 'data.backup.json', () => console.log("data.json backed up."));