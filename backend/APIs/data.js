const express = require('express');
const {db_data, db_device} = require('../Database');

const router = express.Router();

let co2 = 0;
let people = 0;

let devices = {
    "device1": {
        "time": 123,
        "co2": 0, 
        "people": 0
    },
    "device2": {
        "time": 456,
        "co2": 0, 
        "people": 0
    }
}

let add_data = function () {
    Object.keys(devices).forEach(device => {
        if (devices[device].co2 !== 0)
            db_data.addData(device, devices[device])
    })
}

setInterval(add_data, 6000);

router.get('/:id', (req, res) => {    
    let id = req.params.id;
    db_data.getData(id).then(data => {
        res.send(data);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
});

// TODO: think about how to support multiple devices
router.post('/:id/:type', (req, res) => {
    let id = req.params.id;
    let type = req.params.type;
    if(type === 'co2') {
        devices[id].co2 = req.body.co2;
        devices[id].time = Date.now();
        co2 = req.body.co2;
    } else if(type === 'people') {
        devices[id].people = req.body.people;
        devices[id].time = Date.now();
        people = req.body.people;
    }

    res.send("OK");     
});

router.get('/:id/new', (req, res) => {
    let id = req.params.id;
    res.send(devices[id]);
});


module.exports = router;
