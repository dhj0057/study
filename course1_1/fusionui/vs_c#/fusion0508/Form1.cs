using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace fusion0508
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Form2 child = new Form2();
            child.SetTextBox(textBox1);
            child.SetMyTextBoxText("Form1에서 수정");
            child.ShowDialog();
            MessageBox.Show("TEST");
        }



        private void 종료ToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void toolStripStatusLabel1_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            toolStripStatusLabel1.Text = "코드에서 바꿈.";
        }

        private void toolStripStatusLabel2_Click(object sender, EventArgs e)
        {

        }

        private void button3_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("notepad.exe");
        }

        private void label1_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("notepad.exe");
        }

        private void button4_Click(object sender, EventArgs e)
        {
            List<string>strings= new List<string>();

            foreach (var item in Controls)
            {
                if(item is CheckBox)
                {
                    CheckBox checkBox = (CheckBox)item;
                    if(checkBox.Checked)
                    {
                        strings.Add(checkBox.Text);
                    }
                }
            }
            MessageBox.Show(string.Join(",", strings));
        }

        private void button5_Click(object sender, EventArgs e)
        {
            string strings = "";
           
            foreach (var item in Controls)
            {
                if (item is RadioButton)
                {
                    RadioButton checkBox = (RadioButton)item;
                    if (checkBox.Checked)
                    {
                        strings = checkBox.Text;
                        break;
                    }
                }
            }
            MessageBox.Show(strings);
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }
        private void button6_Click(object sender, EventArgs e)
        {
            int index = comboBox1.SelectedIndex;
          
        }

        private void button7_Click(object sender, EventArgs e)
        {
            int index = listBox1.SelectedIndex;

            if (index < 0)
                return;

            bindingSource1.Add(listBox1.Items[index]);
            productBindingSource.RemoveAt(index);
        }

        private void button8_Click(object sender, EventArgs e)
        {
            int index = listBox2.SelectedIndex;

            if (index < 0)
                return;

            productBindingSource.Add(listBox1.Items[index]);
            bindingSource1.RemoveAt(index);
        }
                    
        private void Form1_Load(object sender, EventArgs e)
        {
            productBindingSource.Add(
                new Product()
                {
                    Name = "사과",
                    Price = 5000
                });
            productBindingSource.Add(
                new Product()
                {
                    Name = "포도",
                    Price = 10000
                });
        }

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            
        }

        private void bindingSource1_CurrentChanged(object sender, EventArgs e)
        {

        }
    }
}
