var mongoose = require('mongoose');
var Temp = mongoose.model('Temp');
var TempRecord = mongoose.model('TempRecord');
var sensor = require('ds18x20');
var smtp = require('./smtp');

var M = 1;

var now = new Date();
var tMins = (M - 1) - (now.getMinutes() % M);
var tSecs = tMins * 60 + (60 - now.getSeconds());

setTimeout(function () {
    record(); // run for the first time
    // ... then executes within interval
    setInterval(record, M * 60 * 1000);
}, tSecs * 1000);

function record() {

    var temps = sensor.getAll();

    for (var key in temps) {
        if (temps.hasOwnProperty(key)) {

            // check temperature
            Temp.findOne({sensorId: key}, function (err, temp) {
                if (temps[temp.sensorId] >= temp.alarmThreshold) {
                    var body = "Teplota pre senzor <b>";
                    body += temp.name;
                    body += "</b> prekročila hranicu " + temp.alarmThreshold;
                    body += "<div style=\"font-size: 1.5em\">" + temps[temp.sensorId] + "</div>";
                    smtp.sendEmail("kasinec.maros@gmail.com", "Teplotný ALARM - " + temp.name, body, function (err, res) {
                        // empty so far
                    });
                }
            });

            // persist temperature
            var newRecord = new TempRecord({
                sensorId: key,
                value: temps[key]
            });
            newRecord.save(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    }


}