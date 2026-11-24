import json
import math
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor, Color, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "Sejong_Population_Forecast_Report_Draft.pdf"
GRID = json.loads((ROOT / "sample.json").read_text(encoding="utf-8"))
WIDTH, HEIGHT = A4
LEFT, RIGHT = 47, WIDTH - 47
BODY = RIGHT - LEFT
INK = HexColor("#18303A")
MUTED = HexColor("#516773")
TEAL = HexColor("#006A61")
TINT = HexColor("#E8F4EF")
LINE = HexColor("#D7E3E0")
FAINT = HexColor("#F3F7F6")
ZERO = HexColor("#E4EBEA")

pdfmetrics.registerFont(TTFont("Malgun", r"C:\Windows\Fonts\malgun.ttf"))
pdfmetrics.registerFont(TTFont("MalgunBold", r"C:\Windows\Fonts\malgunbd.ttf"))

pdf = Canvas(str(OUT), pagesize=A4, pageCompression=1)
pdf.setTitle("세종시 시간대별 추정인구 예측과 오차 분석")
pdf.setAuthor("도형준")
pdf.setSubject("인공지능학습데이터전처리 | 분석 설계 및 원본 샘플 확인")


def para(text, x, top, width=BODY, size=10, color=INK, bold=False, leading=None):
    style = ParagraphStyle(
        "text", fontName="MalgunBold" if bold else "Malgun",
        fontSize=size, leading=leading or size * 1.62, textColor=color,
        alignment=TA_LEFT, wordWrap="CJK", splitLongWords=False,
    )
    paragraph = Paragraph(escape(text), style)
    _, height = paragraph.wrap(width, 800)
    paragraph.drawOn(pdf, x, top - height)
    return top - height


def rule(y, color=LINE):
    pdf.setStrokeColor(color)
    pdf.setLineWidth(0.6)
    pdf.line(LEFT, y, RIGHT, y)


def header(page, title, summary):
    pdf.setFillColor(TEAL)
    pdf.rect(LEFT, HEIGHT - 51, 25, 3, stroke=0, fill=1)
    para("인공지능학습데이터전처리  /  도형준", LEFT, HEIGHT - 63, size=9, color=TEAL, bold=True)
    para("분석 설계 초안", RIGHT - 81, HEIGHT - 63, width=81, size=9, color=TEAL, bold=True)
    title_bottom = para(title, LEFT, HEIGHT - 91, size=24, bold=True, leading=35)
    summary_bottom = para(summary, LEFT, title_bottom - 8, size=10.5, color=MUTED)
    rule(summary_bottom - 15)
    rule(49)
    para("세종시 500 m 격자  |  30~39세 남성  |  2시간 단위", LEFT, 37, size=8, color=MUTED)
    pdf.setFont("MalgunBold", 9)
    pdf.setFillColor(TEAL)
    pdf.drawRightString(RIGHT, 24, f"{page} / 3")
    return summary_bottom - 32


def sub(title, y):
    return para(title, LEFT, y, size=13, bold=True, color=TEAL) - 5


def table(rows, widths, top):
    y = top
    for index, row in enumerate(rows):
        header_row = index == 0
        row_h = 32 if header_row else 44
        pdf.setFillColor(TEAL if header_row else (FAINT if index % 2 else white))
        pdf.rect(LEFT, y - row_h, BODY, row_h, stroke=0, fill=1)
        x = LEFT
        for col, value in enumerate(row):
            bottom = para(
                value, x + 11, y - 8, widths[col] - 22, size=9.1,
                leading=13.2, bold=header_row or col == 0,
                color=white if header_row else INK,
            )
            assert bottom >= y - row_h + 2, (index, col, value)
            x += widths[col]
        y -= row_h
    rule(y)
    return y


def entry(title, body, y):
    y = para(title, LEFT, y, size=10.3, bold=True) - 1.5
    return para(body, LEFT, y, size=9.5, leading=15.2) - 10


def note(text, y):
    pdf.setFillColor(TINT)
    height = 46
    pdf.roundRect(LEFT, y - height, BODY, height, 7, stroke=0, fill=1)
    bottom = para(text, LEFT + 12, y - 9, BODY - 24, size=9.1, leading=13.5)
    assert bottom >= y - height + 4
    return y - height


def scale_color(value):
    if value == 0:
        return ZERO
    start, end = (0.73, 0.90, 0.85), (0.02, 0.25, 0.29)
    ratio = math.log1p(value) / math.log1p(2523.21)
    return Color(*(a + ratio * (b - a) for a, b in zip(start, end)))


