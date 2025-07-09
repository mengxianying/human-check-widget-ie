# ASP.NET Framework 4.5 跨浏览器人机验证控件

这是一个基于 ASP.NET Framework 4.5 的跨浏览器人机验证控件演示项目。

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
- 完整的ASP.NET服务器端集成
- 事件回调机制和自定义样式支持

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

### 2. 添加HTML容器
```html
<div id="humanCheckContainer"></div>
<asp:HiddenField ID="hdnVerified" runat="server" />
```

### 3. JavaScript初始化
```javascript
var humanCheck = new CrossBrowserHumanCheck('humanCheckContainer', {
    onVerificationComplete: function(isVerified) {
        document.getElementById('hdnVerified').value = isVerified;
    }
});
```

### 4. 服务器端验证
```csharp
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
```

## 系统要求

- .NET Framework 4.5+
- Visual Studio 2012+
- IIS 7.0+

## 许可证

MIT License
