using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Linq;
namespace fusionUi0515_2_
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        private void UpdateTotalPrice()
        {
            int total = ProductSource.Cast<product2>().Sum(x => x.Price);
            tbTotalPrice.Text = total.ToString("N0") + "원";
        }


        private void Form1_Load(object sender, EventArgs e)
        {
         
            UpdateTotalPrice();
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            int index = dataGridView1.CurrentRow.Index;

            product2 item = dataGridView1.Rows[index].DataBoundItem as product2;

            MessageBox.Show(item.Name + "");
        }

        private void btnAddProduct_Click_Click(object sender, EventArgs e)
        {
            string name = tbProductName.Text;
            int price = int.Parse(tbProductPrice.Text);

            ProductSource.Add(new product2 { Name = name, Price = price });

            UpdateTotalPrice();
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void button10_Click(object sender, EventArgs e)
        {
            if (dataGridView1.CurrentRow == null)
                return;

            int index = dataGridView1.CurrentRow.Index;

            product2 item = dataGridView1.Rows[index].DataBoundItem as product2;

            DialogResult result = MessageBox.Show(
                item.Name + "을 삭제 하시겠습니까?",
                "삭제 확인",
                MessageBoxButtons.YesNo
            );

            if (result == DialogResult.Yes)
            {
                ProductSource.Remove(item);
                UpdateTotalPrice();
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "삼겹살", Price = 13000 });
            UpdateTotalPrice();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "목살", Price = 13000 });
            UpdateTotalPrice();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "항정살", Price = 13000 });
            UpdateTotalPrice();
        }

        private void button14_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "가브리살", Price = 13000 });
            UpdateTotalPrice();
        }

        private void button13_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "모둠", Price = 33000 });
            UpdateTotalPrice();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "된장찌개", Price = 2000 });
            UpdateTotalPrice();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "김치찌개", Price = 2000 });
            UpdateTotalPrice();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "공기밥", Price = 1000 });
            UpdateTotalPrice();
        }

        private void button11_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "소주", Price = 5000 });
            UpdateTotalPrice();
        }

        private void button15_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "맥주", Price = 5000 });
            UpdateTotalPrice();
        }

        private void button7_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "김치말이국수", Price = 7000 });
            UpdateTotalPrice();
        }

        private void button8_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "계란찜", Price = 3000 });
            UpdateTotalPrice();
        }

        private void button9_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "물냉면", Price = 7000 });
            UpdateTotalPrice();
        }

        private void button12_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "비빔냉면", Price = 7000 });
            UpdateTotalPrice();
        }

        private void button20_Click(object sender, EventArgs e)
        {
            ProductSource.Add(new product2 { Name = "복분자", Price = 12000 });
            UpdateTotalPrice();
        }

        private void tbTotalPrice_TextChanged(object sender, EventArgs e)
        {

        }

        private void btnPay_Click(object sender, EventArgs e)
        {
            int total = ProductSource.Cast<product2>().Sum(x => x.Price);

            if (total == 0)
            {
                MessageBox.Show("계산할 상품이 없습니다.");
                return;
            }

            DialogResult result = MessageBox.Show(
                "총 결제 금액은 " + total.ToString("N0") + "원입니다.\n계산을 완료하시겠습니까?",
                "계산 확인",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question
            );

            if (result == DialogResult.Yes)
            {
                ProductSource.Clear();
                UpdateTotalPrice();

                MessageBox.Show("계산이 완료되었습니다.");
            }
        }
    }
}
