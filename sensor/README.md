# CO2 sensor and fan control

## Directories
-  **fpga/**: source files needed for compiling the FPGA project supporting DE1-SoC, Sensirion SCD30, and NF-F12
-  **hps/**: software related files with embedded driver modules for Sensirion's SCD product line

## FPGA
**Pin connection**
  - SCD30: SCL-GPIO0[2] & SDA-GPIO[3]
  - NF-F12: PWM-GPIO0[12] & TACH-GPIO0[12]
  - 5V power supply-GPIO0[10] & Ground-GPIO0[11]

**Quartus project files**

## HPS

**Linux image**
- [Linux LXDE Desktop](https://www.terasic.com.tw/cgi-bin/page/archive.pl?Language=English&No=836&PartNo=4)
- DE1_SoC.rbf
- MSEL for booting: 010100

**SCD30 driver**
- embedded-common/: I2C bit-banging (software) configuration using GPIO pins
- scd30/: read CO2 measurements and send data to the cloud server using the command ```./sensor``` (create an executable file using ```make all```)
