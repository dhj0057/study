#define _CRT_SECURE_NO_WARNINGS 
#include <stdio.h>

int main(void)
{


	int a;


	printf("자연수 a를 입력");
	scanf("%d", &a);

	if (a % 2 == 0)
	
		printf(" 홀수의 합은 %d ", ((a / 2) * (a / 2)));
		
	
	if (a% 2 == 1)
		
		printf("홀수의 합은 %d ", ((a + 1) / 2) * ((a + 1) / 2));


	     
	
	
	
	printf(" 자연수 %d 보다 낮은 홀수들의 합 %d \n", a, ((a + 1) / 2) * ((a + 1) / 2));

	return 0;





}