def sample_figure(y):
    origin_x = LEFT + 16
    cell_size = 2.33
    top = y - 13
    for row, values in enumerate(GRID):
        for col, value in enumerate(values):
            pdf.setFillColor(scale_color(value))
            pdf.rect(
                origin_x + col * cell_size,
                top - (row + 1) * cell_size,
                cell_size + 0.12, cell_size + 0.12, stroke=0, fill=1,
            )
    bottom = top - 72 * cell_size
    pdf.setStrokeColor(LINE)
    pdf.rect(origin_x, bottom, 49 * cell_size, 72 * cell_size, stroke=1, fill=0)
    para("1", origin_x - 10, top + 5, width=10, size=6, color=MUTED)
    para("72", origin_x - 13, bottom + 7, width=13, size=6, color=MUTED)
    para("1", origin_x, bottom - 1, width=13, size=6, color=MUTED)
    para("49열", origin_x + 49 * cell_size - 15, bottom - 1, width=27, size=6, color=MUTED)
    for index, (value, label) in enumerate([(0, "0"), (1, "1"), (100, "100"), (2523.21, "2,523")]):
        x = origin_x + index * 31
        pdf.setFillColor(scale_color(value))
        pdf.rect(x, bottom - 26, 7, 7, fill=1, stroke=0)
        para(label, x + 9, bottom - 18, width=28, size=6, color=MUTED)
    x = LEFT + 160
    para("2021.06.01  00:00~01:59", x, y - 11, RIGHT - x, size=12, bold=True)
    para("72행 × 49열  ·  3,528칸", x, y - 39, RIGHT - x, size=11, bold=True, color=TEAL)
    y2 = para(
        "0인 칸 1,859개(52.7%), 양수 칸 1,669개, 빈칸 0개. "
        "최댓값은 23행 21열의 2,523.21이다.",
        x, y - 62, RIGHT - x, size=9.5,
    )
    y2 = para(
        "세로는 원본 행, 가로는 원본 열이다. 값 차이가 큰 칸도 함께 보이도록 "
        "양수 칸의 색에는 로그 눈금을 적용했다. 격자 좌표 자료를 확보하면 실제 지도에 연결할 수 있다.",
        x, y2 - 8, RIGHT - x, size=9.4, color=MUTED,
    )
    para(
        "원본 파일  20210601_m_3039_H_T_0001.csv",
        x, y2 - 8, RIGHT - x, size=8.2, color=MUTED,
    )
    return bottom - 38


y = header(
    1, "세종시 시간대별 추정인구\n예측과 오차 분석".replace("\n", " "),
    "과거 2시간 단위 격자 자료로 2024년 1~5월 추정인구를 예측하고, "
    "일별 변화와 지역별 오차를 원본 추정치와 비교한다.",
)
y = sub("실험 기간", y)
y = table([
    ("단계", "사용 기간", "사용 목적"),
    ("학습·검증", "2021.06.01~2023.12.31", "시간순으로 학습하고 전처리·모델을 비교"),
    ("최종 테스트", "2024.01.01~2024.05.31", "저장한 예측을 원본과 비교해 성능을 평가"),
], [96, 146, BODY - 242], y)
y = para(
    "테스트는 152일이다. 하루 12개 시간대가 모두 있으면 격자당 예측값 1,824개를 비교할 수 있다.",
    LEFT, y - 8, size=9.3, color=MUTED,
) - 16
y = sub("원본 샘플 확인", y)
y = sample_figure(y)
y = note(
    "현재 확인 범위는 위의 2시간 구간 한 개다. 전체 원본을 확보한 뒤 학습, 2024년 성능평가, 지역별 사례 분석을 완료한다.",
    y,
)
assert y > 64, y
pdf.showPage()

