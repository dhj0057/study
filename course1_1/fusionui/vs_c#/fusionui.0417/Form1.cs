using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace fusionui._0417
{
    public partial class form1 : Form
    {
        public form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "1";   
        }

        private void button2_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "2";
        }
       
        private void button3_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "3";
        }

        private void button4_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "4";
        }

        private void button5_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "5";
        }

        private void button6_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "6";
        }

        private void button7_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "7";
        }

        private void button8_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "8";
        }

        private void button9_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "9";
        }

        private void button10_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text += "0";
        }

        private void button11_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            result.Text  = string.Empty;
        }
        int firstNUM;
        int secondNUM;
        int resultNUM;
        string Relation; 
        private void button12_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
           
            firstNUM = int.Parse(result.Text);

            Relation = "+";
            
            result.Text = string.Empty;
       
        }

        private void button13_Click(object sender, EventArgs e)
        {
            Button button = (Button)(sender);
          
            secondNUM = int.Parse(result.Text);

            if (Relation == "+")
            {
                resultNUM = firstNUM + secondNUM;
            }
            else
            {
                resultNUM = firstNUM - secondNUM;
            }

            result.Text = resultNUM.ToString();


        }
      
        private void button14_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;

            firstNUM = int.Parse(result.Text);

            Relation = "-";

            result.Text = string.Empty;

        }
    }
}
