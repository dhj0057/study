#define _CRT_SECURE_NO_WARNINGS
#pragma execution_character_set("utf-8")

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <conio.h>
#include <windows.h>

#define FIELD_HEIGHT 12
#define START_GAUGE 50
#define FISH_SPRITE "><(((('>"
#define BAR_SPRITE "[##########]"

void clearScreen(void)
{
    system("cls");
}

void clampGameValues(int* fishPos, int* barPos, int barSize, int* gauge)
{
    if (*fishPos < 0)
    {
        *fishPos = 0;
    }
    else if (*fishPos >= FIELD_HEIGHT)
    {
        *fishPos = FIELD_HEIGHT - 1;
    }

    if (*barPos < 0)
    {
        *barPos = 0;
    }
    else if (*barPos > FIELD_HEIGHT - barSize)
    {
        *barPos = FIELD_HEIGHT - barSize;
    }

    if (*gauge < 0)
    {
        *gauge = 0;
    }
    else if (*gauge > 100)
    {
        *gauge = 100;
    }
}

void drawGauge(int gauge)
{
    int i;
    int filled = gauge / 5;

    printf("게이지: [");
    for (i = 0; i < 20; i++)
    {
        if (i < filled)
        {
            printf("#");
        }
        else
        {
            printf("-");
        }
    }
    printf("] %d%%\n", gauge);
}

void drawFishingGame(int fishPos, int barPos, int barSize, int gauge)
{
    int i;

    clearScreen();

    printf("========================================================\n");
    printf("                 실시간 낚시 미니게임\n");
    printf("========================================================\n\n");
    printf("조작: W = 위로, S = 아래로\n");
    printf("물고기 %s 가 낚시 바 %s 안에 있도록 유지하세요.\n\n",
        FISH_SPRITE, BAR_SPRITE);
    printf("+--------------------+----------------------+\n");
    printf("|       물고기       |        낚시 바       |\n");
    printf("+--------------------+----------------------+\n");

    for (i = 0; i < FIELD_HEIGHT; i++)
    {
        if (i == fishPos)
        {
            printf("|     %-14s |", FISH_SPRITE);
        }
        else
        {
            printf("|                    |");
        }

        if (i >= barPos && i < barPos + barSize)
        {
            printf("     %-16s |\n", BAR_SPRITE);
        }
        else
        {
            printf("                      |\n");
        }
    }

    printf("+--------------------+----------------------+\n\n");
    drawGauge(gauge);
}

int fishingMiniGame(int difficulty)
{
    int fishPos = FIELD_HEIGHT / 2;
    int barPos = FIELD_HEIGHT / 2;
    int barSize = 3;
    int gauge = START_GAUGE;
    int gaugeUp = 3;
    int gaugeDown = 3;
    int fishMoveRange = 1;
    int frameDelay = 140;
    int move;
    int key;

    if (difficulty == 1)
    {
        barSize = 4;
        gaugeUp = 4;
        gaugeDown = 2;
        fishMoveRange = 1;
        frameDelay = 180;
    }
    else if (difficulty == 3)
    {
        barSize = 2;
        gaugeUp = 2;
        gaugeDown = 4;
        fishMoveRange = 2;
        frameDelay = 100;
    }

    clampGameValues(&fishPos, &barPos, barSize, &gauge);

    while (gauge > 0 && gauge < 100)
    {
        drawFishingGame(fishPos, barPos, barSize, gauge);

        if (_kbhit())
        {
            key = _getch();

            if (key == 'w' || key == 'W')
            {
                barPos--;
            }
            else if (key == 's' || key == 'S')
            {
                barPos++;
            }
        }

        move = (rand() % (fishMoveRange * 2 + 1)) - fishMoveRange;
        fishPos += move;

        clampGameValues(&fishPos, &barPos, barSize, &gauge);

        if (fishPos >= barPos && fishPos < barPos + barSize)
        {
            gauge += gaugeUp;
        }
        else
        {
            gauge -= gaugeDown;
        }

        clampGameValues(&fishPos, &barPos, barSize, &gauge);
        Sleep(frameDelay);
    }

    clearScreen();

    if (gauge >= 100)
    {
        return 1;
    }

    return 0;
}

int selectDifficulty(void)
{
    int difficulty;

    printf("난이도를 선택하세요.\n");
    printf("1. 쉬움\n");
    printf("2. 보통\n");
    printf("3. 어려움\n");
    printf("선택: ");

    if (scanf("%d", &difficulty) != 1)
    {
        while (getchar() != '\n')
        {
        }
        difficulty = 2;
    }

    if (difficulty < 1 || difficulty > 3)
    {
        difficulty = 2;
    }

    return difficulty;
}

int casting(void)
{
    int i;
    int key;
    ULONGLONG biteStart;

    printf("\n낚싯대를 던집니다");
    for (i = 0; i < 3; i++)
    {
        printf(".");
        Sleep(400);
    }

    printf("\n입질을 기다리는 중");
    for (i = 0; i < 5; i++)
    {
        printf(".");
        Sleep(500);
    }

    while (_kbhit())
    {
        _getch();
    }

    printf("\n\n입질이 왔습니다! 2초 안에 SPACE 키를 누르세요!\n");
    biteStart = GetTickCount64();

    while (GetTickCount64() - biteStart < 2000)
    {
        if (_kbhit())
        {
            key = _getch();
            if (key == ' ')
            {
                printf("물고기를 낚았습니다! 미니게임을 시작합니다.\n");
                Sleep(800);
                return 1;
            }
        }

        Sleep(10);
    }

    printf("너무 늦었습니다. 물고기가 도망갔습니다.\n");
    Sleep(1000);
    return 0;
}

int askRetry(void)
{
    int retry;

    printf("\n다시 시도하시겠습니까?\n");
    printf("1. 예\n");
    printf("2. 아니요\n");
    printf("선택: ");

    if (scanf("%d", &retry) != 1)
    {
        while (getchar() != '\n')
        {
        }
        return 0;
    }

    if (retry == 1)
    {
        return 1;
    }

    return 0;
}

int main(void)
{
    int difficulty;
    int result;
    int retry = 1;

    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
    srand((unsigned int)time(NULL));

    while (retry == 1)
    {
        clearScreen();

        printf("=== 낚시 게임 ===\n\n");

        difficulty = selectDifficulty();
        if (casting())
        {
            result = fishingMiniGame(difficulty);
        }
        else
        {
            result = 0;
        }

        if (result == 1)
        {
            printf("축하합니다! 물고기를 잡았습니다!\n");
        }
        else
        {
            printf("실패했습니다! 물고기를 놓쳤습니다.\n");
        }

        retry = askRetry();
    }

    printf("\n게임을 종료합니다.\n");

    return 0;
}
