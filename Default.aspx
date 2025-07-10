<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>跨浏览器人机验证控件 - ASP.NET演示</title>
    
    <!-- 引入人机验证控件 -->
<!-- 修改后 -->
<script src="<%= ResolveUrl("~/Scripts/CrossBrowserHumanCheck.js") %>"></script>
    
    <style type="text/css">
        body {
            font-family: "Microsoft YaHei", "Segoe UI", Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8fafc;
            color: #1f2937;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #6b7280;
            margin: 5px 0;
        }
        
        .browser-badges {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .badge {
            background: #22c55e;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        
        .demo-section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #f8fafc;
        }
        
        .demo-section h3 {
            margin-top: 0;
            color: #1f2937;
        }
        
        .form-group {
            margin: 15px 0;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .form-control {
            width: 100%;
            max-width: 300px;
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .btn {
            background: #22c55e;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin: 10px 5px 0 0;
        }
        
        .btn:hover {
            background: #16a34a;
        }

        .btn-primary {
            background: #3b82f6;
        }

        .btn-primary:hover {
            background: #2563eb;
        }

        .verification-buttons {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
        }

        .verification-status {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 10px;
        }

        .status-text {
            font-size: 14px;
            padding: 5px 10px;
            border-radius: 4px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
        }

        .status-verified {
            background: #d4edda !important;
            border-color: #c3e6cb !important;
            color: #155724;
        }

        /* 遮罩层样式 */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
            margin: 0;
            color: #333;
        }

        .close-btn {
            font-size: 24px;
            color: #999;
            cursor: pointer;
            line-height: 1;
            padding: 0;
            background: none;
            border: none;
        }

        .close-btn:hover {
            color: #333;
        }

        .modal-body {
            padding: 20px;
        }
        
        .btn-secondary {
            background: #6b7280;
        }
        
        .btn-secondary:hover {
            background: #4b5563;
        }
        
        .result {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            display: none;
        }
        
        .result.success {
            background: #22c55e;
            color: white;
        }
        
        .result.error {
            background: #ef4444;
            color: white;
        }
        
        .code-example {
            background: #1f2937;
            color: #f8fafc;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
            font-family: "Consolas", "Monaco", monospace;
            font-size: 12px;
            overflow-x: auto;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .feature-card {
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
        }
        
        .feature-card h4 {
            margin-top: 0;
            color: #22c55e;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
        }
        
        .feature-list li {
            padding: 3px 0;
            color: #6b7280;
        }
        
        .feature-list li:before {
            content: "• ";
            color: #22c55e;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <!-- 页面头部 -->
            <div class="header">
                <h1>跨浏览器人机验证控件</h1>
                <p>ASP.NET Framework 4.0 演示</p>
                <p>完美兼容 IE8+ | Chrome | Firefox | Safari | Edge</p>
                
                <div class="browser-badges">
                    <span class="badge">IE8+</span>
                    <span class="badge">Chrome</span>
                    <span class="badge">Firefox</span>
                    <span class="badge">Safari</span>
                    <span class="badge">Edge</span>
                </div>
            </div>
            
            <!-- 演示表单 -->
            <div class="demo-section">
                <h3>📋 表单验证演示</h3>
                <p>请填写以下信息并完成人机验证：</p>
                
                <div class="form-group">
                    <label for="txtUsername">用户名：</label>
                    <asp:TextBox ID="txtUsername" runat="server" CssClass="form-control" placeholder="请输入用户名" />
                    <asp:RequiredFieldValidator ID="rfvUsername" runat="server" 
                        ControlToValidate="txtUsername" 
                        ErrorMessage="请输入用户名" 
                        ForeColor="Red" 
                        Display="Dynamic" />
                </div>
                
                <div class="form-group">
                    <label for="txtEmail">邮箱：</label>
                    <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control" placeholder="请输入邮箱地址" />
        </div>
                
                <!-- 人机验证按钮 -->
                <div class="form-group">
                    <label>人机验证：</label>
                    <div class="verification-buttons">
                        <asp:Button ID="btnEmailVerify" runat="server" Text="人机验证email" 
                            CssClass="btn btn-primary" OnClientClick="showEmailVerification(); return false;" />
                        <asp:Button ID="btnPhoneVerify" runat="server" Text="人机验证phoneSMS" 
                            CssClass="btn btn-primary" OnClientClick="showPhoneVerification(); return false;" />
                    </div>
                    <div class="verification-status">
                        <span id="emailStatus" class="status-text">邮箱验证：未验证</span>
                        <span id="phoneStatus" class="status-text">短信验证：未验证</span>
                    </div>
                    <asp:HiddenField ID="hdnEmailVerified" runat="server" />
                    <asp:HiddenField ID="hdnPhoneVerified" runat="server" />
                </div>
                
                <asp:Button ID="btnSubmit" runat="server" CssClass="btn" Text="提交表单" OnClick="BtnSubmit_Click" />
                <asp:Button ID="btnReset" runat="server" CssClass="btn btn-secondary" Text="重置表单" OnClick="BtnReset_Click" CausesValidation="false" />
                
                <!-- 结果显示 -->
                <div id="resultMessage" class="result">
                      <asp:Label ID="lblMessage" runat="server" />
                </div>
              
            </div>
            
            <!-- 控件特性展示 -->
            <div class="demo-section">
                <h3>🔧 控件特性</h3>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h4>✅ 浏览器兼容性</h4>
                        <ul class="feature-list">
                            <li>Internet Explorer 8+</li>
                            <li>Google Chrome 全版本</li>
                            <li>Mozilla Firefox 全版本</li>
                            <li>Safari 5.0+</li>
                            <li>Microsoft Edge 全版本</li>
                        </ul>
                    </div>
                    <div class="feature-card">
                        <h4>🔒 验证方式</h4>
                        <ul class="feature-list">
                            <li>滑块拖拽验证</li>
                            <li>数学题计算验证</li>
                            <li>图案点击验证</li>
                            <li>支持模式切换</li>
                        </ul>
                    </div>
                    <div class="feature-card">
                        <h4>⚡ 技术特性</h4>
                        <ul class="feature-list">
                            <li>纯JavaScript实现</li>
                            <li>无第三方依赖</li>
                            <li>响应式设计</li>
                            <li>触摸设备支持</li>
                        </ul>
                    </div>
                    <div class="feature-card">
                        <h4>🔧 ASP.NET集成</h4>
                        <ul class="feature-list">
                            <li>简单易用的API</li>
                            <li>服务器端验证支持</li>
                            <li>事件回调机制</li>
                            <li>自定义样式支持</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- 代码示例 -->
            <div class="demo-section">
                <h3>💻 集成代码示例</h3>
                
                <h4>1. 页面引用脚本</h4>
                <div class="code-example">
&lt;script src="Scripts/CrossBrowserHumanCheck.js"&gt;&lt;/script&gt;
                </div>
                
                <h4>2. HTML标记</h4>
                <div class="code-example">
&lt;div id="humanCheckContainer"&gt;&lt;/div&gt;
&lt;asp:HiddenField ID="hdnVerified" runat="server" /&gt;
                </div>
                
                <h4>3. JavaScript初始化</h4>
                <div class="code-example">
var humanCheck = new CrossBrowserHumanCheck('humanCheckContainer', {
    onVerificationComplete: function(isVerified) {
        document.getElementById('&lt;%= hdnVerified.ClientID %&gt;').value = isVerified;
    }
});
                </div>
                
                <h4>4. 服务器端验证</h4>
                <div class="code-example">
protected void btnSubmit_Click(object sender, EventArgs e)
{
    if (hdnVerified.Value == "true")
    {
        // 验证通过，处理表单提交
        Response.Write("验证成功！");
    }
    else
    {
        // 验证失败
        ClientScript.RegisterStartupScript(this.GetType(), 
            "alert", "alert('请完成人机验证！');", true);
    }
}
                </div>
            </div>
        </div>

        <!-- 邮箱验证遮罩层 -->
        <div id="emailModal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>邮箱人机验证</h3>
                    <span class="close-btn" onclick="closeEmailModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div id="emailHumanCheckContainer" class="human-check-container"></div>
                </div>
            </div>
        </div>

        <!-- 短信验证遮罩层 -->
        <div id="phoneModal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>短信人机验证</h3>
                    <span class="close-btn" onclick="closePhoneModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div id="phoneHumanCheckContainer" class="human-check-container"></div>
                </div>
            </div>
        </div>
    </form>
    
    <!-- 弹窗模式人机验证控件 -->
    <script type="text/javascript">
        // 全局变量存储验证控件实例
        var emailHumanCheck = null;
        var phoneHumanCheck = null;

        // 显示邮箱验证弹窗
        function showEmailVerification() {
            document.getElementById('emailModal').style.display = 'flex';
            
            // 如果还没有初始化，则创建控件
            if (!emailHumanCheck) {
                try {
                    emailHumanCheck = new CrossBrowserHumanCheck('emailHumanCheckContainer', {
                        onVerificationComplete: function(isVerified) {
                            document.getElementById('<%= hdnEmailVerified.ClientID %>').value = isVerified.toString();
                            
                            var statusElement = document.getElementById('emailStatus');
                            if (isVerified) {
                                statusElement.textContent = '邮箱验证：已通过';
                                statusElement.className = 'status-text status-verified';
                                showResult('邮箱人机验证通过！', true);
                                setTimeout(function() {
                                    closeEmailModal();
                                }, 1500);
                            } else {
                                statusElement.textContent = '邮箱验证：验证失败';
                                statusElement.className = 'status-text';
                                showResult('邮箱人机验证失败，请重试！', false);
                            }
                        }
                    });
                } catch (e) {
                    console.error('初始化邮箱验证控件失败:', e);
                    document.getElementById('emailHumanCheckContainer').innerHTML = 
                        '<p style="color: red;">人机验证控件加载失败，请刷新页面重试。</p>';
                }
            }
        }

        // 显示短信验证弹窗
        function showPhoneVerification() {
            document.getElementById('phoneModal').style.display = 'flex';
            
            // 如果还没有初始化，则创建控件
            if (!phoneHumanCheck) {
                try {
                    phoneHumanCheck = new CrossBrowserHumanCheck('phoneHumanCheckContainer', {
                        onVerificationComplete: function(isVerified) {
                            document.getElementById('<%= hdnPhoneVerified.ClientID %>').value = isVerified.toString();
                            
                            var statusElement = document.getElementById('phoneStatus');
                            if (isVerified) {
                                statusElement.textContent = '短信验证：已通过';
                                statusElement.className = 'status-text status-verified';
                                showResult('短信人机验证通过！', true);
                                setTimeout(function() {
                                    closePhoneModal();
                                }, 1500);
                            } else {
                                statusElement.textContent = '短信验证：验证失败';
                                statusElement.className = 'status-text';
                                showResult('短信人机验证失败，请重试！', false);
                            }
                        }
                    });
                } catch (e) {
                    console.error('初始化短信验证控件失败:', e);
                    document.getElementById('phoneHumanCheckContainer').innerHTML = 
                        '<p style="color: red;">人机验证控件加载失败，请刷新页面重试。</p>';
                }
            }
        }

        // 关闭邮箱验证弹窗
        function closeEmailModal() {
            document.getElementById('emailModal').style.display = 'none';
        }

        // 关闭短信验证弹窗
        function closePhoneModal() {
            document.getElementById('phoneModal').style.display = 'none';
        }

        // 点击遮罩层外部关闭弹窗
        document.addEventListener('click', function(event) {
            var emailModal = document.getElementById('emailModal');
            var phoneModal = document.getElementById('phoneModal');
            
            if (event.target === emailModal) {
                closeEmailModal();
            }
            if (event.target === phoneModal) {
                closePhoneModal();
            }
        });

        // 显示结果消息
        function showResult(message, isSuccess) {
            var resultDiv = document.getElementById('resultMessage');
            var labelElement = document.getElementById('<%= lblMessage.ClientID %>');
            
            if (resultDiv && labelElement) {
                labelElement.innerHTML = message;
                resultDiv.className = 'result ' + (isSuccess ? 'success' : 'error');
                resultDiv.style.display = 'block';
                
                // 3秒后自动隐藏
                setTimeout(function() {
                    resultDiv.style.display = 'none';
                }, 3000);
            }
        }
    </script>
</body>
</html>