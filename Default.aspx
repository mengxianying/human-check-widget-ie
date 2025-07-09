<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>跨浏览器人机验证控件 - ASP.NET演示</title>
    
    <!-- 引入人机验证控件 -->
    <script src="Scripts/CrossBrowserHumanCheck.js"></script>
    
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
                <p>ASP.NET Framework 4.5 演示</p>
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
                    <asp:RequiredFieldValidator ID="rfvEmail" runat="server" 
                        ControlToValidate="txtEmail" 
                        ErrorMessage="请输入邮箱" 
                        ForeColor="Red" 
                        Display="Dynamic" />
                    <asp:RegularExpressionValidator ID="revEmail" runat="server" 
                        ControlToValidate="txtEmail" 
                        ErrorMessage="邮箱格式不正确" 
                        ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" 
                        ForeColor="Red" 
                        Display="Dynamic" />
                </div>
                
                <!-- 人机验证控件容器 -->
                <div class="form-group">
                    <label>人机验证：</label>
                    <div id="humanCheckContainer"></div>
                    <asp:HiddenField ID="hdnVerified" runat="server" />
                </div>
                
                <asp:Button ID="btnSubmit" runat="server" CssClass="btn" Text="提交表单" OnClick="btnSubmit_Click" />
                <asp:Button ID="btnReset" runat="server" CssClass="btn btn-secondary" Text="重置表单" OnClick="btnReset_Click" CausesValidation="false" />
                
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
    </form>
    
    <!-- 初始化人机验证控件 -->
    <script type="text/javascript">
        // 页面加载完成后初始化控件
        window.onload = function() {
            try {
                var humanCheck = new CrossBrowserHumanCheck('humanCheckContainer', {
                    onVerificationComplete: function(isVerified) {
                        // 更新隐藏字段的值
                        var hiddenField = document.getElementById('<%= hdnVerified.ClientID %>');
                        if (hiddenField) {
                            hiddenField.value = isVerified ? 'true' : 'false';
                        }
                        
                        console.log('人机验证完成:', isVerified);
                    }
                });
            } catch (e) {
                console.error('初始化人机验证控件失败:', e);
                document.getElementById('humanCheckContainer').innerHTML = 
                    '<p style="color: red;">人机验证控件加载失败，请刷新页面重试。</p>';
            }
        };
        
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