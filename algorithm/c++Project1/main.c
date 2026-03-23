#define _CRT_SECURE_NO_WARNINGS 
#include <stdio.h>

int main(void)
{
	
	{
		
		unsigned int n, m = 0;
		

		printf("n번째 자연수인 홀수를 입력하세요.\n");
		scanf("%u", &n);
		printf("m번째 자연수인 홀수를 입력하세요.\n");
		scanf("%u", &m);
		
		int x = 2 * n - 1;
		int y = 2 * m - 1;
		int z = x + y;
		
		printf("n번째 자연수인 홀수의값 %d 와(과) m번째 자연수인 홀수의값 %d 의합은 %d+%d= %d이다", x, y, x ,y ,z);

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





}