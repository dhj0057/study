#ifndef GAME_H
#define GAME_H
#define _CRT_SECURE_NO_WARNINGS
#pragma execution_character_set("utf-8")

#include <stdio.h>
#include <stdlib.h>

/* ---------- 상수 / 색상 ---------- */
#define FIELD_HEIGHT 12
#define START_GAUGE 50

#define FISH_SPRITE "<º))))><"  
#define BAR_SPRITE  "║██████║"  

// 컬러 설정
#define COLOR_GREEN  2
#define COLOR_AQUA   3
#define COLOR_RED    4
#define COLOR_GOLD   6
#define COLOR_GRAY   8
#define COLOR_BLUE   9
#define COLOR_LIGHTGREEN  10
#define COLOR_LIGHTAQUA   11
#define COLOR_LIGHTRED    12
#define COLOR_YELLOW 14
#define COLOR_WHITE  15

/* ---------- 난이도 설정 구조체 ---------- */
typedef struct
{
    int barSize;        /* 낚시 바 길이        */
    int gaugeUp;        /* 성공 시 게이지 증가  */
    int gaugeDown;      /* 실패 시 게이지 감소  */
    int fishMoveRange;  /* 물고기 이동 범위     */
    int frameDelay;     /* 프레임 간 지연(ms)   */
} DifficultySetting;

/* ====================================================
   함수 선언 (정의 위치)
   - display.c : 화면/맵 그리기 + 콘솔 제어
   - game.c    : 게임 진행 로직 + main
   ==================================================== */

   /* [display.c] 콘솔 제어 */
void setCursorPosition(int x, int y);
void setColor(int color);
void hideCursor(void);

/* [display.c] 공용 출력 */
void printPadded(const char* str, int targetWidth);
void drawMessageBox(const char* line1, const char* line2);
void printFieldBorder(void);
void printFieldLine(const char* text);

/* [display.c] 맵/화면 */
void drawTitleArt(void);
void drawFieldMessageBox(int isBiting);
void drawWaitingSceneFixed(int frame, int isBiting);
void drawFishingGame(int fishPos, int barPos, int barSize, int gauge);
void drawResultBanner(int success);

/* [game.c] 게임 진행 로직 */
void clampGameValues(int* fishPos, int* barPos, int barSize, int* gauge);
DifficultySetting getDifficultySetting(int difficulty);
int fishingMiniGame(int difficulty);
int selectDifficulty(void);
int casting(void);
int askRetry(void);

#endif /* GAME_H */