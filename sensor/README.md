# CO2 sensor and fan control

## Directories
-  **fpga/**: source files needed for compiling the FPGA project supporting DE1-SoC, Sensirion SCD30, and NF-F12
-  **hps/**: software related files with embedded driver modules for Sensirion's SCD product line

## FPGA
SCD30: SCL-GPIO0[2] & SDA-GPIO[3]
NF-F12: PWM-GPIO0[12] & TACH-GPIO0[12]
5V power supply-GPIO0[10] & ground-GPIO[11]

## HPS

**Linux image**
- [Linux LXDE Desktop](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&No=836&PartNo=4)
- DE1_SoC.rbf
- MSEL for booting: 010100

**SCD30 driver**
- embedded-scd/embedded-common/: I2C bit-banging (software) configuration
- embedded-scd/scd30: codes to read CO2 measurements and send data to the cloud server
```./scd30_example_usage```
