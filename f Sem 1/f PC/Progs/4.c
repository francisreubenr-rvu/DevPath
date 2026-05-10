#include <stdio.h>
int main ( void ){
int *ptr;

int x = 12345; 
int y;

ptr = &x;

printf( "The value of ptr is %p\n", ptr );
printf( "The address of x is %p\n\n", &x );
printf( "Total characters printed on this line:%n", &y );
printf( " %d\n\n", y );
y = printf( "This line has 28 characters)\n%n" );
printf( "%d characters were printed\n\n", y );
printf( "printing a %% in a format control string\n" );
}