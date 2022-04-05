#include "scd30.h"
#include <unistd.h>
#include <time.h>
#include <stdio.h>
#include <stdlib.h>
#include <curl/curl.h>
#include <fcntl.h>
#include <sys/mman.h>
#include "../address_map_arm.h"

#define POST_INTERVAL 0

void write_file(float co2_ppm);
int read_co2();
int read_people();
void post_data(int co2, int num_people);
// int open_physical (int);
// void * map_physical (int, unsigned int, unsigned int);
// void close_physical (int);
// int unmap_physical (void *, unsigned int);
// void bin (unsigned n);

void change_speed(int speed);

int main(void) {
    float co2_ppm, temperature, relative_humidity;
    int16_t err;
    uint16_t interval_in_seconds = 2;
    int post_time_counter = 0;

    sensirion_i2c_init();
    while (scd30_probe() != NO_ERROR) {
        printf("SCD30 sensor probing failed\n");
        sensirion_sleep_usec(1000000u);
    }

    scd30_set_measurement_interval(interval_in_seconds);
    sensirion_sleep_usec(20000u);
    scd30_start_periodic_measurement(0);

    while (1) {
        uint16_t data_ready = 0;
        uint16_t timeout = 0;

        /* Poll data_ready flag until data is available. Allow 20% more than
         * the measurement interval to account for clock imprecision of the
         * sensor.
         */
        for (timeout = 0; (100000 * timeout) < (interval_in_seconds * 1200000);
             ++timeout) {
            err = scd30_get_data_ready(&data_ready);
            if (err != NO_ERROR) {
                printf("Error reading data_ready flag: %i\n", err);
            }
            if (data_ready) {
                break;
            }
            sensirion_sleep_usec(100000);
        }
        if (!data_ready) {
            printf("Timeout waiting for data_ready flag\n");
            continue;
        }

        /* Measure co2, temperature and relative humidity and store into
         * variables.
         */
        err =
            scd30_read_measurement(&co2_ppm, &temperature, &relative_humidity);
        printf("CO2 measured.\n");
        if (err != NO_ERROR) {
            printf("error reading measurement\n");

        } else {
            write_file(co2_ppm);
            printf("CO2 data written to \"co2_ppm.txt\"");
        }

        int co2 = read_co2();
        change_speed(co2 / 50);
        printf("CO2 = %d\n", co2);
        post_data(co2, read_people());

        sleep(POST_INTERVAL);

    }

    scd30_stop_periodic_measurement();
    return 0;
}

void write_file(float co2_ppm){
    FILE *fptr;
    fptr = fopen("co2_ppm.txt", "w+");

    if(fptr == NULL){
        printf("Error opening the file.\n");
        return;
    }

    fprintf(fptr, "%d", (int)co2_ppm/1);
    fclose(fptr);
}

int read_co2() {
    FILE * data;
    char buffer[30];

    data = fopen("co2_ppm.txt", "r");

    if (NULL == data)
    {
         perror("opening database");
         return (-1);
    }

    while (EOF != fscanf(data, "%[^\n]\n", buffer))
    {
        //  printf("> %s\n", buffer);
        continue;
    }

    // int result = atoi(buffer);

    fclose(data);
    int result = atoi(buffer);

    return result;
}

void post_data(int co2, int num_people) {
    CURL *curl;
    CURLcode response;

    curl_global_init(CURL_GLOBAL_ALL);

    curl = curl_easy_init();

    if(curl) {
        // Create header
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Accept: application/json");
        headers = curl_slist_append(headers, "Content-Type: application/json");
        headers = curl_slist_append(headers, "charset: utf-8");

        // Create content
        int length = snprintf(NULL, 0, "{\"co2\": %d,\"people\": %d}", co2, num_people);
        char* content = malloc(length + 1);
        snprintf(content, length + 1,  "{\"co2\": %d,\"people\": %d}", co2, num_people);

        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_URL, "http://cpen391server-env.eba-pefitrhy.us-west-1.elasticbeanstalk.com/data/test_device");
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, content);

        response = curl_easy_perform(curl);

        if (response != CURLE_OK) {
            fprintf(stderr, "Request failed: %s\n", curl_easy_strerror(response));
        }

        free(content);
        curl_easy_cleanup(curl);
    }

    curl_global_cleanup();
}

int read_people() {
    return rand() % 50;
}

// // Open /dev/mem, if not already done, to give access to physical addresses
// int open_physical (int fd)
// {
//    if (fd == -1)
//       if ((fd = open( "/dev/mem", (O_RDWR | O_SYNC))) == -1)
//       {
//          printf ("ERROR: could not open \"/dev/mem\"...\n");
//          return (-1);
//       }
//    return fd;
// }

// // Close /dev/mem to give access to physical addresses
// void close_physical (int fd)
// {
//    close (fd);
// }

// /*
//  * Establish a virtual address mapping for the physical addresses starting at base, and
//  * extending by span bytes.
//  */
// void* map_physical(int fd, unsigned int base, unsigned int span)
// {
//    void *virtual_base;

//    // Get a mapping from physical addresses to virtual addresses
//    virtual_base = mmap (NULL, span, (PROT_READ | PROT_WRITE), MAP_SHARED, fd, base);
//    if (virtual_base == MAP_FAILED)
//    {
//       printf ("ERROR: mmap() failed...\n");
//       close (fd);
//       return (NULL);
//    }
//    return virtual_base;
// }

// /*
//  * Close the previously-opened virtual address mapping
//  */
// int unmap_physical(void * virtual_base, unsigned int span)
// {
//    if (munmap (virtual_base, span) != 0)
//    {
//       printf ("ERROR: munmap() failed...\n");
//       return (-1);
//    }
//    return 0;
// }

// // Print a binary number
// void bin(unsigned n){
//     unsigned i;
//     for (i = 1 << 31; i > 0; i = i / 2)
//         (n & i) ? printf("1") : printf("0");
// }

void change_speed(int speed) {
    volatile unsigned int * GPIO_ptr;
    int fd = -1; // used to open /dev/mem
    void *LW_virtual; // physical addresses for light-weight bridge

    // Create virtual memory access to the FPGA light-weight bridge
    if ((fd = open_physical (fd)) == -1)
        return (-1);
    if (!(LW_virtual = map_physical (fd, LW_BRIDGE_BASE, LW_BRIDGE_SPAN)))
        return (-1);

    // Set virtual address pointer to I/O port
    GPIO_ptr = (unsigned int *) (LW_virtual + JP1_BASE);

    if (speed > 200)
        speed = 200;
    
    * (GPIO_ptr + 8) = speed;

    unmap_physical (LW_virtual, LW_BRIDGE_SPAN);
    close_physical (fd);
}
