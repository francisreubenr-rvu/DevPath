#include <stdio.h>
int main( void ){

char x;
char y[ 9 ];

printf( "enter a string: " );
scanf ("%c%s", &x, y );
printf( "The input was: \n" );
printf( "the character \"%c\" ", x );
printf( "and the string \"%s\"\n", y );
return 0; 
} 