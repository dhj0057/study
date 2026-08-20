namespace final_Assignment
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
            this.buttonConnect = new System.Windows.Forms.Button();
            this.buttonAutoStart = new System.Windows.Forms.Button();
            this.buttonAutoStop = new System.Windows.Forms.Button();
            this.buttonBForward = new System.Windows.Forms.Button();
            this.buttonBBack = new System.Windows.Forms.Button();
            this.buttonCForward = new System.Windows.Forms.Button();
            this.buttonCBack = new System.Windows.Forms.Button();
            this.buttonLiftAUp = new System.Windows.Forms.Button();
            this.buttonLiftADown = new System.Windows.Forms.Button();
            this.buttonLiftBUp = new System.Windows.Forms.Button();
            this.buttonLiftBDown = new System.Windows.Forms.Button();
            this.labelStatus = new System.Windows.Forms.Label();
            this.labelSensor = new System.Windows.Forms.Label();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.SuspendLayout();
            // 
            // buttonConnect
            // 
            this.buttonConnect.Location = new System.Drawing.Point(12, 12);
            this.buttonConnect.Name = "buttonConnect";
            this.buttonConnect.Size = new System.Drawing.Size(100, 50);
            this.buttonConnect.TabIndex = 0;
            this.buttonConnect.Text = "연결";
            this.buttonConnect.UseVisualStyleBackColor = true;
            this.buttonConnect.Click += new System.EventHandler(this.buttonConnect_Click);
            // 
            // buttonAutoStart
            // 
            this.buttonAutoStart.Location = new System.Drawing.Point(118, 12);
            this.buttonAutoStart.Name = "buttonAutoStart";
            this.buttonAutoStart.Size = new System.Drawing.Size(100, 50);
            this.buttonAutoStart.TabIndex = 1;
            this.buttonAutoStart.Text = "자동 시작";
            this.buttonAutoStart.UseVisualStyleBackColor = true;
            this.buttonAutoStart.Click += new System.EventHandler(this.buttonAutoStart_Click);
            // 
            // buttonAutoStop
            // 
            this.buttonAutoStop.Location = new System.Drawing.Point(224, 12);
            this.buttonAutoStop.Name = "buttonAutoStop";
            this.buttonAutoStop.Size = new System.Drawing.Size(100, 50);
            this.buttonAutoStop.TabIndex = 2;
            this.buttonAutoStop.Text = "자동 정지";
            this.buttonAutoStop.UseVisualStyleBackColor = true;
            this.buttonAutoStop.Click += new System.EventHandler(this.buttonAutoStop_Click);
            // 
            // buttonBForward
            // 
            this.buttonBForward.Location = new System.Drawing.Point(12, 68);
            this.buttonBForward.Name = "buttonBForward";
            this.buttonBForward.Size = new System.Drawing.Size(100, 50);
            this.buttonBForward.TabIndex = 3;
            this.buttonBForward.Text = "B실린더 전진";
            this.buttonBForward.UseVisualStyleBackColor = true;
            this.buttonBForward.Click += new System.EventHandler(this.buttonBForward_Click);
            // 
            // buttonBBack
            // 
            this.buttonBBack.Location = new System.Drawing.Point(118, 68);
            this.buttonBBack.Name = "buttonBBack";
            this.buttonBBack.Size = new System.Drawing.Size(100, 50);
            this.buttonBBack.TabIndex = 4;
            this.buttonBBack.Text = "B실린더 후진";
            this.buttonBBack.UseVisualStyleBackColor = true;
            this.buttonBBack.Click += new System.EventHandler(this.buttonBBack_Click);
            // 
            // buttonCForward
            // 
            this.buttonCForward.Location = new System.Drawing.Point(12, 126);
            this.buttonCForward.Name = "buttonCForward";
            this.buttonCForward.Size = new System.Drawing.Size(100, 50);
            this.buttonCForward.TabIndex = 5;
            this.buttonCForward.Text = "C실린더 전진";
            this.buttonCForward.UseVisualStyleBackColor = true;
            this.buttonCForward.Click += new System.EventHandler(this.buttonCForward_Click);
            // 
            // buttonCBack
            // 
            this.buttonCBack.Location = new System.Drawing.Point(118, 124);
            this.buttonCBack.Name = "buttonCBack";
            this.buttonCBack.Size = new System.Drawing.Size(100, 50);
            this.buttonCBack.TabIndex = 6;
            this.buttonCBack.Text = "C실린더 후진";
            this.buttonCBack.UseVisualStyleBackColor = true;
            this.buttonCBack.Click += new System.EventHandler(this.buttonCBack_Click);
            // 
            // buttonLiftAUp
            // 
            this.buttonLiftAUp.Location = new System.Drawing.Point(12, 180);
            this.buttonLiftAUp.Name = "buttonLiftAUp";
            this.buttonLiftAUp.Size = new System.Drawing.Size(100, 50);
            this.buttonLiftAUp.TabIndex = 7;
            this.buttonLiftAUp.Text = "LiftA Up";
            this.buttonLiftAUp.UseVisualStyleBackColor = true;
            this.buttonLiftAUp.Click += new System.EventHandler(this.buttonLiftAUp_Click);
            // 
            // buttonLiftADown
            // 
            this.buttonLiftADown.Location = new System.Drawing.Point(118, 180);
            this.buttonLiftADown.Name = "buttonLiftADown";
            this.buttonLiftADown.Size = new System.Drawing.Size(100, 50);
            this.buttonLiftADown.TabIndex = 8;
            this.buttonLiftADown.Text = "LiftA Down";
            this.buttonLiftADown.UseVisualStyleBackColor = true;
            this.buttonLiftADown.Click += new System.EventHandler(this.buttonLiftADown_Click);
            // 
            // buttonLiftBUp
            // 
            this.buttonLiftBUp.Location = new System.Drawing.Point(12, 236);
            this.buttonLiftBUp.Name = "buttonLiftBUp";
            this.buttonLiftBUp.Size = new System.Drawing.Size(100, 50);
            this.buttonLiftBUp.TabIndex = 9;
            this.buttonLiftBUp.Text = "LiftB Up";
            this.buttonLiftBUp.UseVisualStyleBackColor = true;
            this.buttonLiftBUp.Click += new System.EventHandler(this.buttonLiftBUp_Click);
            // 
            // buttonLiftBDown
            // 
            this.buttonLiftBDown.Location = new System.Drawing.Point(118, 236);
            this.buttonLiftBDown.Name = "buttonLiftBDown";
            this.buttonLiftBDown.Size = new System.Drawing.Size(100, 50);
            this.buttonLiftBDown.TabIndex = 10;
            this.buttonLiftBDown.Text = "LiftB Down";
            this.buttonLiftBDown.UseVisualStyleBackColor = true;
            this.buttonLiftBDown.Click += new System.EventHandler(this.buttonLiftBDown_Click);
            // 
            // labelStatus
            // 
            this.labelStatus.AutoSize = true;
            this.labelStatus.Font = new System.Drawing.Font("굴림", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.labelStatus.Location = new System.Drawing.Point(257, 79);
            this.labelStatus.Name = "labelStatus";
            this.labelStatus.Size = new System.Drawing.Size(143, 21);
            this.labelStatus.TabIndex = 12;
            this.labelStatus.Text = "현재 상태표시";
            // 
            // labelSensor
            // 
            this.labelSensor.AutoSize = true;
            this.labelSensor.Font = new System.Drawing.Font("굴림", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.labelSensor.Location = new System.Drawing.Point(257, 139);
            this.labelSensor.Name = "labelSensor";
            this.labelSensor.Size = new System.Drawing.Size(135, 19);
            this.labelSensor.TabIndex = 13;
            this.labelSensor.Text = "센서 상태 대기";
            // 
            // timer1
            // 
            this.timer1.Interval = 300;
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.labelSensor);
            this.Controls.Add(this.labelStatus);
            this.Controls.Add(this.buttonLiftBDown);
            this.Controls.Add(this.buttonLiftBUp);
            this.Controls.Add(this.buttonLiftADown);
            this.Controls.Add(this.buttonLiftAUp);
            this.Controls.Add(this.buttonCBack);
            this.Controls.Add(this.buttonCForward);
            this.Controls.Add(this.buttonBBack);
            this.Controls.Add(this.buttonBForward);
            this.Controls.Add(this.buttonAutoStop);
            this.Controls.Add(this.buttonAutoStart);
            this.Controls.Add(this.buttonConnect);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button buttonConnect;
        private System.Windows.Forms.Button buttonAutoStart;
        private System.Windows.Forms.Button buttonAutoStop;
        private System.Windows.Forms.Button buttonBForward;
        private System.Windows.Forms.Button buttonBBack;
        private System.Windows.Forms.Button buttonCForward;
        private System.Windows.Forms.Button buttonCBack;
        private System.Windows.Forms.Button buttonLiftAUp;
        private System.Windows.Forms.Button buttonLiftADown;
        private System.Windows.Forms.Button buttonLiftBUp;
        private System.Windows.Forms.Button buttonLiftBDown;
        private System.Windows.Forms.Label labelStatus;
        private System.Windows.Forms.Label labelSensor;
        private System.Windows.Forms.Timer timer1;
    }
}

