# Camera support for people counting

## Directories
-  **fpga/**: source files needed for compiling the FPGA project supporting DE1-SoC and Terasic TRDB-D5M
-  **hps/**: software related files with camera kernel modules 
-  **algo/**: algorithms for people detecting and counting

## FPGA
**Verilog files**
- cpen391_computer_top.v
- cpen391_computer.v

**Externel IP Components** (ip/) from https://github.com/UviDTE-UviSpace/uvispace-camera-fpga
- SDRAM control: Since the camera input and the VGA output run with different clock rates, we need to connect to the external DRAM memory and use it as a buffer between the camera input and VGA output.
2 FIFOs of 16 bits each, so up to 32-bit pixels can be saved in memory. It is designed to read and write data simultaneously.
- VGA controller: Sends control bits to the VGA peripheral (default output resolution 640 x 480)
- SEG7_LUT_8: Shows the frame rate on the hexadecimal 8-segments peripherals

**QSYS design files**
- soc_system_rgb.qsys with imported IP modules
- avalon_camera (built-in)
- avalon_image_writer (ip/avalon_image_writer/)
- avalon_image_processing (ip/image_processing/)
- soc_sytstem_rgb.qip (IP core)

**Quartus project files**
- soc_system.qdf
- soc_system.qsf
- soc_system.sof

## HPS

**SD card image**
- [DE1-SoC-UP-Linux](https://people.ece.cornell.edu/land/courses/ece5760/DE1_SOC/DE1-SoC-UP-Linux/linux_sdcard_image.zip)

**Script file supporting quartus project**
- cpen391_computer.rbf

## Algorithms

**Python file**
- yolo.py

**Machine learning model**
- yolov3
- coco.names
- yolov3.weights

Source: using machine model from https://pjreddie.com/darknet/yolo/
