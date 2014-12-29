var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Temp = mongoose.model('Temp');
var TempRecord = mongoose.model('TempRecord');
var sensor = require('ds18x20');

router.put('/:sensorId', function (req, res) {

    var query = { sensorId: req.params.sensorId };
    var update = { name: req.body.name, alarmThreshold: req.body.alarmThreshold };

    Temp.findOneAndUpdate(query, update, function (err, temp) {
        if (err) {
            res.render('error', err);
            return;
        } else {
            res.send("OK");
        }
    });
});

router.get('/:sensorId', function (req, res) {
    var data = { value: sensor.get(req.params.sensorId) };
    res.send(data);
});

router.get('/records/:sensorId', function (req, res) {

    var query = {
        sensorId: req.params.sensorId,
        timestamp: { $gte: new Date(parseInt(req.query.from)) }
    };
    var fields = "timestamp value";

    TempRecord.find(query, fields, function (err, tempRecords) {
        if (err) {
            res.render('error', err);
            return;
        } else {
            var result = [];
            for (var r in tempRecords) {
                result.push(
                    [tempRecords[r].timestamp.getTime(), tempRecords[r].value]
                )
            }
            res.send(result);
        }
    });
});

module.exports = router;