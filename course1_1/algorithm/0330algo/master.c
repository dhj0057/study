#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
int main(void)
{
	int a = 0, b = 0, c = 1;
	printf("논리연산 1&&1||0의결과 :%d\n", 1 && 1 || 0);
	printf("논리연산 1&&0||1의결과 :%d\n", 1 && 0 || 1);
	printf("논리연산 1&&0||0의결과 :%d\n", 1 && 0 || 0);

	printf("논리연산 1&&0||0&&1 의결과 : %d\n", (b && a) || (a&&c));
	printf("논리연산 <1&&0> || <0&&1> 의결과 : %d\n", (b && a) || (a && c));

	
	return 0;
	







}
