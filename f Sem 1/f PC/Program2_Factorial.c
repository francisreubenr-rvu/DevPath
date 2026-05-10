#include <stdio.h>
int fact(int x){
    return x == 1 ? 1 : x * fact(x - 1);}
void main(){
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);
    printf("Factorial of %d is %d\n", n, fact(n));}