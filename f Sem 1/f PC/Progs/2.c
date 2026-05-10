#include <stdio.h>
int main ( void ){
printf( "%e\n", 1234567.89 );
printf( "%e\n", +1234567.89 ); 
printf( "%e\n", -1234567.89 );
printf( "%E\n", 1234567.89 );
printf( "%F\n", 1234567.89 ); 
printf( "%g\n", 1234567.89 );
printf( "%G\n", 1234567.89 );
return 0; 
}