y = header(
    2, "전처리·모델링·학습",
    "예측 시점은 2023년 12월 말로 고정한다. 날짜, 시간대와 과거 인구 요약 정보를 "
    "이용해 목표 기간의 각 구간을 직접 예측한다.",
)
y = sub("전처리", y)
y = entry(
    "원본 적재와 품질 검사",
    "파일명에서 날짜·시간대를 읽고, 72행 × 49열 구조와 숫자값을 확인한다. "
    "파일 누락·중복과 크기 불일치를 기록한다. 0과 소수는 유지하고, 누락 값을 별도로 기록한다.", y,
)
y = entry(
    "격자와 시간의 정렬",
    "날짜·시간대·행·열을 결합해 관측값의 키를 만든다. 파일마다 동일한 격자 배치인지 확인한다. "
    "지도 자료를 연결할 경우 좌표계·격자 원점·행 방향과 분석 경계를 확인한다.", y,
)
y = sub("모델 입력과 비교 실험", y - 1)
y = table([
    ("실험", "입력과 예측 방식"),
    ("기준 예측", "같은 격자·월·요일·시간대의 과거 평균. 표본이 부족하면 같은 격자·요일·시간대로 범위를 넓힌다."),
    ("기본 모델", "Dense 회귀 모델에 격자 위치, 월, 요일, 2시간 구간, 공휴일 정보를 입력한다."),
    ("개선 실험", "같은 모델에 과거 동일 시간대의 인구 평균·변동폭을 추가해 오차가 줄었는지 비교한다."),
], [103, BODY - 103], y)
y = para(
    "과거 인구 요약값은 각 학습 예측 기준일보다 앞선 기록으로 계산한다. "
    "격자별 공간 특성이나 기후 평년값은 자료와 기준 시점이 확인되면 별도 실험으로 추가할 수 있다.",
    LEFT, y - 8, size=9.4, color=MUTED,
) - 13
y = sub("시간순 검증과 최종 학습", y)
y = entry(
    "2023년 1~5월 모의 평가",
    "2022년 말까지 쌓인 데이터로 2023년 1~5월을 예측한다. 기준 예측·기본 모델·개선 모델을 "
    "같은 날짜와 격자에서 비교하고, 결측 처리·입력 조합·모델 설정을 확정한다.", y,
)
y = entry(
    "2024년 예측과 평가 순서",
    "선택한 모델을 2023년 말까지 자료로 다시 학습한 후 2024년 예측값을 저장한다. "
    "테스트 원본은 저장한 예측과 대조할 때 사용한다. 2024년 실제 날씨는 오차 사례를 해석할 때 참고한다.", y,
)
assert y > 64, y
pdf.showPage()

y = header(
    3, "성능평가와 고찰",
    "전체 평균으로 보이는 인구 변화가 어느 시간대와 격자에서 나타났는지 확인하고, "
    "모델이 변화를 따라간 곳과 놓친 곳을 원본에서 살펴본다.",
)
y = sub("평가 기준", y)
y = table([
    ("비교 단위", "계산 방법"),
    ("2시간 추정인구", "같은 날짜·시간대·격자의 예측과 원본을 비교해 평균절대오차(MAE)를 계산한다."),
    ("일별 추정인구", "같은 격자 범위에서 2시간 구간별 합계를 구하고, 유효한 12구간이 있는 날의 평균을 비교한다."),
    ("일별 변화량", "당일 평균에서 전날 평균을 뺀다. 1월 2일부터 비교해 변화량 MAE와 증가·감소 방향을 확인한다."),
], [110, BODY - 110], y)
y = para(
    "일별 집계는 하루 12구간 평균으로 정의했다. 일부 격자의 과대·과소예측은 전체 합계에서 상쇄될 수 있어 "
    "전체 그래프와 격자별 오차를 함께 본다.",
    LEFT, y - 8, size=9.4, color=MUTED,
) - 15
y = sub("보고서에 넣을 그림과 해석", y)
y = entry(
    "일별 원본·예측과 전날 대비 변화량",
    "152일의 원본과 예측을 같은 축에 그린다. 날짜별 오차와 변화량 오차를 비교하고, "
    "두 지표에서 오차가 큰 날이 일치하는지 확인한다.", y,
)
y = entry(
    "변화가 큰 날의 격자 비교",
    "원본 변화량, 예측 변화량, 변화량 오차를 각각 격자 그림으로 표시한다. "
    "과거 자료로 정한 급변 기준을 적용해 해당 날짜에 기준을 넘은 칸의 수와 비율을 계산한다.", y,
)
y = entry(
    "대표 사례와 데이터 개선의 효과",
    "급변을 놓친 격자, 급변을 따라간 격자, 같은 날 안정적이었던 격자의 2시간 곡선을 비교한다. "
    "오차가 집중된 시간대를 찾고, 공휴일·날씨·지역 특성으로 설명할 근거가 있는지 확인한다.", y,
)
y = note(
    "고찰에는 급변 격자 수와 비율, 대표 격자의 변화량 차이, 오차가 컸던 시간대, "
    "전처리 변경 전후의 지표를 실제 계산 결과로 채운다.",
    y - 1,
)
assert y > 64, y
pdf.showPage()
pdf.save()
