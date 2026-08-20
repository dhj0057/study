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
#define BAR_SPRITE  "[######]"

/* Windows console color values */
#define COLOR_GREEN       2
#define COLOR_AQUA        3
#define COLOR_RED         4
#define COLOR_PURPLE      5
#define COLOR_GOLD        6
#define COLOR_GRAY        8
#define COLOR_BLUE        9
#define COLOR_LIGHTGREEN 10
#define COLOR_LIGHTAQUA  11
#define COLOR_LIGHTRED   12
#define COLOR_YELLOW     14
#define COLOR_WHITE      15

/* Difficulty settings are grouped in a struct for clearer design. */
typedef struct
{
    int barSize;
    int gaugeUp;
    int gaugeDown;
    int fishMoveRange;
    int frameDelay;
    const char* title;
} DifficultySetting;

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

void clearScreen(void)
{
    system("cls");
}

/*
    UTF-8 Korean characters usually take 3 bytes and 2 console columns.
    This helper keeps message boxes aligned when Korean and English are mixed.
*/
void printPadded(const char* str, int targetWidth)
{
    int i = 0;
    int currentWidth = 0;
    int j;

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

    for (j = currentWidth; j < targetWidth; j++)
    {
        printf(" ");
    }
}

void drawMessageBox(const char* line1, const char* line2)
{
    setColor(COLOR_GRAY);
    printf(" +----------------------------------------------------------+\n");
    printf(" | ");
    setColor(COLOR_WHITE);
    printPadded(line1, 56);
    setColor(COLOR_GRAY);
    printf(" |\n");

    printf(" | ");
    setColor(COLOR_YELLOW);
    printPadded(line2, 56);
    setColor(COLOR_GRAY);
    printf(" |\n");
    printf(" +----------------------------------------------------------+\n");
    setColor(COLOR_WHITE);
}

