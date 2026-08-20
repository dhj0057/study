using ACTMULTILIB_K;
using System;
using System.Windows.Forms;

namespace final_Assignment
{
    public partial class Form1 : Form
    {

        private readonly ActEasyIF control = new ActEasyIF();

        private bool autoMode = false;
        private bool isConnected = false;
        private int autoStep = 0;

        private const int LOGICAL_STATION_NUMBER = 6;
        private const string X_DEVICE = "X0";
        private const string Y_DEVICE = "Y0";

        // X 입력 센서
        private const short X_B_FORWARD = 0x0004;     // X02: B실린더 전진
        private const short X_B_BACK = 0x0008;        // X03: B실린더 후진
        private const short X_C_BACK = 0x0010;        // X04: C실린더 후진
        private const short X_C_FORWARD = 0x0020;     // X05: C실린더 전진

        private const short X_LIFTA_UP = 0x0040;      // X6: LiftA Up
        private const short X_LIFTA_DOWN = 0x0080;    // X7: LiftA Down
        private const short X_LIFTB_UP = 0x0100;      // X8: LiftB Up
        private const short X_LIFTB_DOWN = 0x0200;    // X9: LiftB Down

        private const short X_SENSOR_A = 0x0400;      // XA: 리프트센서A
        private const short X_SENSOR_B = 0x0800;      // XB: 리프트센서B

        // Y 출력 장치
        private const short Y_B_FORWARD = 0x0002;     // Y01: B실린더 전진
        private const short Y_B_BACK = 0x0004;        // Y02: B실린더 후진
        private const short Y_C_FORWARD = 0x0008;     // Y03: C실린더 전진
        private const short Y_C_BACK = 0x0010;        // Y04: C실린더 후진

        private const short Y_LIFTA_UP = 0x0020;      // Y5: LiftA Up
        private const short Y_LIFTA_DOWN = 0x0040;    // Y6: LiftA Down
        private const short Y_LIFTB_DOWN = 0x0080;    // Y7: LiftB Down
        private const short Y_LIFTB_UP = 0x0100;      // Y8: LiftB Up


        public Form1()

        {
            InitializeComponent();

            timer1.Enabled = false;
            timer1.Interval = 500;
        }
        private bool IsOn(short sensor, short bit)
        {
            return (sensor & bit) != 0;
        }

        private string OnOff(bool value)
        {
            return value ? "ON" : "OFF";
        }

