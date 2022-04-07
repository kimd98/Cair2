# Cair2 - Ventilation monitoring for COVID-19 mitigation

## Project description
Cair2 is a CO2 level monitor device that allows the users to view the CO2 concentration around the device on a mobile app. The device will track the number of people in the room, monitor CO2 level, and automatically start on the HVAC (a fan) when CO2 levels are too high. By scanning a QR code on the device, users will be able to view the current CO2 levels and the number of people data in the past 24 hours from anywhere using a mobile app. The mobile application will send a push notification when the CO2 levels are too high in order to let the user know to open windows. Data will be stored in the cloud so that multiple users can monitor the same device simultaneously. Users will have the option to save recorded data, so they can view it later. 

*Team members: Christy Zhang, Emily Deutsch, Lena Kim, Victor Pei*

## Technologies
- Fan control (Noctua NF-F12 5V): QSYS hardware system design, PWM control
- CO2 sensor (Sensirion SCD30): I2C bit-banging using an embedded I2C driver
- DE1-SoC with camera support (TRDB-D5M): FPGA and HPS connection
- Real time object detection: people detection/counting using YOLO
- Cloud: MongoDB Atlas, AWS server using Node.js
- Mobile app: Android, React Native, QR code scanning
