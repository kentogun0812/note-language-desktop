function createConnect(){
    const mysql = require('mysql');
    let connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'note_language'
    });
    connection.connect(function () {
    });
    return connection;
}

async function loadData(callback, textSearch) {
    let connection = createConnect();
    let query = 'SELECT * FROM `language` WHERE `vocabulary` LIKE ' + '"%' + textSearch + '%"' + ' OR `phonetic` LIKE ' + '"%' + textSearch + '%"' + ' OR `mean` LIKE ' + '"%' + textSearch + '%"';
    await connection.query(query, function (err, rows, fields) {
        if (err) {
            return;
        }
        callback(rows);
    });
    connection.end(function () {
    });
}

async function insertData(vocabulary, phonetic, mean, exa_sentence, exa_mean) {
    let connection = createConnect();
    let query = 'INSERT INTO `language` (`vocabulary`, `phonetic`, `mean`, `memorized`, `exa_sentence`, `exa_mean`) VALUES (' + '"' + vocabulary + '"' + ',' + '"' + phonetic + '"' + ',' + '"' + mean + '"' + ',0'+ ',' + '"' + exa_sentence + '"'+ ',' + '"' + exa_mean + '")';
    await connection.query(query, function (err, rows, fields) {
        if (err) {
            alert(err);
            return;
        }
    });
    connection.end(function () {
    });
}

async function updateData(lagID, vocabulary, phonetic, mean) {
    let connection = createConnect();
    let query = 'UPDATE `language` SET `vocabulary` = ' + '"' + vocabulary + '"' + ', `phonetic` = ' + '"' + phonetic + '"' + ', `mean` = ' + '"' + mean + '"' + ' WHERE `lagID` = ' + lagID;
    await connection.query(query, function (err, rows, fields) {
        if (err) {
            alert(err);
            return;
        }
    });
    connection.end(function () {
    });
}

async function bookMarkVocabulary(lagID, isMemorized) {
    let connection = createConnect();
    let query;
    if(isMemorized === 1){
        query = 'UPDATE `language` SET `memorized` = 0 WHERE `lagID` = ' + lagID;
    }else{
        query = 'UPDATE `language` SET `memorized` = 1 WHERE `lagID` = ' + lagID;
    }
    await connection.query(query, function (err, rows, fields) {
        if (err) {
            alert(err);
            return;
        }
    });
    connection.end(function () {
    });
}

async function notification() {
    const notifier = require('node-notifier');
    let connection = createConnect();
    let query = 'SELECT * FROM `language` WHERE `memorized` = 0 ORDER BY RAND() LIMIT 1';
    await connection.query(query, function (err, row, fields) {
        if (err) {
            return;
        }
        if (row.length > 0) {
            notifier.notify({
                title: row[0].vocabulary + "  -  " + row[0].phonetic + "  -  " + row[0].mean,
                message: row[0].exa_sentence + "\n" + row[0].exa_mean,
                sound: false
            });
        }
    });
    connection.end(function () { });
    setTimeout(notification, 15000);
}
