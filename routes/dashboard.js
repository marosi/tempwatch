var express = require('express');
var router = express.Router();
var sensor = require('ds18x20');
var mongoose = require('mongoose');
var Temp = mongoose.model('Temp');

/* GET temperature. */
router.get('/', function(req, res) {

    if (!sensor.isDriverLoaded()) {
        sensor.loadDriver(function (err) {
            if (err) {
                console.log('something went wrong loading the driver:', err);
            } else {
                console.log('driver is loaded');
            }
        });
    }
    var availableTemps = sensor.getAll();

    // data for template rendering
    var data = { temp: [] };

    Temp.find({}, function (err, temps) {

        // remove all (for debugging)
        //Temp.remove(function (err) {
        //    console.error(err);
        //});

        // synchronize installed sensors with persisted data
        for (var key in availableTemps) {
            if (availableTemps.hasOwnProperty(key)) {

                // find corresponding record for sensor
                var persistedTemp = null;
                for (var i in temps) {
                    if (temps[i].sensorId == key) {
                        persistedTemp = temps[i];
                        break;
                    }
                }

                // create new record if none present
                if (persistedTemp == null) {
                    persistedTemp = new Temp({
                        sensorId: key
                    });
                    persistedTemp.save(function (err) {
                       console.error(err);
                    });
                }

                // prepare rendering object
                var tempObj = {
                    sensorId: key,
                    value: availableTemps[key],
                    name: persistedTemp.name,
                    alarmThreshold: persistedTemp.alarmThreshold
                };

                data.temp.push(tempObj);
            }
        }

        res.render('dashboard', data);
    });
});

module.exports = router;