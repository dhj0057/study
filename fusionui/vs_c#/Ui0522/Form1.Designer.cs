namespace Ui0522
{
    partial class Form1
    {
        /// <summary>
        /// 필수 디자이너 변수입니다.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 사용 중인 모든 리소스를 정리합니다.
        /// </summary>
        /// <param name="disposing">관리되는 리소스를 삭제해야 하면 true이고, 그렇지 않으면 false입니다.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form 디자이너에서 생성한 코드

        /// <summary>
        /// 디자이너 지원에 필요한 메서드입니다. 
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마세요.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.label1 = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.Timer_EnableTrue = new System.Windows.Forms.Button();
            this.Timer_EnableFalse = new System.Windows.Forms.Button();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("휴먼모음T", 30F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.label1.Location = new System.Drawing.Point(348, 43);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(412, 44);
            this.label1.TabIndex = 0;
            this.label1.Text = "0000.00.00 00:00:00";
            // 
            // button1
            // 
            this.button1.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.button1.Font = new System.Drawing.Font("휴먼모음T", 15.75F, System.Drawing.FontStyle.Bold);
            this.button1.Location = new System.Drawing.Point(0, 410);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(800, 40);
            this.button1.TabIndex = 2;
            this.button1.Text = "시간 가져오기";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.GetSystemTimeBin_Clicked);
            // 
            // timer1
            // 
            this.timer1.Interval = 1000;
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // Timer_EnableTrue
            // 
            this.Timer_EnableTrue.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.Timer_EnableTrue.Font = new System.Drawing.Font("휴먼모음T", 15.75F, System.Drawing.FontStyle.Bold);
            this.Timer_EnableTrue.Location = new System.Drawing.Point(0, 370);
            this.Timer_EnableTrue.Name = "Timer_EnableTrue";
            this.Timer_EnableTrue.Size = new System.Drawing.Size(800, 40);
            this.Timer_EnableTrue.TabIndex = 3;
            this.Timer_EnableTrue.Text = "타이머키기";
            this.Timer_EnableTrue.UseVisualStyleBackColor = true;
            this.Timer_EnableTrue.Click += new System.EventHandler(this.button2_Click);
            // 
            // Timer_EnableFalse
            // 
            this.Timer_EnableFalse.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.Timer_EnableFalse.Font = new System.Drawing.Font("휴먼모음T", 15.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.Timer_EnableFalse.Location = new System.Drawing.Point(0, 330);
            this.Timer_EnableFalse.Name = "Timer_EnableFalse";
            this.Timer_EnableFalse.Size = new System.Drawing.Size(800, 40);
            this.Timer_EnableFalse.TabIndex = 4;
            this.Timer_EnableFalse.Text = "타이머끄기";
            this.Timer_EnableFalse.UseVisualStyleBackColor = true;
            this.Timer_EnableFalse.Click += new System.EventHandler(this.button3_Click);
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = ((System.Drawing.Image)(resources.GetObject("pictureBox1.Image")));
            this.pictureBox1.Location = new System.Drawing.Point(12, 12);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(294, 312);
            this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pictureBox1.TabIndex = 5;
            this.pictureBox1.TabStop = false;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.Timer_EnableFalse);
            this.Controls.Add(this.Timer_EnableTrue);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.label1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.Button Timer_EnableTrue;
        private System.Windows.Forms.Button Timer_EnableFalse;
        private System.Windows.Forms.PictureBox pictureBox1;
    }
}

