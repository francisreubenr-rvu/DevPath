#include <stdio.h>
int main( void ){
printf( "%10s%10d%10c%10F\n\n", "hello", 7, 'a', 1.23 );
printf( "%-105%-10d%-10c%-10f\n", "hello", 7, 'a', 1.23 );
return 0;
}