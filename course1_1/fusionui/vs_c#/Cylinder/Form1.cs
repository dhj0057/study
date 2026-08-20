using ACTMULTILIB_K;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace Cylinder
{
    public partial class Form1 : Form

    {   ActEasyIF control = new ActEasyIF();

        string backImagePath;
        string forwardImagePath;

        public Form1()
        {
            InitializeComponent();
            this.Load += Form1_Load;

        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (control.Open() == 0)
            {
                MessageBox.Show("연결되었습니다.");
                timer1.Enabled = true;
            }
            else
            {
                MessageBox.Show("연결실패하였습니다.");
                timer1.Enabled = false;
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // 전진
            short value = 0x01 << 1;
            control.WriteDeviceBlock2("Y0", 1, ref value);

            label1.Text = "전진";
            pictureBox1.ImageLocation = forwardImagePath;
        }

        private void button3_Click(object sender, EventArgs e)
        {
            // 후진
            short value = 0x01 << 2;
            control.WriteDeviceBlock2("Y0", 1, ref value);

            label1.Text = "후진";
            pictureBox1.ImageLocation = backImagePath;
        }



        private void timer1_Tick(object sender, EventArgs e)
        {
            short sensor = 0;

            int result = control.ReadDeviceBlock2("X0", 1, out sensor);

            if (result != 0)
            {
                label1.Text = "센서 읽기 실패";
                return;
            }

            if (chart1.Series[0].Points.Count > 20)
            {
                chart1.Series[0].Points.RemoveAt(0);
            }

            if (((int)(sensor) & 0x04) != 0)
            {
                label1.Text = "전진";
                chart1.Series[0].Points.AddXY(DateTime.Now.ToString("HH:mm:ss"), 1);
                pictureBox1.ImageLocation = forwardImagePath;
            }

            if (((int)(sensor) & 0x08) != 0)
            {
                label1.Text = "후진";
                chart1.Series[0].Points.AddXY(DateTime.Now.ToString("HH:mm:ss"), 0);
                pictureBox1.ImageLocation = backImagePath;
            }
        }

 

        private void Form1_Load(object sender, EventArgs e)
        {
            backImagePath = Path.Combine(Application.StartupPath, "cylinderoff.png");
            forwardImagePath = Path.Combine(Application.StartupPath, "cylinderon.png");

            pictureBox1.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox1.ImageLocation = backImagePath;

            label1.Text = "초기상태";

            timer1.Enabled = false;

            chart1.Series.Clear();

            Series series = new Series("실린더 상태");
            series.ChartType = SeriesChartType.Line;
            chart1.Series.Add(series);

            chart1.ChartAreas[0].AxisY.Minimum = 0;
            chart1.ChartAreas[0].AxisY.Maximum = 1;
            chart1.ChartAreas[0].AxisY.Interval = 1;
        }
    }
}
