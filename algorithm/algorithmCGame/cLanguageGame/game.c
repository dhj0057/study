#define _CRT_SECURE_NO_WARNINGS
#pragma execution_character_set("utf-8")
#include "game.h"
#include <time.h>
#include <conio.h>
#include <windows.h>

/* ===== 값 보정 유틸 ===== */

void clampGameValues(int* fishPos, int* barPos, int barSize, int* gauge)
{
    if (*fishPos < 0) *fishPos = 0;
    else if (*fishPos >= FIELD_HEIGHT) *fishPos = FIELD_HEIGHT - 1;

    if (*barPos < 0) *barPos = 0;
    else if (*barPos > FIELD_HEIGHT - barSize) *barPos = FIELD_HEIGHT - barSize;

    if (*gauge < 0) *gauge = 0;
    else if (*gauge > 100) *gauge = 100;
}

/* ===== 난이도 설정 ===== */

DifficultySetting getDifficultySetting(int difficulty)
{
    DifficultySetting s = { 3, 3, 3, 1, 140 };   /* 기본값 = Normal(2) */

    if (difficulty == 1)         /* Easy */
    {
        s.barSize = 4; s.gaugeUp = 4; s.gaugeDown = 2; s.fishMoveRange = 1; s.frameDelay = 180;
    }
    else if (difficulty == 3)    /* Hard */
    {
        s.barSize = 2; s.gaugeUp = 2; s.gaugeDown = 4; s.fishMoveRange = 2; s.frameDelay = 100;
    }
    return s;
}

/* ===== 핵심 미니게임 로직 ===== */

int fishingMiniGame(int difficulty)
{
    DifficultySetting cfg = getDifficultySetting(difficulty);
    int fishPos = FIELD_HEIGHT / 2;
    int barPos = FIELD_HEIGHT / 2;
    int gauge = START_GAUGE;
    int move, key;

    clampGameValues(&fishPos, &barPos, cfg.barSize, &gauge);
    system("cls");

    while (gauge > 0 && gauge < 100)
    {
        drawFishingGame(fishPos, barPos, cfg.barSize, gauge);

        if (_kbhit())
        {
            key = _getch();
            if (key == 'w' || key == 'W') barPos--;
            else if (key == 's' || key == 'S') barPos++;
        }

        move = (rand() % (cfg.fishMoveRange * 2 + 1)) - cfg.fishMoveRange;
        fishPos += move;

        /* 입력/이동/판정 직후마다 범위를 다시 보정(화면 밖 이탈 방지). */
        clampGameValues(&fishPos, &barPos, cfg.barSize, &gauge);
        if (fishPos >= barPos && fishPos < barPos + cfg.barSize) gauge += cfg.gaugeUp;
        else gauge -= cfg.gaugeDown;

        clampGameValues(&fishPos, &barPos, cfg.barSize, &gauge);
        Sleep(cfg.frameDelay);
    }

    return (gauge >= 100) ? 1 : 0;
}

/* ===== 난이도 선택 흐름 ===== */

int selectDifficulty(void)
{
    int difficulty;
    drawTitleArt();

    setColor(COLOR_WHITE);
    printf("   [ 원하는 낚시 장소(난이도)를 선택하세요 ]\n\n");
    printf("   1. 마을 앞 잔잔한 시냇가     (Easy Mode)\n");
    printf("   2. 비밀의 숲 신비로운 호수   (Normal Mode)\n");
    printf("   3. 거친 파도가 치는 바닷가   (Hard Mode)\n\n");

    drawMessageBox("장소에 따라 물고기의 기동성이 달라집니다.", "1 ~ 3 사이의 번호를 입력 후 Enter를 누르세요.");
    printf("\n 🏹 선택: ");

    if (scanf("%d", &difficulty) != 1)
    {
        while (getchar() != '\n') {}
        difficulty = 2;
    }
    if (difficulty < 1 || difficulty > 3) difficulty = 2;
    return difficulty;
}

/* ===== 캐스팅(입질 대기) 흐름 ===== */

int casting(void)
{
    int i, key;
    ULONGLONG biteStart;
    int waitFrames = 8 + (rand() % 6);

    system("cls");

    for (i = 0; i < waitFrames; i++)
    {
        drawWaitingSceneFixed(i, 0);
        Sleep(350);
    }

    while (_kbhit()) _getch();

    biteStart = GetTickCount64();
    i = 0;
    while (GetTickCount64() - biteStart < 1800)
    {
        drawWaitingSceneFixed(i++, 1);

        if (_kbhit())
        {
            key = _getch();
            if (key == ' ')
            {
                system("cls");
                return 1;
            }
        }
        Sleep(120);
    }

    system("cls");
    drawMessageBox("아차차! 한발 늦었습니다.", "물고기가 미끼만 먹고 수면 아래로 도망쳤습니다.");
    Sleep(1500);
    return 0;
}

/* ===== 재시도 선택 ===== */

int askRetry(void)
{
    int retry;
    printf("\n");
    drawMessageBox("1. 다음 캐스팅을 준비한다 (다시 하기)", "2. 장비를 챙겨 집으로 돌아간다 (종료)");
    printf("\n 선택: ");

    if (scanf("%d", &retry) != 1)
    {
        while (getchar() != '\n') {}
        return 0;
    }
    return (retry == 1) ? 1 : 0;
}

/* ===== 전체 게임 진행 (main) ===== */

int main(void)
{
    int difficulty, result;
    int retry = 1;

    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
    srand((unsigned int)time(NULL));
    hideCursor();

    while (retry == 1)
    {
        difficulty = selectDifficulty();

        if (casting()) result = fishingMiniGame(difficulty);
        else result = 0;

        system("cls");
        drawResultBanner(result == 1);

        retry = askRetry();
    }

    setColor(COLOR_WHITE);
    printf("\n은은한 노을을 뒤로하고 집으로 복귀합니다. 시스템을 종료합니다.\n");
    return 0;
}