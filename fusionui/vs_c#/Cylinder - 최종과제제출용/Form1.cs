using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using ACTMULTILIB_K;
    


namespace simulator0612_2_
{
    public partial class Form1 : Form

    {
        ActEasyIF control = new ActEasyIF();

        // 센서 X 입력
        // 센서 X 입력
        const int B_전진센서 = 0x004;  // X02
        const int B_후진센서 = 0x008;  // X03
        const int C_후진센서 = 0x010;  // X04
        const int C_전진센서 = 0x020;  // X05

        const int 리프트A = 0x400;     // XA
        const int 리프트B = 0x800;     // XB

        // 출력 Y
        const short B_전진 = 0x002;   // Y01
        const short B_후진 = 0x004;   // Y02
        const short C_전진 = 0x008;   // Y03
        const short C_후진 = 0x010;   // Y04
        const short 전체정지 = 0x000;

        int step = 0;
        bool isConnected = false;


        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            lblStatus.Text = "초기상태";
            lblSensor.Text = "sensor: 0";

            timer1.Stop();

            btnStart.Enabled = true;
            btnStop.Enabled = false;
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            int result = control.Open();

            if (result == 0)
            {
                lblStatus.Text = "연결완료";
                isConnected = true;
            }
            else
            {
                lblStatus.Text = "연결실패";
                isConnected = false;
                MessageBox.Show("연결 실패 코드: " + result);
            }
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            if (isConnected == false)
            {
                MessageBox.Show("먼저 연결 버튼을 눌러주세요!");
                return;
            }

            step = 0;
            lblStatus.Text = "자동 동작 시작";

            btnStart.Enabled = false;
            btnStop.Enabled = true;

            timer1.Start();
        }

        private void btnStop_Click(object sender, EventArgs e)
        {
            timer1.Stop();

            if (isConnected == true)
            {
                short value = 전체정지;
                control.WriteDeviceBlock2("Y0", 1, ref value);
            }

            lblStatus.Text = "정지";  

            btnStart.Enabled = true;
            btnStop.Enabled = false;
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            if (isConnected == false)
            {
                return;
            }

            short sensor = 0;
            int result = control.ReadDeviceBlock2("X0", 1, out sensor);

            lblSensor.Text = "sensor: " + sensor +
                 " / binary: " + Convert.ToString(sensor, 2).PadLeft(6, '0') +
                 " / step: " + step;

            if (result != 0)
            {
                lblStatus.Text = "센서 읽기 실패 코드: " + result;
                return;
            }

            lblStatus.Text = "step: " + step + " / sensor: " + sensor;      

            // step 0: 2층 박스 감지 대기
            if (step == 0)
            {
                lblStatus.Text = "2층 박스 감지 대기";

                if (((int)sensor & 리프트A) != 0)
                {
                    short value = B_전진;
                    control.WriteDeviceBlock2("Y0", 1, ref value);

                    lblStatus.Text = "B실린더 전진";
                    step = 1;
                }
            }

            // step 1: B실린더 전진 완료 대기
            else if (step == 1)
            {
                if (((int)sensor & B_전진센서) != 0)
                {
                    short value = B_후진;
                    control.WriteDeviceBlock2("Y0", 1, ref value);

                    lblStatus.Text = "B실린더 후진";
                    step = 2;
                }
            }

            // step 2: B실린더 후진 완료 대기
            else if (step == 2)
            {
                if (((int)sensor & B_후진센서) != 0)
                {
                    short value = 전체정지;
                    control.WriteDeviceBlock2("Y0", 1, ref value);

                    lblStatus.Text = "1층 박스 감지 대기";
                    step = 3;
                }
            }

            // step 3: 1층 박스 감지 대기
            else if (step == 3)
            {
                if (((int)sensor & 리프트B) != 0)
                {
                    short value = C_전진;
                    control.WriteDeviceBlock2("Y0", 1, ref value);

                    lblStatus.Text = "C실린더 전진";
                    step = 4;
                }
            }

            // step 4: C실린더 전진 완료 대기
            else if (step == 4)
            {
                if (((int)sensor & C_전진센서) != 0)
                {
                    short value = C_후진;
                    control.WriteDeviceBlock2("Y0", 1, ref value);

                    lblStatus.Text = "C실린더 후진";
                    step = 5;
                }
            }

            // step 5: C실린더 후진 완료 대기
            else if (step == 5)
            {
                if (((int)sensor & C_후진센서) != 0)
                {
                    short value = 전체정지;
                    control.WriteDeviceBlock2("Y0", 1, ref value);

                    lblStatus.Text = "1회 동작 완료 - 다시 대기";
                    step = 0;
                }
            }
        }
    }
}
