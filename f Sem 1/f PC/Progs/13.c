#include <stdio.h>
int main(void){
    double a;
    double b;
    double c;
printf( "enter three floating-point numbers: \n" );
scanf ( "%1e%1f%1g", &a, &b, &c );
printf( "Here are the numbers entered in plain\n" );
printf( "floating-point notation:\n" );
printf( "%f\n%f\n%f\n", a, b, c );
return 0; 
}