/*
    Title art rebuilt in a surreal "night lake" style:
    a glowing gradient moon, a fish drifting through the sky,
    and the moon melting down into the water as a reflection.

    NOTE: the wide water uses ASCII '~' (always 1 column wide) so the layout
    never breaks. Block shading (░▒▓█) is used only for the compact central
    moon and its reflection, so column alignment stays stable on any console.
*/
void drawTitleArt(void)
{
    clearScreen();

    setColor(COLOR_LIGHTAQUA);
    printf("\n");
    printf("   +================================================================+\n");
    printf("   |              R E A L - T I M E   F I S H I N G                 |\n");
    printf("   +================================================================+\n\n");

    setColor(COLOR_GRAY);
    printf("        .          ·            *              ˙           ·\n");

    setColor(COLOR_GOLD);
    printf("                         ░▒▓▓▓▓▓▒░\n");
    printf("                      ░▒▓██████████▓▒░        ><(((°>\n");
    setColor(COLOR_YELLOW);
    printf("                     ▒▓██████████████▓▒\n");
    setColor(COLOR_GOLD);
    printf("                      ░▒▓██████████▓▒░\n");
    printf("                         ░▒▓▓▓▓▓▒░\n");

    setColor(COLOR_PURPLE);
    printf("   ~~~~~~~~~~~~~~~~~~~~~~  ░▒▓▒░  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    setColor(COLOR_BLUE);
    printf("   ~~~~~~~~~~~~~~~~~~~~~~  ▒▓█▓▒  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    printf("   ~~~~~~~~~~~~~~~~~~~~~~  ░▒▓▒░  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

    setColor(COLOR_WHITE);
    printf("\n       낚싯대를 던지고, 물고기를 바 안에 유지하세요.\n\n");
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

void drawFieldMessageBox(int isBiting)
{
    printf("\n");
    setColor(COLOR_GRAY);
    printFieldBorder();

    if (isBiting)
    {
        setColor(COLOR_WHITE);
        printFieldLine("  고요한 수면 위로 찌가 크게 흔들립니다.");
        setColor(COLOR_YELLOW);
        printFieldLine("  2초 안에 SPACEBAR를 눌러 챔질하세요.");
    }
    else
    {
        setColor(COLOR_WHITE);
        printFieldLine("  달빛이 비치는 호수에서 조용히 입질을 기다립니다.");
        setColor(COLOR_YELLOW);
        printFieldLine("  찌 주변에 파문이 생기면 SPACEBAR를 누르세요.");
    }

    setColor(COLOR_GRAY);
    printFieldBorder();
    setColor(COLOR_WHITE);
}

/*
    Waiting scene, redesigned in a surreal night-lake style.

    Composition (top -> bottom):
      - star sky with a fish drifting through the air (a surreal inversion)
      - a glowing gradient moon (block-shaded)
      - the moon's reflection "melting" straight down through the water
      - a small angler in a boat, line dropping to the float
      - calm ripple rings, or a dramatic strike burst when biting

    Wide water uses ASCII '~' (always 1 column) so the layout never breaks;
    block shading is limited to the compact central moon / reflection so it
    stays aligned on any console font.

    Every frame draws the SAME number of lines (waiting and biting included),
    so redrawing from cursor (0,0) leaves no leftover rows.
*/
void drawWaitingSceneFixed(int frame, int isBiting)
{
    setCursorPosition(0, 0);

    /* ---- frame + title ---- */
    setColor(COLOR_GOLD);
    printf("   +================================================================+\n");
    setColor(COLOR_LIGHTAQUA);
    printf("   |                   N I G H T   F I S H I N G                    |\n");
    setColor(COLOR_GOLD);
    printf("   +================================================================+\n");

    /* ---- night sky ---- */
    setColor(COLOR_GRAY);
    if (frame % 2 == 0)
        printf("       .         *              .             *          .\n");
    else
        printf("          *          .            *           .            *\n");

    /* ---- the angler on the bank; the rod reaches out over the water,
            and the line drops straight down from the rod tip ---- */
    setColor(COLOR_WHITE);
    printf("          .---.\n");
    printf("         / o o \\\n");
    printf("          \\ ~ /_\n");
    printf("         __|_|__ \\__\n");
    printf("        /  | |  \\___________________________________\n");
    printf("       |___|_|___|                                  |\n");
    printf("           | |                                      |\n");

    /* ---- bank edge where the dock meets the water ---- */
    setColor(COLOR_PURPLE);
    printf("   ~~~\\___/~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|~~~~~~~\n");

    /* ---- the float bobbing on the surface, or the strike on a bite ---- */
    if (isBiting)
    {
        setColor(COLOR_LIGHTRED);
        if (frame % 2 == 0)
        {
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\ /~~~~~~\n");
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~)) X ((~~~~\n");
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SPLASH! ~~~\n");
        }
        else
        {
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\|/~~~~~~\n");
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~))) X (((~~~\n");
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SPLASH! ~~~\n");
        }
    }
    else
    {
        setColor(COLOR_YELLOW);
        if (frame % 2 == 0)
        {
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|~~~~~~~\n");
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~(O)~~~~~~\n");
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~(_)~~~~~~\n");
        }
        else
        {
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|~~~~~~~\n");
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ (O) ~~~~~\n");
            printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~(_)~~~~~~\n");
        }
    }

    /* ---- deeper water, with a fish cruising past below ---- */
    setColor(COLOR_BLUE);
    if (frame % 2 == 0)
    {
        printf("   ~~~~~~~~~~~~><(((\u00b0>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
        printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    }
    else
    {
        printf("   ~~~~~~~~~~~~~~~~~><(((\u00b0>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
        printf("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    }

    /* ---- bottom frame + instruction box ---- */
    setColor(COLOR_GOLD);
    printf("   +================================================================+\n");
    drawFieldMessageBox(isBiting);
}

/* Keep fish, bar and gauge inside valid ranges. */
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

void drawFishingGame(int fishPos, int barPos, int barSize, int gauge)
{
    int i;
    int filled;

    setCursorPosition(0, 0);

    setColor(COLOR_LIGHTAQUA);
    printf(" +---------------------- FIGHT WINDOW ----------------------+\n");
    setColor(COLOR_GRAY);
    printf(" |          FISH POSITION        |        FISHING BAR        |\n");
    printf(" +-------------------------------+---------------------------+\n");

    for (i = 0; i < FIELD_HEIGHT; i++)
    {
        setColor(COLOR_GRAY);
        printf(" |");

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
        printf("|");

        if (i >= barPos && i < barPos + barSize)
        {
            printf("         ");
            setColor(COLOR_YELLOW);
            printPadded(BAR_SPRITE, 18);
        }
        else
        {
            printPadded("", 27);
        }

        setColor(COLOR_GRAY);
        printf("|\n");
    }

    setColor(COLOR_LIGHTAQUA);
    printf(" +----------------------------------------------------------+\n");

    filled = gauge / 5;
    setColor(COLOR_WHITE);
    printf("   PROGRESS: [");
    for (i = 0; i < 20; i++)
    {
        if (i < filled)
        {
            if (gauge > 70)
            {
                setColor(COLOR_GREEN);
            }
            else if (gauge > 30)
            {
                setColor(COLOR_YELLOW);
            }
            else
            {
                setColor(COLOR_RED);
            }
            printf("#");
        }
        else
        {
            setColor(COLOR_GRAY);
            printf("-");
        }
    }
    setColor(COLOR_WHITE);
    printf("] %d%%\n\n", gauge);

    drawMessageBox("[ W ] 위로 올리기 / [ S ] 아래로 내리기", "물고기를 낚시 바 내부에 유지하세요!");
}

DifficultySetting getDifficultySetting(int difficulty)
{
    DifficultySetting setting;

    setting.barSize = 3;
    setting.gaugeUp = 3;
    setting.gaugeDown = 3;
    setting.fishMoveRange = 1;
    setting.frameDelay = 140;
    setting.title = "Normal";

    if (difficulty == 1)
    {
        setting.barSize = 4;
        setting.gaugeUp = 4;
        setting.gaugeDown = 2;
        setting.fishMoveRange = 1;
        setting.frameDelay = 180;
        setting.title = "Easy";
    }
    else if (difficulty == 3)
    {
        setting.barSize = 2;
        setting.gaugeUp = 2;
        setting.gaugeDown = 4;
        setting.fishMoveRange = 2;
        setting.frameDelay = 100;
        setting.title = "Hard";
    }

    return setting;
}

int fishingMiniGame(int difficulty)
{
    int fishPos = FIELD_HEIGHT / 2;
    int barPos = FIELD_HEIGHT / 2;
    int gauge = START_GAUGE;
    int move;
    int key;
    DifficultySetting setting;

    setting = getDifficultySetting(difficulty);
    clampGameValues(&fishPos, &barPos, setting.barSize, &gauge);
    clearScreen();

    while (gauge > 0 && gauge < 100)
    {
        drawFishingGame(fishPos, barPos, setting.barSize, gauge);

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

        move = (rand() % (setting.fishMoveRange * 2 + 1)) - setting.fishMoveRange;
        fishPos += move;

        clampGameValues(&fishPos, &barPos, setting.barSize, &gauge);

        if (fishPos >= barPos && fishPos < barPos + setting.barSize)
        {
            gauge += setting.gaugeUp;
        }
        else
        {
            gauge -= setting.gaugeDown;
        }

        clampGameValues(&fishPos, &barPos, setting.barSize, &gauge);
        Sleep(setting.frameDelay);
    }

    if (gauge >= 100)
    {
        return 1;
    }

    return 0;
}

int selectDifficulty(void)
{
    int difficulty;

    drawTitleArt();

    setColor(COLOR_WHITE);
    printf("   [ 원하는 낚시 장소(난이도)를 선택하세요 ]\n\n");
    printf("   1. 마을 앞 잔잔한 시냇가   (Easy Mode)\n");
    printf("   2. 비밀의 숲 밤 호수       (Normal Mode)\n");
    printf("   3. 거친 파도의 바닷가      (Hard Mode)\n\n");

    drawMessageBox("장소에 따라 물고기의 움직임이 달라집니다.", "1 ~ 3 사이의 번호를 입력 후 Enter를 누르세요.");
    printf("\n 선택: ");

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
    int waitFrames;
    ULONGLONG biteStart;

    waitFrames = 8 + (rand() % 6);
    clearScreen();

    for (i = 0; i < waitFrames; i++)
    {
        drawWaitingSceneFixed(i, 0);
        Sleep(350);
    }

    while (_kbhit())
    {
        _getch();
    }

    biteStart = GetTickCount64();
    i = 0;

    while (GetTickCount64() - biteStart < 1800)
    {
        drawWaitingSceneFixed(i, 1);
        i++;

        if (_kbhit())
        {
            key = _getch();
            if (key == ' ')
            {
                clearScreen();
                return 1;
            }
        }
        Sleep(120);
    }

    clearScreen();
    drawMessageBox("아차차! 한발 늦었습니다.", "물고기가 미끼만 먹고 수면 아래로 도망쳤습니다.");
    Sleep(1500);
    return 0;
}

int askRetry(void)
{
    int retry;

    printf("\n");
    drawMessageBox("1. 다음 캐스팅을 준비한다", "2. 장비를 챙겨 집으로 돌아간다");
    printf("\n 선택: ");

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
    hideCursor();

    while (retry == 1)
    {
        difficulty = selectDifficulty();

        if (casting())
        {
            result = fishingMiniGame(difficulty);
        }
        else
        {
            result = 0;
        }

        clearScreen();
        if (result == 1)
        {
            setColor(COLOR_GREEN);
            printf("\n   HIT!!!\n\n");
            drawMessageBox("[ 대어 포획 성공! ]", "게이지를 끝까지 채워 물고기를 잡았습니다.");
        }
        else
        {
            setColor(COLOR_RED);
            printf("\n   FAIL...\n\n");
            drawMessageBox("[ 낚시 실패... ]", "입질 반응 또는 미니게임에서 물고기를 놓쳤습니다.");
        }

        retry = askRetry();
    }

    setColor(COLOR_WHITE);
    printf("\n은은한 노을을 뒤로하고 집으로 복귀합니다. 시스템을 종료합니다.\n");
    return 0;
}
