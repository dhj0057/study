#define _CRT_SECURE_NO_WARNINGS
#pragma execution_character_set("utf-8")
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <conio.h>
#include <windows.h>

#define FIELD_HEIGHT 12
#define START_GAUGE 50

#define FISH_SPRITE "<º))))><"  
#define BAR_SPRITE  "║██████║"  

// 컬러 설정
#define COLOR_NAVY   1
#define COLOR_GREEN  2
#define COLOR_AQUA   3
#define COLOR_RED    4
#define COLOR_PURPLE 5
#define COLOR_GOLD   6
#define COLOR_GRAY   8
#define COLOR_BLUE   9
#define COLOR_LIGHTGREEN  10
#define COLOR_LIGHTAQUA   11
#define COLOR_LIGHTRED    12
#define COLOR_YELLOW 14
#define COLOR_WHITE  15

void setCursorPosition(int x, int y)
{
    COORD coord = { (SHORT)x, (SHORT)y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

void setColor(int color)
{
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color);
}

void hideCursor(void)
{
    HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO info;
    info.dwSize = 100;
    info.bVisible = FALSE;
    SetConsoleCursorInfo(consoleHandle, &info);
}

void clampGameValues(int* fishPos, int* barPos, int barSize, int* gauge)
{
    if (*fishPos < 0) *fishPos = 0;
    else if (*fishPos >= FIELD_HEIGHT) *fishPos = FIELD_HEIGHT - 1;

    if (*barPos < 0) *barPos = 0;
    else if (*barPos > FIELD_HEIGHT - barSize) *barPos = FIELD_HEIGHT - barSize;

    if (*gauge < 0) *gauge = 0;
    else if (*gauge > 100) *gauge = 100;
}

// 한글/영문 고정폭 출력을 보장하는 문자열 정렬 함수
void printPadded(const char* str, int targetWidth)
{
    int i = 0;
    int currentWidth = 0;

    while (str[i] != '\0')
    {
        if ((str[i] & 0x80) != 0)
        {
            printf("%c%c%c", str[i], str[i + 1], str[i + 2]);
            currentWidth += 2;
            i += 3;
        }
        else
        {
            printf("%c", str[i]);
            currentWidth += 1;
            i += 1;
        }
    }

    for (int j = currentWidth; j < targetWidth; j++)
    {
        printf(" ");
    }
}

// 스크린샷과 동일한 규격의 고정 가로폭 하단 대사창
void drawMessageBox(const char* line1, const char* line2)
{
    setColor(COLOR_GRAY);
    printf(" ┌────────────────────────────────────────────────────────┐\n");
    printf(" │ "); setColor(COLOR_WHITE);  printPadded(line1, 56); setColor(COLOR_GRAY); printf("│\n");
    printf(" │ "); setColor(COLOR_YELLOW); printPadded(line2, 56); setColor(COLOR_GRAY); printf("│\n");
    printf(" └────────────────────────────────────────────────────────┘\n");
    setColor(COLOR_WHITE);
}

void drawTitleArt(void)
{
    system("cls");
    printf("\n");
    setColor(COLOR_BLUE);       printf("   ╔════════════════════════════════════════════════════╗\n");
    setColor(COLOR_AQUA);       printf("   ║  ███████╗██╗███████╗██╗  ██╗██╗███╗   ██╗ ██████╗  ║\n");
    printf("   ║  ██╔════╝██║██╔════╝██║  ██║██║████╗  ██║██╔════╝  ║\n");
    setColor(COLOR_LIGHTAQUA);  printf("   ║  █████╗  ██║███████╗███████║██║██╔██╗ ██║██║  ███╗ ║\n");
    printf("   ║  ██╔══╝  ██║╚════██║██╔══██║██║██║╚██╗██║██║   ██║ ║\n");
    setColor(COLOR_BLUE);       printf("   ║  ██║     ██║███████║██║  ██║██║██║ ╚████║╚██████╔╝ ║\n");
    printf("   ║  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝  ║\n");
    setColor(COLOR_YELLOW);     printf("   ║               - REALTIME FISHING GAME -            ║\n");
    setColor(COLOR_BLUE);       printf("   ╚════════════════════════════════════════════════════╝\n\n");
}

// [핵심 변경] 나룻배, 심해 단면, 유유히 헤엄치는 물고기가 포함된 광활한 FIELD VIEW
void printFieldBorder(void)
{
    printf(" +--------------------------------------------------------------------+\n");
}

void printFieldLine(const char* text)
{
    printf(" |");
    printPadded(text, 68);
    printf("|\n");
}

void drawFieldMessageBox(int isBiting)
{
    printf("\n");
    setColor(COLOR_GRAY);
    printFieldBorder();

    if (isBiting)
    {
        setColor(COLOR_WHITE);
        printFieldLine("  BITE! 물 위에 큰 파문이 생겼습니다.");
        setColor(COLOR_YELLOW);
        printFieldLine("  2초 안에 SPACEBAR를 누르면 미니게임이 시작됩니다.");
    }
    else
    {
        setColor(COLOR_WHITE);
        printFieldLine("  조용한 호수에서 입질을 기다리는 중입니다.");
        setColor(COLOR_YELLOW);
        printFieldLine("  물 위에 파문이 생기면 SPACEBAR를 누르세요.");
    }

    setColor(COLOR_GRAY);
    printFieldBorder();
    setColor(COLOR_WHITE);
}

void drawWaitingSceneFixed(int frame, int isBiting)
{
    setCursorPosition(0, 0);

    setColor(COLOR_GOLD);
    printFieldBorder();
    printFieldLine("                           FIELD VIEW");
    printFieldBorder();

    setColor(COLOR_LIGHTAQUA);
    if (frame % 4 < 2)
    {
        printFieldLine("       .            .                         .");
    }
    else
    {
        printFieldLine("             .            .                   .");
    }

    setColor(COLOR_GRAY);
    printFieldLine("                 _.-^-._                  _.-^-._");
    printFieldLine("            _.-'       '-._          _.-'       '-._");

    setColor(COLOR_WHITE);
    printFieldLine("        ____");
    printFieldLine("       /_[]_\\        ________________");
    printFieldLine("      ( o  o )------'                '----.__");
    printFieldLine("       \\_==_/                              `-.`.");
    printFieldLine("      __/||\\__                               `.`.");
    printFieldLine("     /  /||\\  \\                                `o");
    printFieldLine(" ___/__/ || \\__\\___");
    printFieldLine("|_____|__||__|_____|________________________________");
    printFieldLine("   ||    ||    ||       wooden dock");

    setColor(COLOR_BLUE);
    printFieldLine("~~~||~~~~||~~~~||~~~~~~~ ~~~~~~~ ~~~~~~~ ~~~~~~~");

    if (isBiting)
    {
        setColor(COLOR_LIGHTRED);
        printFieldLine("~~~~~~~~~~~~~ ~~~~~~~~~~~~~~       .-~~~~-.   ~~~");
        printFieldLine("  ><(((('>        ~~~~~~~~        (  BITE! )  ~~~");
        printFieldLine("~~~~~~~~~~~~~ ~~~~~~~~~~~~~~       '-.___.-'  ~~~");
        printFieldLine("~~~~~~      ><(((('>       ~~~~~~~   \\ | /    ~~~");
    }
    else
    {
        setColor(COLOR_BLUE);
        printFieldLine("~~~~~~~~~~~~~ ~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~ ~~~~~");

        setColor(COLOR_GREEN);
        if (frame % 2 == 0)
        {
            printFieldLine("~~~~~~     ><(((('>       ~~~~~~~        <><   ~~~");
        }
        else
        {
            printFieldLine("~~~~~~       ><(((('>     ~~~~~~~      <><     ~~~");
        }

        setColor(COLOR_BLUE);
        printFieldLine("~~~~~~~~~~~~~ ~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~ ~~~~~");
        printFieldLine("~~~~  seaweed   ~~~~~     stones      ~~~~   ~~~");
    }

    setColor(COLOR_GOLD);
    printFieldBorder();

    drawFieldMessageBox(isBiting);
}

void drawWaitingScene(int frame, int isBiting)
{
    setCursorPosition(0, 0);
    setColor(COLOR_GOLD);
    printf(" ╔═══════════════════════ FIELD VIEW ══════════════════════╗\n");

    // 1. 하늘 및 구름 표현
    setColor(COLOR_GRAY);
    if (frame % 4 < 2) {
        printf(" │   ☁                                 ☁                   │\n");
    }
    else {
        printf(" │     ☁                                 ☁                 │\n");
    }

    // 2. 나룻배와 그 위에 앉아 낚싯대를 쥔 강태공 (제공 이미지 반영)
    setColor(COLOR_WHITE);
    printf(" │             (⌐■_■)                                      │\n");
    printf(" │          ____[  ]/_  🎣 ══════⋱                         │\n");
    printf(" │          \\________/            ⋱                        │\n");

    // 3. 잔잔하게 물결치는 널찍한 바다 수면 레이어 및 낚싯줄 라인
    setColor(COLOR_BLUE);
    if (isBiting) {
        printf(" │~~~~~~~~~~~~~~~"); setColor(COLOR_LIGHTAQUA); printf("~~~~~~~~~~~~~~~~"); setColor(COLOR_BLUE); printf("   ⋱  "); setColor(COLOR_BLUE); printf("~~~~~~~~~~~~~~~~~│\n");
    }
    else {
        printf(" │~~~~~~~~~~~~~~~"); setColor(COLOR_LIGHTAQUA); printf("~~~~~~~~~~~~~~~~"); setColor(COLOR_RED);  printf("   ■  "); setColor(COLOR_BLUE); printf("~~~~~~~~~~~~~~~~~│\n");
    }

    // 4. 바다 내부 깊숙이 내려오는 낚싯줄과 실제 헤엄치는 물고기들
    setColor(COLOR_BLUE);
    printf(" │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   │  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│\n");

    // 물고기 A (심해 중층에서 노니는 물고기 애니메이션)
    printf(" │▒▒▒▒▒▒▒▒▒▒▒▒ ");
    if (frame % 2 == 0) { setColor(COLOR_GREEN); printf("  %s ", FISH_SPRITE); }
    else { setColor(COLOR_GREEN); printf(" %s  ", FISH_SPRITE); }
    setColor(COLOR_BLUE);
    printf(" ▒▒▒▒▒▒▒▒▒   │  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│\n");

    // 입질 발생 시 찌 근처 미끼 영역에 이펙트 발동
    if (isBiting) {
        printf(" │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ "); setColor(COLOR_LIGHTRED); printf("💥( . )💥"); setColor(COLOR_BLUE); printf("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│\n");
    }
    else {
        printf(" │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ·  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│\n");
    }

    // 물고기 B (더 깊은 바닥 심해층에서 대기 중인 물고기)
    printf(" │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   │  ▒▒▒▒▒▒▒ ");
    if (frame % 2 == 0) { setColor(COLOR_AQUA); printf(" %s  ", FISH_SPRITE); }
    else { setColor(COLOR_AQUA); printf("  %s ", FISH_SPRITE); }
    setColor(COLOR_BLUE);
    printf(" ▒▒▒▒▒▒▒│\n");

    // 5. 바다 최하단 모서리 마감
    printf(" │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│\n");
    setColor(COLOR_GOLD);
    printf(" ╚════════════════════════════════════════════════════════╝\n");

    if (isBiting) {
        drawMessageBox("⚡ BITE! 미끼를 꽉 물고 물고기가 질주합니다!", "[ SPACEBAR ] 를 강하게 눌러 릴링을 시작하세요!");
    }
    else {
        drawMessageBox("🌊 조용한 바다 위, 나룻배에 앉아 입질을 기다립니다.", "수면 위의 찌가 아래로 강하게 요동칠 때를 노리세요.");
    }
}

// 스크린샷에서 보여주신 정밀하고 깔끔한 격벽 구조의 FIGHT WINDOW
void drawFishingGame(int fishPos, int barPos, int barSize, int gauge)
{
    int i;
    setCursorPosition(0, 0);

    setColor(COLOR_LIGHTAQUA);
    printf(" ╔══════════════════════ FIGHT WINDOW ═════════════════════╗\n");
    setColor(COLOR_GRAY);
    printf(" │          물 고 기 위 치       │        낚 시 바 가 드      │\n");
    printf(" ├──────────────────────────────┼────────────────────────────┤\n");

    for (i = 0; i < FIELD_HEIGHT; i++)
    {
        setColor(COLOR_GRAY);
        printf(" │");

        // 왼쪽 격실 (물고기 위치)
        if (i == fishPos)
        {
            printf("         ");
            setColor(COLOR_LIGHTGREEN);
            printPadded(FISH_SPRITE, 20);
        }
        else
        {
            printPadded("", 29);
        }

        setColor(COLOR_GRAY);
        printf("│");

        // 오른쪽 격실 (낚시 바 가드)
        if (i >= barPos && i < barPos + barSize)
        {
            printf("         ");
            setColor(COLOR_YELLOW);
            printPadded(BAR_SPRITE, 19);
        }
        else
        {
            printPadded("", 28);
        }

        setColor(COLOR_GRAY);
        printf("│\n");
    }

    setColor(COLOR_LIGHTAQUA);
    printf(" ╚═════════════════════════════════════════════════════════╝\n");

    // 스크린샷의 깔끔한 가로 PROGRESS 게이지 바 배치
    int filled = gauge / 5;
    setColor(COLOR_WHITE);
    printf("   PROGRESS: [");
    for (i = 0; i < 20; i++)
    {
        if (i < filled) {
            if (gauge > 70) setColor(COLOR_GREEN);
            else if (gauge > 30) setColor(COLOR_YELLOW);
            else setColor(COLOR_RED);
            printf("█");
        }
        else {
            setColor(COLOR_GRAY);
            printf("░");
        }
    }
    setColor(COLOR_WHITE);
    printf("] %d%%\n\n", gauge);

    drawMessageBox("[ W ] 위로 올리기 / [ S ] 아래로 내리기", "물고기를 황금색 가드 바 내부 공간에 가두어 두세요!");
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
    int move, key;

    if (difficulty == 1) {
        barSize = 4; gaugeUp = 4; gaugeDown = 2; fishMoveRange = 1; frameDelay = 180;
    }
    else if (difficulty == 3) {
        barSize = 2; gaugeUp = 2; gaugeDown = 4; fishMoveRange = 2; frameDelay = 100;
    }

    clampGameValues(&fishPos, &barPos, barSize, &gauge);
    system("cls");

    while (gauge > 0 && gauge < 100)
    {
        drawFishingGame(fishPos, barPos, barSize, gauge);

        if (_kbhit())
        {
            key = _getch();
            if (key == 'w' || key == 'W') barPos--;
            else if (key == 's' || key == 'S') barPos++;
        }

        move = (rand() % (fishMoveRange * 2 + 1)) - fishMoveRange;
        fishPos += move;

        clampGameValues(&fishPos, &barPos, barSize, &gauge);
        if (fishPos >= barPos && fishPos < barPos + barSize) gauge += gaugeUp;
        else gauge -= gaugeDown;

        clampGameValues(&fishPos, &barPos, barSize, &gauge);
        Sleep(frameDelay);
    }

    return (gauge >= 100) ? 1 : 0;
}

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
        if (result == 1)
        {
            printf("\n");
            setColor(COLOR_GREEN);
            printf("     ██╗  ██╗██╗████████╗██╗   ██╗██╗██╗██╗\n");
            printf("     ██║  ██║██║╚══██╔══╝██║   ██║██║██║██║\n");
            printf("     ███████║██║   ██║   ██║   ██║██║██║██║\n");
            printf("     ██╔══██║██║   ██║   ██║   ██║╚═╝╚═╝╚═╝\n");
            printf("     ██║  ██║██║   ██║   ╚██████╔╝██╗██╗██╗\n");
            printf("     ╚═╝  ╚═╝╚═╝   ╚═╝    ╚═════╝ ╚═╝╚═╝╚═╝\n\n");
            drawMessageBox("[ 대어 포획 성공! ]", "인벤토리에 싱싱한 물고기가 추가되었습니다.");
        }
        else
        {
            printf("\n");
            setColor(COLOR_RED);
            printf("     ███████╗ █████╗ ██╗██╗     ██╗██╗██╗\n");
            printf("     ██╔════╝██╔══██╗██║██║     ██║██║██║\n");
            printf("     █████╗  ███████║██║██║     ██║██║██║\n");
            printf("     ██╔══╝  ██╔══██║██║██║     ╚═╝╚═╝╚═╝\n");
            printf("     ██║     ██║  ██║██║███████╗██╗██╗██╗\n");
            printf("     ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚═╝╚═╝╚═╝\n\n");
            drawMessageBox("[ 낚시 실패... ]", "거센 저항으로 인해 줄이 풀려 놓치고 말았습니다.");
        }

        retry = askRetry();
    }

    setColor(COLOR_WHITE);
    printf("\n은은한 노을을 뒤로하고 집으로 복귀합니다. 시스템을 종료합니다.\n");
    return 0;
}
