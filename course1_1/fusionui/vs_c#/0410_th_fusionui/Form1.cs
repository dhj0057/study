using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace _0410_th_fusionui
{
    public partial class Form1 : Form
    {
        int i = 0;

        public Form1()
        {
            InitializeComponent();
           
            myButton.Text = "코드에서";
            myButton.Width = 600;
            

        }


        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {

        }

        private void btn1_clicked(object sender, EventArgs e) // UI 에서 클릭 이벤트를 배우는것 버튼1 눌렀을때 lable, textbox에 +추가했음 
        {
            textBox1.Text += "+";
            label1.Text += "+";
            
            
            Button btn = new Button();
            Controls.Add(btn);
            btn.Location = new Point(13, (13 + 23 + 3) * i);
            btn.Text = "동적생성" + i + "번째";
            i++;

        }
    }
}
