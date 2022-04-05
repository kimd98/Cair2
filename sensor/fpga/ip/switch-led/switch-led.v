module switch_led( 
    input clk,
    input reset,
    
    input [1:0] avs_s0_address,
    input avs_s0_read,
    input avs_s0_write,
    output reg [31:0] avs_s0_readdata,
    input [31:0] avs_s0_writedata,

    // output reg [31:0] avm_s1_writedata,
    // output reg avm_s1_write,
    // output [31:0] avm_s1_address,
    // input avm_s1_waitrequest
    output [9:0] data
);
    // assign avm_s1_address = 31'b0;
    reg [9:0] level;
    reg [9:0] count = 0;

    always @(*) begin
        if (avs_s0_read) begin
            avs_s0_readdata = avs_s0_writedata;
        end else begin
            avs_s0_readdata = 32'bx;
        end
    end

    always @(posedge clk) begin
        if (reset) begin
            level <= 10'd10;
        end else if (avs_s0_write) begin
            level <= avs_s0_writedata;
        end else begin
            level <= level;
        end
        count = (count == 10'd100)? 10'b0 : count + 1;
    end

    assign data = (count < level)? 10'b1111111111 : 10'b0;

endmodule