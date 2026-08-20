#define _CRT_SECURE_NO_WARNINGS 
#include <stdio.h>

int main(void)
{
	
	 
	int a;

		
	printf("자연수 a를 입력");
	scanf("%d", &a);

		
	printf(" 자연수 %d 보다 낮은 홀수들의 합 %d \n", a , ((a + 1) / 2) * (( a + 1) / 2) );   
		
		/*자연수인 a까지의 홀수의합은 a까지의 홀수의 갯수의 제곱 (등차수열의 합원리를 이용)
		 자연수a까지의 홀수갯수 n개까지의 공식은  (a+1)/2 = n 이다
		 따라서 n을 제곱한 식은 (a + 1) / 2) * (( a + 1) / 2)을 사용하였다 .*/


	return 0;
		
		/*
		scanf
		printf
		get char
		put char
		gets
		puts
		
		복습해라 형준아 닝겐아 
		1개요
		2해결과정
		3코드자료
		4실행결과
		5느낀점
		*/



	





}