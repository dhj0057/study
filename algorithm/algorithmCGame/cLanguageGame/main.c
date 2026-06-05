#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <conio.h>
#include <windows.h>

#define FIELD_HEIGHT 12
#define START_GAUGE 50
#define FISH_SPRITE "><(((('>"
#define BAR_SPRITE "[##########]"

/* 화면을 지워서 매 프레임마다 게임 화면을 새로 그린다. */
void clearScreen(void)
{
    system("cls");
}

/*
 * 물고기, 낚시 바, 게이지가 허용 범위를 벗어나지 않도록 보정한다.
 * 포인터를 사용하므로 함수 밖에 있는 실제 변수의 값이 변경된다.
 */
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

/* 현재 게이지를 20칸 막대와 백분율로 출력한다. */
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

/* 물고기 위치, 낚시 바 위치, 게이지를 이용해 한 프레임을 출력한다. */
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

/*
 * 실시간 낚시 미니게임을 실행한다.
 * 물고기가 낚시 바 안에 있으면 게이지가 증가하고,
 * 낚시 바 밖에 있으면 게이지가 감소한다.
 */
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

    /* 난이도에 따라 낚시 바 크기, 게이지 변화량, 게임 속도를 조절한다. */
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

        /* 키가 눌렸을 때만 입력을 읽어서 게임 흐름이 멈추지 않게 한다. */
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

        /* 물고기는 매 프레임마다 무작위로 위아래 이동한다. */
        move = (rand() % (fishMoveRange * 2 + 1)) - fishMoveRange;
        fishPos += move;

        clampGameValues(&fishPos, &barPos, barSize, &gauge);

        /* 물고기와 낚시 바가 겹치는지 확인하여 게이지를 변경한다. */
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

/* 사용자에게 난이도를 입력받고, 잘못된 입력이면 보통 난이도를 선택한다. */
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

/*
 * 캐스팅과 입질 반응 단계를 실행한다.
 * 입질이 온 뒤 2초 안에 SPACE 키를 누르면 성공한다.
 */
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

    /* 시작 시각부터 2초 동안 키 입력을 실시간으로 확인한다. */
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

/* 한 판이 끝난 뒤 재시도 여부를 입력받는다. */
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

/* 게임의 전체 진행 순서를 관리하는 시작 함수이다. */
int main(void)
{
    int difficulty;
    int result;
    int retry = 1;

    /* 콘솔에서 한글을 출력하고, 매 실행마다 다른 난수를 사용하도록 설정한다. */
    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
    srand((unsigned int)time(NULL));

    while (retry == 1)
    {
        clearScreen();

        printf("=== 낚시 게임 ===\n\n");

        difficulty = selectDifficulty();

        /* 입질 반응에 성공한 경우에만 실시간 미니게임을 시작한다. */
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
