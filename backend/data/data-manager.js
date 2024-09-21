const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');


function getCsvRecord(fileName) {
    return new Promise((resolve) => {
        const results = [];
        const filePath = path.join(__dirname, 'files', `${fileName}.csv`);

        try {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    results.push(row);
                })
                .on('end', () => {
                    resolve(results);
                }).on('error', () => {
                    resolve([])
                })

        } catch (error) {
            resolve([]);
        }
    });
}

function readCsvFile(fileName, schema) {
    const filePath = path.join(__dirname, 'files', `${fileName}.csv`);

    return createCsvWriter({
        path: filePath,
        header: schema,
        append: fs.existsSync(filePath)
    });
}

async function storeData(fileName, schema, data) {
    const csvFile = readCsvFile(fileName, schema);

    const id = Math.ceil(Math.random() * 100000);
    const modifiedData = { id, ...data };

    await csvFile.writeRecords([modifiedData])

    return modifiedData;
}

async function updateData(fileName, schema, id, newData) {
    const records = await getCsvRecord(fileName); // Fetch all existing records
    const filePath = path.join(__dirname, 'files', `${fileName}.csv`);

    // Find and update the record with the matching ID
    const updatedRecords = records.map(record => {
        if (parseInt(record.id) === parseInt(id)) {
            return { ...record, ...newData }; // Update record with new data
        }
        return record;
    });

    // Create a CSV writer without append mode to overwrite the file
    const csvWriter = createCsvWriter({
        path: filePath,
        header: schema,
        append: false // Overwrite the file
    });

    // Write the updated records back to the CSV
    await csvWriter.writeRecords(updatedRecords);

    return updatedRecords.find(record => parseInt(record.id) === parseInt(id));
}

module.exports = { storeData, getCsvRecord, updateData };