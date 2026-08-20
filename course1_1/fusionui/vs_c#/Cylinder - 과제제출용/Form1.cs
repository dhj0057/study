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

namespace Cylinder
{
    public partial class Form1 : Form

    {ActEasyIF control = new ActEasyIF();
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if(control.Open()== 0)
            {
                MessageBox.Show("연결되었습니다.");
                timer1.Enabled = true;
            }
            else
            {
                MessageBox.Show("연결실패하였습니다.");
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            //전진
            short value = 0x01 << 1;
            control.WriteDeviceBlock2("Y0", 1, ref value);
        }

        private void button3_Click(object sender, EventArgs e)
        {
            //후진
            short value = 0x01 << 2;
            control.WriteDeviceBlock2("Y0", 1, ref value);
        }

        private void button4_Click(object sender, EventArgs e)
        {
            //전진센서 X02
            //후진센서 X03


            short sensor = 0;
            control.ReadDeviceBlock2("X0", 1, out sensor);

            if (((int)(sensor) & 0x04) != 0)
                label1.Text = "전진";

            if (((int)(sensor) & 0x08) != 0)
                label1.Text = "후진";
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            short sensor = 0;
            control.ReadDeviceBlock2("X0", 1, out sensor);

            if (((int)(sensor) & 0x04) != 0)
                label1.Text = "전진";

            if (((int)(sensor) & 0x08) != 0)
                label1.Text = "후진";
        }

 

        private void button5_Click(object sender, EventArgs e)
        {
            timer2.Enabled = true;
        }

        private void button6_Click(object sender, EventArgs e)
        {
            timer2.Enabled = false;
        }

        private void timer2_Tick(object sender, EventArgs e)
        {
            short sensor = 0;
            control.ReadDeviceBlock2("X0", 1, out sensor);

            if (((int)(sensor) & 0x04) != 0)
            {
                short value = 0x01 << 2;
                control.WriteDeviceBlock2("Y0", 1, ref value);

            }
            if (((int)(sensor) & 0x08) != 0)
            {
                short value = 0x01 << 1;
                control.WriteDeviceBlock2("Y0", 1, ref value);
            }
        }
    }
}
