namespace Ui0522_2
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
            System.Windows.Forms.DataVisualization.Charting.ChartArea chartArea2 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            System.Windows.Forms.DataVisualization.Charting.Legend legend2 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            System.Windows.Forms.DataVisualization.Charting.Series series2 = new System.Windows.Forms.DataVisualization.Charting.Series();
            this.High_button_clicked = new System.Windows.Forms.Button();
            this.Low_button_clicked = new System.Windows.Forms.Button();
            this.chart1 = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.START_BUTTON = new System.Windows.Forms.Button();
            this.END_BUTTON = new System.Windows.Forms.Button();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            ((System.ComponentModel.ISupportInitialize)(this.chart1)).BeginInit();
            this.SuspendLayout();
            // 
            // High_button_clicked
            // 
            this.High_button_clicked.BackColor = System.Drawing.SystemColors.Info;
            this.High_button_clicked.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.High_button_clicked.Font = new System.Drawing.Font("맑은 고딕", 15.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.High_button_clicked.Location = new System.Drawing.Point(12, 12);
            this.High_button_clicked.Name = "High_button_clicked";
            this.High_button_clicked.Size = new System.Drawing.Size(100, 100);
            this.High_button_clicked.TabIndex = 0;
            this.High_button_clicked.Text = "HIGH";
            this.High_button_clicked.UseVisualStyleBackColor = false;
            this.High_button_clicked.Click += new System.EventHandler(this.High_button_clicked_Click);
            // 
            // Low_button_clicked
            // 
            this.Low_button_clicked.BackColor = System.Drawing.SystemColors.ActiveCaption;
            this.Low_button_clicked.Font = new System.Drawing.Font("맑은 고딕", 15.75F, System.Drawing.FontStyle.Bold);
            this.Low_button_clicked.Location = new System.Drawing.Point(118, 12);
            this.Low_button_clicked.Name = "Low_button_clicked";
            this.Low_button_clicked.Size = new System.Drawing.Size(100, 100);
            this.Low_button_clicked.TabIndex = 1;
            this.Low_button_clicked.Text = "LOW";
            this.Low_button_clicked.UseVisualStyleBackColor = false;
            this.Low_button_clicked.Click += new System.EventHandler(this.Low_button_clicked_Click);
            // 
            // chart1
            // 
            chartArea2.Name = "ChartArea1";
            this.chart1.ChartAreas.Add(chartArea2);
            this.chart1.Dock = System.Windows.Forms.DockStyle.Bottom;
            legend2.Name = "Legend1";
            this.chart1.Legends.Add(legend2);
            this.chart1.Location = new System.Drawing.Point(0, 166);
            this.chart1.Name = "chart1";
            series2.BorderWidth = 2;
            series2.ChartArea = "ChartArea1";
            series2.ChartType = System.Windows.Forms.DataVisualization.Charting.SeriesChartType.Line;
            series2.Color = System.Drawing.Color.Red;
            series2.Legend = "Legend1";
            series2.Name = "Series1";
            this.chart1.Series.Add(series2);
            this.chart1.Size = new System.Drawing.Size(800, 284);
            this.chart1.TabIndex = 2;
            this.chart1.Text = "chart1";
            // 
            // START_BUTTON
            // 
            this.START_BUTTON.BackColor = System.Drawing.SystemColors.ControlLight;
            this.START_BUTTON.Font = new System.Drawing.Font("맑은 고딕", 15.75F, System.Drawing.FontStyle.Bold);
            this.START_BUTTON.Location = new System.Drawing.Point(224, 12);
            this.START_BUTTON.Name = "START_BUTTON";
            this.START_BUTTON.Size = new System.Drawing.Size(100, 100);
            this.START_BUTTON.TabIndex = 3;
            this.START_BUTTON.Text = "시작";
            this.START_BUTTON.UseVisualStyleBackColor = false;
            this.START_BUTTON.Click += new System.EventHandler(this.START_BUTTON_Click);
            // 
            // END_BUTTON
            // 
            this.END_BUTTON.BackColor = System.Drawing.SystemColors.GradientActiveCaption;
            this.END_BUTTON.Font = new System.Drawing.Font("맑은 고딕", 15.75F, System.Drawing.FontStyle.Bold);
            this.END_BUTTON.Location = new System.Drawing.Point(330, 12);
            this.END_BUTTON.Name = "END_BUTTON";
            this.END_BUTTON.Size = new System.Drawing.Size(100, 100);
            this.END_BUTTON.TabIndex = 4;
            this.END_BUTTON.Text = "종료";
            this.END_BUTTON.UseVisualStyleBackColor = false;
            this.END_BUTTON.Click += new System.EventHandler(this.END_BUTTON_Click);
            // 
            // timer1
            // 
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.END_BUTTON);
            this.Controls.Add(this.START_BUTTON);
            this.Controls.Add(this.chart1);
            this.Controls.Add(this.Low_button_clicked);
            this.Controls.Add(this.High_button_clicked);
            this.Name = "Form1";
            this.Text = "Form1";
            ((System.ComponentModel.ISupportInitialize)(this.chart1)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button High_button_clicked;
        private System.Windows.Forms.Button Low_button_clicked;
        private System.Windows.Forms.DataVisualization.Charting.Chart chart1;
        private System.Windows.Forms.Button START_BUTTON;
        private System.Windows.Forms.Button END_BUTTON;
        private System.Windows.Forms.Timer timer1;
    }
}

