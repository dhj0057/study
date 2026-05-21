#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <conio.h>
#include <windows.h>

#define FIELD_HEIGHT 12
#define START_GAUGE 50

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

    printf("Gauge: [");
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

    printf("=== Real-time Fishing Mini Game ===\n\n");
    printf("Control: W = Up, S = Down\n");
    printf("Keep fish F inside the fishing bar [###].\n\n");

    for (i = 0; i < FIELD_HEIGHT; i++)
    {
        printf("| ");

        if (i == fishPos)
        {
            printf("F");
        }
        else
        {
            printf(" ");
        }

        printf(" ");

        if (i >= barPos && i < barPos + barSize)
        {
            printf("[###]");
        }
        else
        {
            printf("     ");
        }

        printf(" |\n");
    }

    printf("\n");
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

    printf("Select difficulty.\n");
    printf("1. Easy\n");
    printf("2. Normal\n");
    printf("3. Hard\n");
    printf("Choice: ");

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

void casting(void)
{
    int i;

    printf("\nCasting the fishing rod");
    for (i = 0; i < 3; i++)
    {
        printf(".");
        Sleep(400);
    }

    printf("\nWaiting for a bite");
    for (i = 0; i < 5; i++)
    {
        printf(".");
        Sleep(500);
    }

    printf("\n\nA fish is biting!\n");
    Sleep(1000);
}

int askRetry(void)
{
    int retry;

    printf("\nTry again?\n");
    printf("1. Yes\n");
    printf("2. No\n");
    printf("Choice: ");

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

    srand((unsigned int)time(NULL));

    while (retry == 1)
    {
        clearScreen();

        printf("=== Fishing Game ===\n\n");

        difficulty = selectDifficulty();
        casting();

        result = fishingMiniGame(difficulty);

        if (result == 1)
        {
            printf("Congratulations! You caught the fish!\n");
        }
        else
        {
            printf("Failed! The fish got away.\n");
        }

        retry = askRetry();
    }

    printf("\nGame over.\n");

    return 0;
}
