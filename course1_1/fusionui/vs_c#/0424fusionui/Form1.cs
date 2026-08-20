using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace _0424fusionui
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        private double elapsedTime = 0.0;
        private void timer1_Tick(object sender, EventArgs e)
        {
            elapsedTime++;
            textBox1.Text = elapsedTime * 0.02 + "초경과";
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            timer1.Enabled = !timer1.Enabled;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            label1.Text += "\n" + (elapsedTime * 0.02).ToString("F2") + "초";
            if (elapsedTime * 0.02 == 2.00)
                textBox2.Text = "★ 성공 ★";
            else
                textBox2.Text = "★ 실패 ★";

        }

        private void button3_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            timer1.Enabled = false;
            elapsedTime = 0.0;
            textBox1.Text = "0.00초 경과";
            label1.Text = "일시정지기록 ";
        
        }


    }
}
