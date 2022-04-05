/*
 * Copyright (c) 2018, Sensirion AG
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of Sensirion AG nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <time.h>
#include <sys/mman.h>
#include "sensirion_arch_config.h"
#include "sensirion_sw_i2c_gpio.h"
#include "../../tutorial_files/address_map_arm.h"

#define SCL_BIT 2
#define SDA_BIT 3
#define SCL_MASK 0x4
#define SDA_MASK 0x8

int open_physical (int);
void * map_physical (int, unsigned int, unsigned int);
void close_physical (int);
int unmap_physical (void *, unsigned int);

/*
 * INSTRUCTIONS
 * ============
 *
 * Implement all functions where they are marked as IMPLEMENT.
 * Follow the function specification in the comments.
 *
 * We use the following names for the two I2C signal lines:
 * SCL for the clock line
 * SDA for the data line
 *
 * Both lines must be equipped with pull-up resistors appropriate to the bus
 * frequency.
 */

volatile unsigned int *SCD30_data_ptr; // virtual address pointer to SCD30 GPIO pins
volatile unsigned int *SCD30_dir_ptr;
int fd = -1; // used to open /dev/mem for access to physical address
void *LW_virtual; // used to map physical address

/**
 * Initialize all hard- and software components that are needed to set the
 * SDA and SCL pins.
*/
void sensirion_init_pins(void) {
    //printf("Initiating SCD 30 pins...\n");

    // create virtual mem access to FPGA lw bridge
    if((fd = open_physical(fd)) == -1){
        printf("ERROR: Cannot access to physical address for SCD30!\n");
        return;
    }
    if ((LW_virtual = map_physical(fd, LW_BRIDGE_BASE, LW_BRIDGE_SPAN)) == NULL){
        printf("ERROR: Cannot establish a virtual address mapping!\n");
        return;
    }

    // set virtual address pointer
    SCD30_data_ptr = (int unsigned *) (LW_virtual + JP1_BASE);
    SCD30_dir_ptr = (int unsigned *) (LW_virtual + JP1_BASE + 4);
    sensirion_SDA_in();
    sensirion_SCL_in();
    //printf("SCD30 pins have been successfully initialized!\n");
}

/**
 * Release all resources initialized by sensirion_init_pins()
 */
void sensirion_release_pins(void) {
    unmap_physical(LW_virtual, LW_BRIDGE_SPAN);
    close_physical(fd);
    //printf("SCD30 pins released.\n");
}

/**
 * Configure the SDA pin as an input. With an external pull-up resistor the line
 * should be left floating, without external pull-up resistor, the input must be
 * configured to use the internal pull-up resistor.
 */
void sensirion_SDA_in(void) {
    //printf("SDA set as input.\n");
    *SCD30_dir_ptr &= ~(1 << SDA_BIT); // direction 0 (in)
}

/**
 * Configure the SDA pin as an output and drive it low or set to logical false.
 */
void sensirion_SDA_out(void) {
    //printf("SDA set as output low.\n");
    *SCD30_dir_ptr |= (1 << SDA_BIT); // direction 1 (out)
    *SCD30_data_ptr &= ~(1 << SDA_BIT); // output 0
}

/**
 * Read the value of the SDA pin.
 * @returns 0 if the pin is low and 1 otherwise.
 */
uint8_t sensirion_SDA_read(void) {
    // SDA pin connected to GPIO_0[6] = JP1_3
    *SCD30_dir_ptr &= ~(1 << SDA_BIT); // direction 0 (in)
    uint8_t sda = (*SCD30_data_ptr & SDA_MASK) >> SDA_BIT;
    //printf("Reading SDA: %d\n", (int)sda);
    return sda;
}

/**
 * Configure the SCL pin as an input. With an external pull-up resistor the line
 * should be left floating, without external pull-up resistor, the input must be
 * configured to use the internal pull-up resistor.
 */
void sensirion_SCL_in(void) {
    //printf("SCL set as input.\n");
    *SCD30_dir_ptr &= ~(1 << SCL_BIT); // clearing a bit
}

/**
 * Configure the SCL pin as an output and drive it low or set to logical false.
 */
void sensirion_SCL_out(void) {
    //printf("SCL set as output low.\n");
    *SCD30_dir_ptr |= (1 << SCL_BIT); // direction 1 (out)
    *SCD30_data_ptr &= ~(1 << SCL_BIT); // output 0
}

/**
 * Read the value of the SCL pin.
 * @returns 0 if the pin is low and 1 otherwise.
 */
uint8_t sensirion_SCL_read(void) {
    // SCL pin connected to GPIO_0[5] = JP1_2
    *SCD30_dir_ptr &= ~(1 << SCL_BIT); // direction 1 (input)
    uint8_t scl = (*SCD30_data_ptr & SCL_MASK) >> SCL_BIT;
    //printf("Reading SCL: %d\n", (int)scl);
    return scl;
}

/**
 * Sleep for a given number of microseconds. The function should delay the
 * execution approximately, but no less than, the given time.
 *
 * The precision needed depends on the desired i2c frequency, i.e. should be
 * exact to about half a clock cycle (defined in
 * `SENSIRION_I2C_CLOCK_PERIOD_USEC` in `sensirion_arch_config.h`).
 *
 * Example with 400kHz requires a precision of 1 / (2 * 400kHz) == 1.25usec.
 *
 * @param useconds the sleep time in microseconds
 */
void sensirion_sleep_usec(uint32_t useconds) {
    usleep(useconds);
}

// Open /dev/mem, if not already done, to give access to physical addresses
int open_physical (int fd){
   if (fd == -1)
      if ((fd = open( "/dev/mem", (O_RDWR | O_SYNC))) == -1)
      {
         printf ("ERROR: could not open \"/dev/mem\"...\n");
         return (-1);
      }
   return fd;
}

// Close /dev/mem to give access to physical addresses
void close_physical (int fd){
   close (fd);
}

// Establish a virtual address mapping for the physical addresses starting at base, and extending by span bytes.
void* map_physical(int fd, unsigned int base, unsigned int span){
   void *virtual_base;

   // Get a mapping from physical addresses to virtual addresses
   virtual_base = mmap (NULL, span, (PROT_READ | PROT_WRITE), MAP_SHARED, fd, base);
   if (virtual_base == MAP_FAILED)
   {
      printf ("ERROR: mmap() failed...\n");
      close (fd);
      return (NULL);
   }
   return virtual_base;
}

// Close the previously-opened virtual address mapping
int unmap_physical(void * virtual_base, unsigned int span){
   if (munmap (virtual_base, span) != 0)
   {
      printf ("ERROR: munmap() failed...\n");
      return (-1);
   }
   return 0;
}
