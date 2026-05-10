#include <stdio.h>
int main ( void )
{
char z[ 9 ];
printf( "Enter a string: " );
scanf( "%[Aaeiou]", z ); 
printf( "The input was \"%s\"\n", z );
return 0; 
}