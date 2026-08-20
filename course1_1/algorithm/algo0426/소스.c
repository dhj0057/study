#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main() {
    int A, B, C;

    // 세 정수 입력
    scanf("%d %d %d", &A, &B, &C);

    // 요구사항에 맞춰 4가지 수식의 결과를 각각 줄바꿈(\n)하여 출력
    printf("%d\n", (A + B) % C);
    printf("%d\n", ((A % C) + (B % C)) % C);
    printf("%d\n", (A * B) % C);
    printf("%d\n", ((A % C) * (B % C)) % C);

    return 0;
}