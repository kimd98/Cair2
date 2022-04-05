`define ENABLE_HPS

module cpen391_computer_top(
  inout              ADC_CS_N,
  output             ADC_DIN,
  input              ADC_DOUT,
  output             ADC_SCLK,
  input              AUD_ADCDAT,
  inout              AUD_ADCLRCK,
  inout              AUD_BCLK,
  output             AUD_DACDAT,
  inout              AUD_DACLRCK,
  output             AUD_XCK,
  input              CLOCK2_50,
  input              CLOCK3_50,
  input              CLOCK4_50,
  input              CLOCK_50,
  output      [12:0] DRAM_ADDR,   //Address Bus
  output      [1:0]  DRAM_BA,     //Bank address
  output             DRAM_CAS_N,  //Column address strobe
  output             DRAM_CKE,    //Clock enable
  output             DRAM_CLK,    //Clock
  output             DRAM_CS_N,   //Chip select
  inout       [15:0] DRAM_DQ,     //Data Bus
  output             DRAM_LDQM,   //Low-byte data mask
  output             DRAM_RAS_N,  //Row adress strobe
  output             DRAM_UDQM,   //High-byte data mask
  output             DRAM_WE_N,   //Write enable
  output             FAN_CTRL,
  output             FPGA_I2C_SCLK,
  inout              FPGA_I2C_SDAT,
  inout       [35:0] GPIO_0,
  inout       [35:0] GPIO_1,
  output      [6:0]  HEX0,
  output      [6:0]  HEX1,
  output      [6:0]  HEX2,
  output      [6:0]  HEX3,
  output      [6:0]  HEX4,
  output      [6:0]  HEX5,
  ///////// HPS /////////
  `ifdef ENABLE_HPS
    inout              HPS_CONV_USB_N,
    output      [14:0] HPS_DDR3_ADDR,
    output      [2:0]  HPS_DDR3_BA,
    output             HPS_DDR3_CAS_N,
    output             HPS_DDR3_CKE,
    output             HPS_DDR3_CK_N,
    output             HPS_DDR3_CK_P,
    output             HPS_DDR3_CS_N,
    output      [3:0]  HPS_DDR3_DM,
    inout       [31:0] HPS_DDR3_DQ,
    inout       [3:0]  HPS_DDR3_DQS_N,
    inout       [3:0]  HPS_DDR3_DQS_P,
    output             HPS_DDR3_ODT,
    output             HPS_DDR3_RAS_N,
    output             HPS_DDR3_RESET_N,
    input              HPS_DDR3_RZQ,
    output             HPS_DDR3_WE_N,
    output             HPS_ENET_GTX_CLK,
    inout              HPS_ENET_INT_N,
    output             HPS_ENET_MDC,
    inout              HPS_ENET_MDIO,
    input              HPS_ENET_RX_CLK,
    input       [3:0]  HPS_ENET_RX_DATA,
    input              HPS_ENET_RX_DV,
    output      [3:0]  HPS_ENET_TX_DATA,
    output             HPS_ENET_TX_EN,
    inout              HPS_GSENSOR_INT,
    inout              HPS_I2C1_SCLK,
    inout              HPS_I2C1_SDAT,
    inout              HPS_I2C_CONTROL,
    inout              HPS_KEY,
    inout              HPS_LED,
    inout              HPS_LTC_GPIO,
    output             HPS_SD_CLK,
    inout              HPS_SD_CMD,
    inout       [3:0]  HPS_SD_DATA,
    input              HPS_UART_RX,
    output             HPS_UART_TX,
    input              HPS_USB_CLKOUT,
    inout       [7:0]  HPS_USB_DATA,
    input              HPS_USB_DIR,
    input              HPS_USB_NXT,
    output             HPS_USB_STP,
  `endif /*ENABLE_HPS*/
  input              IRDA_RXD,
  output             IRDA_TXD,
  input       [3:0]  KEY,
  output      [9:0]  LEDR,
  inout              PS2_CLK,
  inout              PS2_CLK2,
  inout              PS2_DAT,
  inout              PS2_DAT2,
  input       [9:0]  SW,
  input              TD_CLK27,
  input       [7:0]  TD_DATA,
  input              TD_HS,
  output             TD_RESET_N,
  input              TD_VS,
  output      [7:0]  VGA_B,
  output             VGA_BLANK_N,
  output             VGA_CLK,
  output      [7:0]  VGA_G,
  output             VGA_HS,
  output      [7:0]  VGA_R,
  output             VGA_SYNC_N,
  output             VGA_VS
  );

//============================================================================
//  REG/WIRE declarations
//============================================================================
  wire          sync_rgb_dval;
  wire  [11:0]  sync_rgb_red;
  wire  [11:0]  sync_rgb_green;
  wire  [11:0]  sync_rgb_blue;
  wire  [7:0]   gray;
  wire          gray_valid;
  wire          bin_valid;
  wire  [7:0]   binarized_8bit;
  wire          erosion_valid;
  wire  [7:0]   eroded_8bit;
  wire          dilation_valid;
  wire  [7:0]   dilated_8bit;
  wire          video_stream_reset_n;
  wire          hps2fpga_reset_n;
  wire          clk_25;
  wire          ccd_pixel_clk;
  wire  [31:0]  rate;

cpen391_computer u0 (

  .CLOCK_50(CLOCK_50),
  .HPS_CONV_USB_N             (HPS_CONV_USB_N),
  .HPS_DDR3_ADDR              (HPS_DDR3_ADDR),
  .HPS_DDR3_BA                (HPS_DDR3_BA),
  .HPS_DDR3_CAS_N             (HPS_DDR3_CAS_N),
  .HPS_DDR3_CKE               (HPS_DDR3_CKE),
  .HPS_DDR3_CK_N              (HPS_DDR3_CK_N),
  .HPS_DDR3_CK_P              (HPS_DDR3_CK_P),
  .HPS_DDR3_CS_N              (HPS_DDR3_CS_N),
  .HPS_DDR3_DM                (HPS_DDR3_DM),
  .HPS_DDR3_DQ                (HPS_DDR3_DQ),
  .HPS_DDR3_DQS_N             (HPS_DDR3_DQS_N),
  .HPS_DDR3_DQS_P             (HPS_DDR3_DQS_P),
  .HPS_DDR3_ODT               (HPS_DDR3_ODT),
  .HPS_DDR3_RAS_N             (HPS_DDR3_RAS_N),
  .HPS_DDR3_RESET_N           (HPS_DDR3_RESET_N),
  .HPS_DDR3_RZQ               (HPS_DDR3_RZQ),
  .HPS_DDR3_WE_N              (HPS_DDR3_WE_N),
  .HPS_ENET_GTX_CLK           (HPS_ENET_GTX_CLK),
  .HPS_ENET_INT_N             (HPS_ENET_INT_N),
  .HPS_ENET_MDC               (HPS_ENET_MDC),
  .HPS_ENET_MDIO              (HPS_ENET_MDIO),
  .HPS_ENET_RX_CLK            (HPS_ENET_RX_CLK),
  .HPS_ENET_RX_DATA           (HPS_ENET_RX_DATA),
  .HPS_ENET_RX_DV             (HPS_ENET_RX_DV),
  .HPS_ENET_TX_DATA           (HPS_ENET_TX_DATA),
  .HPS_ENET_TX_EN             (HPS_ENET_TX_EN),
  .HPS_GSENSOR_INT            (HPS_GSENSOR_INT),
  .HPS_I2C1_SCLK              (HPS_I2C1_SCLK),
  .HPS_I2C1_SDAT              (HPS_I2C1_SDAT),
  .HPS_I2C_CONTROL            (HPS_I2C_CONTROL),
  .HPS_KEY                    (HPS_KEY),
  .HPS_LED                    (HPS_LED),
  .HPS_LTC_GPIO               (HPS_LTC_GPIO),
  .HPS_SD_CLK                 (HPS_SD_CLK),
  .HPS_SD_CMD                 (HPS_SD_CMD),
  .HPS_SD_DATA                (HPS_SD_DATA),
  .HPS_UART_RX                (HPS_UART_RX),
  .HPS_UART_TX                (HPS_UART_TX),
  .HPS_USB_CLKOUT             (HPS_USB_CLKOUT),
  .HPS_USB_DATA               (HPS_USB_DATA),
  .HPS_USB_DIR                (HPS_USB_DIR),
  .HPS_USB_NXT                (HPS_USB_NXT),
  .HPS_USB_STP                (HPS_USB_STP),
  .CAM_CONNECTOR              (GPIO_1),

  //RGB image from the synchronyzer
  .export_sync_rgb_red         ( sync_rgb_red ),
  .export_sync_rgb_green       ( sync_rgb_green ),
  .export_sync_rgb_blue        ( sync_rgb_blue ),
  .export_sync_rgb_dval        ( sync_rgb_dval ),
  //Gray image
  .export_gray                 ( gray ),
  .export_gray_valid           ( gray_valid ),
  //clock and resets for the VGA
  .export_ccd_pixel_clk        ( ccd_pixel_clk ),
  .export_clk_25               ( clk_25 ),
  .export_hps2fpga_reset_n     ( hps2fpga_reset_n ),
  .export_video_stream_reset_n ( video_stream_reset_n ),
  .export_rate                 ( rate ),
  .pulse_led                   ( LEDR[0] ),
  .reset_stream_key            ( KEY[0] ),
  .camera_capture_en           ( !SW[9] )
  );

  always @(posedge ccd_pixel_clk) begin
    if (!hps2fpga_reset_n & video_stream_reset_n) begin
      // if reset, do nothing.
    end
	 begin
		 fifo1_writedata <= {1'b0, sync_rgb_red[11:7], sync_rgb_green[11:7],
                            sync_rgb_blue[11:7]};
       fifo_write_enable <= sync_rgb_dval;
		 rgb_in_vga <= 1'b1;
    end
  end

// Dual clock SDRAM controller
Sdram_Control u1(
  // HOST Side
  .REF_CLK(CLOCK_50),
  .RESET_N(1'b1),
  // FIFO Write Side 1
  .WR1_DATA(fifo1_writedata),         //data bus size: 16 bits
  .WR1(fifo_write_enable),
  .WR1_ADDR(0),
  .WR1_MAX_ADDR(640*480),             //address bus size: 25 bits
  .WR1_LENGTH(9'h80),                 //Max allowed size: 8 bits
  .WR1_LOAD(!(hps2fpga_reset_n & video_stream_reset_n)),
  .WR1_CLK(~ccd_pixel_clk),
  // FIFO Write Side 2 (Unused. Needed if 8 bits per pixel are used)
  .WR2_DATA(fifo1_writedata),         //data bus size: 16 bits
  .WR2(fifo_write_enable),
  .WR2_ADDR(22'h100000),
  .WR2_MAX_ADDR(22'h100000+640*480),  //address bus size: 25 bits
  .WR2_LENGTH(9'h80),                 //Max allowed size: 8 bits
  .WR2_LOAD(!(hps2fpga_reset_n & video_stream_reset_n)),
  .WR2_CLK(~ccd_pixel_clk),
  // FIFO Read Side 1
  .RD1_DATA(fifo1_readdata),          //data bus size: 16 bits
  .RD1(vga_enable),                   //Read enable
  .RD1_ADDR(0),
  .RD1_MAX_ADDR(640*480),             //address bus size: 25 bits
  .RD1_LENGTH(9'h80),                 //Max allowed size: 8 bits
  .RD1_LOAD(!(hps2fpga_reset_n & video_stream_reset_n)),
  .RD1_CLK(~clk_25),
  // FIFO Read Side 2 (Unused. Needed if 8 bits per pixel are used)
  .RD2_DATA(fifo2_readdata),          //data bus size: 16 bits
  .RD2(vga_enable),                   //Read enable
  .RD2_ADDR(22'h100000),
  .RD2_MAX_ADDR(22'h100000+640*480),  //address bus size: 25 bits
  .RD2_LENGTH(9'h80),                 //Max allowed size: 8 bits
  .RD2_LOAD(!(hps2fpga_reset_n & video_stream_reset_n)),
  .RD2_CLK(~clk_25),
  // SDRAM Side
  .SA(DRAM_ADDR),
  .BA(DRAM_BA),
  .CS_N(DRAM_CS_N),
  .CKE(DRAM_CKE),
  .RAS_N(DRAM_RAS_N),
  .CAS_N(DRAM_CAS_N),
  .WE_N(DRAM_WE_N),
  .DQ(DRAM_DQ),
  .DQM({DRAM_UDQM,DRAM_LDQM}),
  .SDR_CLK(DRAM_CLK)
  );
  reg    fifo_write_enable;
  //SDRAM FIFOs data
  reg     [15:0] fifo1_writedata;
  reg     [15:0] fifo2_writedata;
  wire    [15:0] fifo1_readdata;
  wire    [15:0] fifo2_readdata;

// VGA controller component.
vga_controller vga_component(
  .pixel_clk  ( clk_25 ),
  .reset_n    ( hps2fpga_reset_n & video_stream_reset_n ),
  .h_sync     ( VGA_HS ),
  .v_sync     ( VGA_VS ),
  .disp_ena   ( vga_enable ),
  .column     (),
  .row        (),
  .n_blank    ( VGA_BLANK_N ),
  .n_sync     ( VGA_SYNC_N ),
  .data_req   ( vga_request )
  );
  //VGA signals
  wire    vga_enable;
  reg 	 rgb_in_vga;

  // Send the data on the FIFO memory to the VGA outputs.
  assign VGA_R = (!vga_enable) ? 0 :
                 (!rgb_in_vga) ? fifo1_readdata[7:0] :
                 (SW[0])       ? {fifo1_readdata[14:10], 3'd0} :
                 0;
  assign VGA_G = (!vga_enable) ? 0 :
                 (!rgb_in_vga) ? fifo1_readdata[7:0] :
                 (SW[1])       ? {fifo1_readdata[9:5], 3'd0} :
                 0;
  assign VGA_B = (!vga_enable) ? 0 :
                 (!rgb_in_vga) ? fifo1_readdata[7:0] :
                 (SW[2])       ? {fifo1_readdata[4:0], 3'd0} :
                 0;
  // Set the VGA clock to 25 MHz.
  assign  VGA_CLK = clk_25;

SEG7_LUT_8 u5(
  .oSEG0        (HEX0),
  .oSEG1        (HEX1),
  .oSEG2        (HEX2),
  .oSEG3        (HEX3),
  .oSEG4        (HEX4),
  .oSEG5        (HEX5),
  .oSEG6        (),
  .oSEG7        (),
  .iDIG         (rate)
  );

endmodule