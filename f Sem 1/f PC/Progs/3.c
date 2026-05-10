#include <stdio.h>
int main ( void )
{
char character = 'A'; 
char string[] = "This is a string"; 
const char *stringPtr = "This is also a string";
printf( "%c\n", character );
printf( "%s\n", "This is a string" );
printf( "%s\n", string );
printf( "%s\n", stringPtr);
return 0; 
}