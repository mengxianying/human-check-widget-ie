# ASP.NET Framework 4.5 跨浏览器人机验证控件

这是一个基于 ASP.NET Framework 4.0 的跨浏览器人机验证控件演示项目。

## 项目特性

### 🔧 浏览器兼容性
- Internet Explorer 8+
- Google Chrome (全版本)
- Mozilla Firefox (全版本)
- Safari 5.0+
- Microsoft Edge (全版本)

### 🔒 验证方式
- 滑块拖拽验证
- 数学题计算验证  
- 图案点击验证
- 支持验证模式切换

### ⚡ 技术特性
- 纯JavaScript实现，无第三方依赖
- 响应式设计，支持触摸设备
- 弹窗模式验证，支持多实例独立验证
- 完整的ASP.NET服务器端集成
- 事件回调机制和自定义样式支持

### 🎯 新增特性
- 弹窗模式人机验证，页面默认不显示验证控件
- 支持"人机验证email"和"人机验证phoneSMS"两种独立验证
- 验证状态实时显示，验证通过后自动关闭弹窗
- 支持点击遮罩层外部关闭弹窗

## 项目结构

```
/
├── Default.aspx              # 主演示页面
├── Default.aspx.cs           # 页面后台代码
├── Site.Master               # 母版页
├── Site.Master.cs            # 母版页后台代码
├── Web.config                # 应用程序配置
├── Global.asax               # 全局应用程序事件
├── packages.config           # NuGet包配置
└── Scripts/
    └── CrossBrowserHumanCheck.js    # 人机验证控件脚本
```

## 快速开始

1. 在Visual Studio中打开项目
2. 还原NuGet包
3. 编译并运行项目
4. 访问Default.aspx查看演示

## 使用方法

### 1. 引用脚本文件
```html
<script src="Scripts/CrossBrowserHumanCheck.js"></script>
```

### 2. 添加HTML容器和按钮
```html
<!-- 验证按钮 -->
<asp:Button ID="btnEmailVerify" runat="server" Text="人机验证email" 
    CssClass="btn btn-primary" OnClientClick="showEmailVerification(); return false;" />
<asp:Button ID="btnPhoneVerify" runat="server" Text="人机验证phoneSMS" 
    CssClass="btn btn-primary" OnClientClick="showPhoneVerification(); return false;" />

<!-- 验证状态显示 -->
<span id="emailStatus" class="status-text">邮箱验证：未验证</span>
<span id="phoneStatus" class="status-text">短信验证：未验证</span>

<!-- 隐藏字段 -->
<asp:HiddenField ID="hdnEmailVerified" runat="server" />
<asp:HiddenField ID="hdnPhoneVerified" runat="server" />

<!-- 弹窗容器 -->
<div id="emailModal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>邮箱人机验证</h3>
            <span class="close-btn" onclick="closeEmailModal()">&times;</span>
        </div>
        <div class="modal-body">
            <div id="emailHumanCheckContainer"></div>
        </div>
    </div>
</div>
```

### 3. JavaScript初始化
```javascript
// 显示邮箱验证弹窗
function showEmailVerification() {
    document.getElementById('emailModal').style.display = 'flex';
    
    if (!emailHumanCheck) {
        emailHumanCheck = new CrossBrowserHumanCheck('emailHumanCheckContainer', {
            onVerificationComplete: function(isVerified) {
                document.getElementById('hdnEmailVerified').value = isVerified.toString();
                
                var statusElement = document.getElementById('emailStatus');
                if (isVerified) {
                    statusElement.textContent = '邮箱验证：已通过';
                    statusElement.className = 'status-text status-verified';
                    setTimeout(function() { closeEmailModal(); }, 1500);
                }
            }
        });
    }
}
```

### 4. 服务器端验证
```csharp
protected void btnSubmit_Click(object sender, EventArgs e)
{
    bool emailVerified = hdnEmailVerified.Value == "true";
    bool phoneVerified = hdnPhoneVerified.Value == "true";
    
    if (!emailVerified && !phoneVerified)
    {
        ShowMessage("请至少完成一项人机验证（邮箱或短信）！", false);
        return;
    }
    
    // 验证通过，处理表单提交
    string verificationInfo = "";
    if (emailVerified && phoneVerified)
        verificationInfo = "（邮箱和短信验证均已通过）";
    else if (emailVerified)
        verificationInfo = "（邮箱验证已通过）";
    else if (phoneVerified)
        verificationInfo = "（短信验证已通过）";
        
    ShowMessage($"表单提交成功！{verificationInfo}", true);
}
```

## 系统要求

- .NET Framework 4.0+
- Visual Studio 2010+
- IIS 7.0+

## 许可证

MIT License
