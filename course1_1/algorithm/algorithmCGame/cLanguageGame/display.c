#define _CRT_SECURE_NO_WARNINGS
#pragma execution_character_set("utf-8")
#include "game.h"
#include <windows.h>

/* ===== 콘솔 제어 ===== */

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

/* ===== 공용 출력 ===== */

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

void drawMessageBox(const char* line1, const char* line2)
{
    setColor(COLOR_GRAY);
    printf(" ┌────────────────────────────────────────────────────────┐\n");
    printf(" │ "); setColor(COLOR_WHITE);  printPadded(line1, 56); setColor(COLOR_GRAY); printf("│\n");
    printf(" │ "); setColor(COLOR_YELLOW); printPadded(line2, 56); setColor(COLOR_GRAY); printf("│\n");
    printf(" └────────────────────────────────────────────────────────┘\n");
    setColor(COLOR_WHITE);
}

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

/* ===== 맵 / 화면 그리기 ===== */

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

void drawResultBanner(int success)
{
    if (success)
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
}