//AUTHOR: Francis Reuben R
// RVUN25CSE408 SEC B
#include <stdio.h>

// Function 1: Calculates the length of a string.
int stringLength(char str[]) {
    int length = 0;
    while (str[length] != '\0') {
        length++;
    }
    return length;
}

// Function 2: Counts substring matches (overlapping allowed).
int subStringMatching(char str1[], char str2[]) {
    int temp = 0;
    int flag = 0;
    int len1 = stringLength(str1);
    int len2 = stringLength(str2);

    for (int i = 0; i <= len1 - len2; i++) {
        flag = 1;

        for (int j = 0; str2[j] != '\0'; j++) {
            if (str1[i + j] != str2[j]) {
                flag = 0;
                break;
            }
        }
        
        if (flag == 1) {
            temp++;
        }
    }
    return temp;
}

// Function 3: Reverses the characters in a string in place.
void reverseString(char str[]) {
    int i, j;
    char temp;
    int len = stringLength(str);

    for (i = 0, j = len - 1; i < j; i++, j--) {
        // Swap str[i] and str[j]
        temp = str[i];
        str[i] = str[j];
        str[j] = temp;
    }
}

// Function 4: Copies one string (str1) to another (str2).
void stringCopy(char str1[], char str2[]) {
    int i;
    for (i = 0; str1[i] != '\0'; i++) {
        str2[i] = str1[i];
    }
    str2[i] = '\0'; // Null termination
}

// Function 5: Compares two strings lexicographically and prints the result.
void stringCompare(char str1[], char str2[]) {
    int i;

    // Loop until the end of either string or characters mismatch
    for (i = 0; str1[i] == str2[i] && str1[i] != '\0'; i++) {
        // Comparison logic is handled by the loop condition and final check
    }

    if (str1[i] < str2[i]) {
        printf("Result of comparison: '%s' is less than '%s'\n", str1, str2);
    }
    else if (str1[i] > str2[i]) {
        printf("Result of comparison: '%s' is less than '%s'\n", str2, str1);
    }
    else {
        printf("Result of comparison: '%s' is equals to '%s'\n", str1, str2);
    }
}

// Main function to test all string implementations.
int main() {
    char s1[100] = "Programming in C";
    char s2[100] = "Programming";
    char s3[100] = "C";
    char s4[100] = "";
    char dest_copy[100];
    char reverse_test[100] = "ReverseMe";

    // Test stringLength
    printf("1. stringLength\n");
    printf("Length of \"%s\": %d\n", s1, stringLength(s1));
    printf("Length of \"%s\": %d\n", s3, stringLength(s3));
    printf("Length of empty string: %d\n", stringLength(s4));
    printf("\n");

    // Test subStringMatching
    char main_str[] = "abababa";
    char sub_str[] = "aba";
    printf("2. subStringMatching\n");
    printf("String: \"%s\", Substring: \"%s\"\n", main_str, sub_str);
    printf("Number of matches: %d\n", subStringMatching(main_str, sub_str));
    printf("\n");

    // Test reverseString
    printf("3. reverseString\n");
    printf("Original string: \"%s\"\n", reverse_test);
    reverseString(reverse_test);
    printf("Reversed string: \"%s\"\n", reverse_test);
    printf("\n");

    // Test stringCopy
    printf("4. stringCopy\n");
    stringCopy(s1, dest_copy);
    printf("Source: \"%s\", Destination: \"%s\"\n", s1, dest_copy);
    printf("\n");

    // Test stringCompare
    printf("5. stringCompare\n");
    stringCompare(s2, s1);
    stringCompare(s1, s2);
    stringCompare(s2, s2);
    stringCompare(s3, s1);

    return 0;
}
