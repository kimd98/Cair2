const express = require('express');
const {db_data, db_device} = require('./Database');
const deviceRoute = require('./APIs/devices');
const dataRoute = require('./APIs/data');

const PORT = process.env.PORT || 8000;

const app = express();

let image;

console.log(db_data);

let deleteOldData = () => {    
    // Delete data from 24 hours ago (24h = 86400000ms)
    // db.deleteOldData(Date.now().valueOf() - 86400000)
    // Test delete: 10min
    db_device.getDevices().then(devices => {
        devices.forEach(device => {
            db_data.deleteOldData(device.name, Date.now().valueOf() - 43200000)
                .then(message => console.log(message))
                .catch(err => console.log(err));
        })
    });
    
}
// Test delete interval: 1 min
setInterval(deleteOldData, 60000);

// app.use(express.json());
app.use(express.json({limit:'50mb'}))
app.use('/devices', deviceRoute);
app.use('/data', dataRoute);

app.get('/', (req, res) => {
    res.send("Please add /devices or /data after URL for testing.\n This is the dummy main page doing nothing.");    
});

app.post('/image', (req, res) => {
    image = req.body;
    res.send("Hi");
});

app.get('/image', (req, res) => {
    res.send(image);
});

app.listen(PORT, () => {
    console.log("Application starts.");
});
