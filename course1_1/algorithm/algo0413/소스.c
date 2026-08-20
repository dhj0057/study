#include <stdio.h>

int main(void) 
{
	int i, j, count = 0;
	for (i = 0; i <= 100; ++i)
	{
		for (j = 2; j < i; ++j)
		{
			if (i % j == 0)
				break;
		}
	
		if (j == i)  
		{
			count++;
			printf("%d%s", i, count % 5 ? " " : "\n");
		}
	
	
	}



}