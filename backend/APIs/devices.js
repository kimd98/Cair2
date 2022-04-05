const express = require('express');
const {db_data, db_device} = require('../Database');

const router = express.Router();

router.get('/', (req, res) => {
    db_device.getDevices().then(devices => {
        res.send(devices);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
});

router.post('/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    db_device.addDevice(id).then(message => {
        res.send(message);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
});

router.get('/:id', (req, res) => {
    db_device.getDevices().then(devices => {
        let id = req.params.id;
        let device = devices.find(device => device._id === id);
        res.send(device);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
});

router.delete('/:id', (req, res) => {
    db_device.deleteDevice(req.params.id).then(message => {
        res.send(message);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
});

router.put('/', (req, res) => {

});

module.exports = router;
