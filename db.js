// persistence
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Temp definition
 */
var TempSchema = new Schema({
    sensorId: String,
    name: { type: String, default: "---" },
    alarmThreshold: { type: Number, default: Number.MAX_VALUE }
});

mongoose.model('Temp', TempSchema);

/**
 * TempRecord definition
 */
var TempRecordSchema = new Schema({
    sensorId: String,
    timestamp: { type: Date, default: Date.now },
    value: Number
});

mongoose.model('TempRecord', TempRecordSchema)

/**
 * DB connection
 */
mongoose.connect('mongodb://localhost/tempwatch');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
});
