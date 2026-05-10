#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    FILE *fp;
    char ch, str[100], fname[50];
    int choice, n, offset, i;
    int arr[100], data[100];
    long pos;
    
    printf("Enter filename: ");
    scanf("%s", fname);
    
    while(1) {
        printf("\nFILE OPERATIONS MENU\n");
        printf("1. Write (w)\n2. Read (r)\n3. Append (a)\n");
        printf("4. Read/Write (r+)\n5. Write/Read (w+)\n6. Append/Read (a+)\n");
        printf("7. Binary Write\n8. Binary Read\n9. fseek\n10. rewind\n11. Exit\n");
        printf("Choice: ");
        scanf("%d", &choice);
        getchar();
        
        switch(choice) {
            case 1:
                fp = fopen(fname, "w");
                if(fp == NULL) {
                    printf("Error opening file\n");
                    break;
                }
                printf("Enter text: ");
                fgets(str, 100, stdin);
                fprintf(fp, "%s", str);
                fclose(fp);
                printf("Written successfully\n");
                break;
                
            case 2:
                fp = fopen(fname, "r");
                if(fp == NULL) {
                    printf("File not found\n");
                    break;
                }
                printf("Content:\n");
                while((ch = fgetc(fp)) != EOF) {
                    putchar(ch);
                }
                fclose(fp);
                break;
                
            case 3:
                fp = fopen(fname, "a");
                if(fp == NULL) {
                    printf("Error opening file\n");
                    break;
                }
                printf("Enter text: ");
                fgets(str, 100, stdin);
                fprintf(fp, "%s", str);
                fclose(fp);
                printf("Appended successfully\n");
                break;
                
            case 4:
                fp = fopen(fname, "r+");
                if(fp == NULL) {
                    printf("File not found\n");
                    break;
                }
                printf("Reading:\n");
                while((ch = fgetc(fp)) != EOF) {
                    putchar(ch);
                }
                printf("\nEnter text to write: ");
                fgets(str, 100, stdin);
                fprintf(fp, "%s", str);
                fclose(fp);
                printf("Read and written\n");
                break;
                
            case 5:
                fp = fopen(fname, "w+");
                if(fp == NULL) {
                    printf("Error opening file\n");
                    break;
                }
                printf("Enter text: ");
                fgets(str, 100, stdin);
                fprintf(fp, "%s", str);
                rewind(fp);
                printf("Reading back:\n");
                while((ch = fgetc(fp)) != EOF) {
                    putchar(ch);
                }
                fclose(fp);
                break;
                
            case 6:
                fp = fopen(fname, "a+");
                if(fp == NULL) {
                    printf("Error opening file\n");
                    break;
                }
                printf("Enter text: ");
                fgets(str, 100, stdin);
                fprintf(fp, "%s", str);
                rewind(fp);
                printf("Full content:\n");
                while((ch = fgetc(fp)) != EOF) {
                    putchar(ch);
                }
                fclose(fp);
                break;
                
            case 7:
                fp = fopen(fname, "wb");
                if(fp == NULL) {
                    printf("Error opening file\n");
                    break;
                }
                printf("Enter number of integers: ");
                scanf("%d", &n);
                printf("Enter integers: ");
                for(i = 0; i < n; i++) {
                    scanf("%d", &arr[i]);
                }
                fwrite(arr, sizeof(int), n, fp);
                fclose(fp);
                printf("Binary write done\n");
                break;
                
            case 8:
                fp = fopen(fname, "rb");
                if(fp == NULL) {
                    printf("File not found\n");
                    break;
                }
                printf("Enter count: ");
                scanf("%d", &n);
                fread(data, sizeof(int), n, fp);
                printf("Data read: ");
                for(i = 0; i < n; i++) {
                    printf("%d ", data[i]);
                }
                printf("\n");
                fclose(fp);
                break;
                
            case 9:
                fp = fopen(fname, "r");
                if(fp == NULL) {
                    printf("File not found\n");
                    break;
                }
                printf("Enter offset: ");
                scanf("%d", &offset);
                fseek(fp, offset, SEEK_SET);
                printf("Content from position:\n");
                while((ch = fgetc(fp)) != EOF) {
                    putchar(ch);
                }
                fclose(fp);
                break;
                
            case 10:
                fp = fopen(fname, "r");
                if(fp == NULL) {
                    printf("File not found\n");
                    break;
                }
                fseek(fp, 10, SEEK_SET);
                printf("After seeking to 10\n");
                rewind(fp);
                printf("After rewind:\n");
                while((ch = fgetc(fp)) != EOF) {
                    putchar(ch);
                }
                fclose(fp);
                break;
                
            case 11:
                exit(0);
                
            default:
                printf("Invalid choice\n");
        }
    }
    
    return 0;
}