        private bool WriteY(short value)
        {
            if (!isConnected)
            {
                labelStatus.Text = "현재 상태: PLC 미연결";
                return false;
            }

            try
            {
                int result = control.WriteDeviceBlock2(Y_DEVICE, 1, ref value);

                if (result != 0)
                {
                    labelStatus.Text = "현재 상태: 출력 실패 코드 " + result;
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                timer1.Enabled = false;
                isConnected = false;
                autoMode = false;

                MessageBox.Show("출력 오류: " + ex.Message);
                labelStatus.Text = "현재 상태: PLC 출력 예외 발생";
                return false;
            }
        }

        private bool ReadSensor(out short sensor)
        {
            sensor = 0;

            if (!isConnected)
            {
                return false;
            }

            try
            {
                int result = control.ReadDeviceBlock2(X_DEVICE, 1, out sensor);

                if (result != 0)
                {
                    labelStatus.Text = "현재 상태: 센서 읽기 실패 코드 " + result;
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                timer1.Enabled = false;
                isConnected = false;
                autoMode = false;

                MessageBox.Show("센서 읽기 오류: " + ex.Message);
                labelStatus.Text = "현재 상태: 센서 읽기 예외 발생";
                return false;
            }
        }

        
        
        private void UpdateSensorLabel(short sensor)
        {
            labelSensor.Text =
                "X0 전체값: " + sensor + "\n\n" +
                "B전진 X02: " + OnOff(IsOn(sensor, X_B_FORWARD)) + "\n" +
                "B후진 X03: " + OnOff(IsOn(sensor, X_B_BACK)) + "\n" +
                "C전진 X05: " + OnOff(IsOn(sensor, X_C_FORWARD)) + "\n" +
                "C후진 X04: " + OnOff(IsOn(sensor, X_C_BACK)) + "\n" +
                "LiftA Up X6: " + OnOff(IsOn(sensor, X_LIFTA_UP)) + "\n" +
                "LiftA Down X7: " + OnOff(IsOn(sensor, X_LIFTA_DOWN)) + "\n" +
                "LiftB Up X8: " + OnOff(IsOn(sensor, X_LIFTB_UP)) + "\n" +
                "LiftB Down X9: " + OnOff(IsOn(sensor, X_LIFTB_DOWN)) + "\n" +
                "센서A XA: " + OnOff(IsOn(sensor, X_SENSOR_A)) + "\n" +
                "센서B XB: " + OnOff(IsOn(sensor, X_SENSOR_B));
        }
        private void ManualOutput(short outputValue, string statusText)
        {
            if (WriteY(outputValue))
            {
                labelStatus.Text = "현재 상태: " + statusText;
            }
        }



        private void buttonConnect_Click(object sender, EventArgs e)
        {
            try
            {
                control.ActLogicalStationNumber = LOGICAL_STATION_NUMBER;

                int openResult = control.Open();

                if (openResult == 0)
                {
                    isConnected = true;
                    timer1.Enabled = true;

                    MessageBox.Show("연결되었습니다.");
                    labelStatus.Text = "현재 상태: PLC 연결 성공";
                }
                else
                {
                    isConnected = false;
                    timer1.Enabled = false;

                    MessageBox.Show("연결실패 코드: " + openResult);
                    labelStatus.Text = "현재 상태: PLC 연결 실패";
                }
            }
            catch (Exception ex)
            {
                isConnected = false;
                timer1.Enabled = false;

                MessageBox.Show("연결 중 오류 발생: " + ex.Message);
                labelStatus.Text = "현재 상태: PLC 연결 오류";
            }
        }

        private void buttonBForward_Click(object sender, EventArgs e)
        {
            ManualOutput(Y_B_FORWARD, "B실린더 전진");
        }

        private void buttonBBack_Click(object sender, EventArgs e)
        {
            ManualOutput(Y_B_BACK, "B실린더 후진");
        }

        private void buttonCForward_Click(object sender, EventArgs e)
        {
            ManualOutput(Y_C_FORWARD, "C실린더 전진");
        }

        private void buttonCBack_Click(object sender, EventArgs e)
        {
            ManualOutput(Y_C_BACK, "C실린더 후진");
        }

        private void buttonLiftAUp_Click(object sender, EventArgs e)
        {
            ManualOutput(Y_LIFTA_UP, "LiftA 상승");
        }

        private void buttonLiftADown_Click(object sender, EventArgs e)
        {
            ManualOutput(Y_LIFTA_DOWN, "LiftA 하강");
        }

        private void buttonLiftBUp_Click(object sender, EventArgs e)
        {
            ManualOutput(Y_LIFTB_UP, "LiftB 상승");
        }

        private void buttonLiftBDown_Click(object sender, EventArgs e)
        {
            ManualOutput(Y_LIFTB_DOWN, "LiftB 하강");
        }

        private void buttonAutoStart_Click(object sender, EventArgs e)
        {
            if (!isConnected)
            {
                MessageBox.Show("PLC 연결 후 자동운전을 시작하세요.");
                return;
            }

            autoMode = true;
            autoStep = -4;     // 초기정렬 단계부터 시작
            WriteY(0);

            labelStatus.Text = "자동운전 시작: 초기정렬 시작";
        }

        private void buttonAutoStop_Click(object sender, EventArgs e)
        {
            autoMode = false;
            autoStep = 0;
            WriteY(0);

            labelStatus.Text = "현재 상태: 자동운전 정지";
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            short sensor;

            if (!ReadSensor(out sensor))
            {
                return;
            }

            UpdateSensorLabel(sensor);

            if (autoMode)
            {
                RunAutoSequence(sensor);
            }
        }
       
        private void RunAutoSequence(short sensor)
        {
            switch (autoStep)
            {
                case -4:
                    labelStatus.Text = "초기정렬: B실린더 후진";
                    WriteY(Y_B_BACK);

                    if (IsOn(sensor, X_B_BACK))
                    {
                        WriteY(0);
                        autoStep = -3;
                    }
                    break;

                case -3:
                    labelStatus.Text = "초기정렬: C실린더 후진";
                    WriteY(Y_C_BACK);

                    if (IsOn(sensor, X_C_BACK))
                    {
                        WriteY(0);
                        autoStep = -2;
                    }
                    break;

                case -2:
                    labelStatus.Text = "초기정렬: LiftA 상승";
                    WriteY(Y_LIFTA_UP);

                    if (IsOn(sensor, X_LIFTA_UP))
                    {
                        WriteY(0);
                        autoStep = -1;
                    }
                    break;

                case -1:
                    labelStatus.Text = "초기정렬: LiftB 상승";
                    WriteY(Y_LIFTB_UP);

                    if (IsOn(sensor, X_LIFTB_UP))
                    {
                        WriteY(0);
                        autoStep = 0;
                    }
                    break;

                case 0:
                    labelStatus.Text = "자동운전 0단계: 센서A 대기";

                    if (IsOn(sensor, X_SENSOR_A))
                    {
                        autoStep = 1;
                    }
                    break;

                case 1:
                    labelStatus.Text = "자동운전 1단계: LiftA 상승";
                    WriteY(Y_LIFTA_UP);

                    if (IsOn(sensor, X_LIFTA_UP))
                    {
                        WriteY(0);
                        autoStep = 2;
                    }
                    break;

                case 2:
                    labelStatus.Text = "자동운전 2단계: B실린더 전진";
                    WriteY(Y_B_FORWARD);

                    if (IsOn(sensor, X_B_FORWARD))
                    {
                        WriteY(0);
                        autoStep = 3;
                    }
                    break;

                case 3:
                    labelStatus.Text = "자동운전 3단계: B실린더 후진";
                    WriteY(Y_B_BACK);

                    if (IsOn(sensor, X_B_BACK))
                    {
                        WriteY(0);
                        autoStep = 4;
                    }
                    break;

                case 4:
                    labelStatus.Text = "자동운전 4단계: LiftA 하강";
                    WriteY(Y_LIFTA_DOWN);

                    if (IsOn(sensor, X_LIFTA_DOWN))
                    {
                        WriteY(0);
                        autoStep = 5;
                    }
                    break;

                case 5:
                    labelStatus.Text = "자동운전 5단계: 센서B 대기";

                    if (IsOn(sensor, X_SENSOR_B))
                    {
                        autoStep = 6;
                    }
                    break;

                case 6:
                    labelStatus.Text = "자동운전 6단계: LiftB 하강";
                    WriteY(Y_LIFTB_DOWN);

                    if (IsOn(sensor, X_LIFTB_DOWN))
                    {
                        WriteY(0);
                        autoStep = 7;
                    }
                    break;

                case 7:
                    labelStatus.Text = "자동운전 7단계: C실린더 전진";
                    WriteY(Y_C_FORWARD);

                    if (IsOn(sensor, X_C_FORWARD))
                    {
                        WriteY(0);
                        autoStep = 8;
                    }
                    break;

                case 8:
                    labelStatus.Text = "자동운전 8단계: C실린더 후진";
                    WriteY(Y_C_BACK);

                    if (IsOn(sensor, X_C_BACK))
                    {
                        WriteY(0);
                        autoStep = 9;
                    }
                    break;

                case 9:
                    labelStatus.Text = "자동운전 9단계: LiftB 상승";
                    WriteY(Y_LIFTB_UP);

                    if (IsOn(sensor, X_LIFTB_UP))
                    {
                        WriteY(0);
                        autoStep = 0;
                    }
                    break;

                default:
                    WriteY(0);
                    autoMode = false;
                    autoStep = 0;
                    labelStatus.Text = "자동운전 오류: 알 수 없는 단계";
                    break;
            }
        }
    }
}




