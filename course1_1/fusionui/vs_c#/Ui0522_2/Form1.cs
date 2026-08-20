using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Ui0522_2
{
    public partial class Form1 : Form
    {
        Random random = new Random();

        public Form1()
        {
            InitializeComponent();
        }
        private void AddGraphPoint(int value)
        {
            if (chart1.Series[0].Points.Count > 50)
                chart1.Series[0].Points.RemoveAt(0);

            chart1.Series[0].Points.AddXY(DateTime.Now.ToString(), value);
            chart1.ChartAreas[0].RecalculateAxesScale();
        }
        private void High_button_clicked_Click(object sender, EventArgs e)
        {
            AddGraphPoint(1);
        }

        private void Low_button_clicked_Click(object sender, EventArgs e)
        {
            AddGraphPoint(0);
        }

       
        private void START_BUTTON_Click(object sender, EventArgs e)
        {
            timer1.Start();
        }

        private void END_BUTTON_Click(object sender, EventArgs e)
        {
            timer1.Stop();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            int value = random.Next(0, 11);
            AddGraphPoint(value);
        }
    }

}
