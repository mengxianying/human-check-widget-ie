<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TestPage.aspx.cs" Inherits="TestPage" %>
<%@ Register Src="~/Controls/UcRegBase.ascx" TagPrefix="uc" TagName="RegBase" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>人机验证注册控件测试页面</title>
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
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <!-- 页面头部 -->
            <div class="header">
                <h1>人机验证注册控件</h1>
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
            
            <!-- 注册控件 -->
            <uc:RegBase ID="ucRegBase" runat="server" 
                OnEmailCodeSending="UcRegBase_EmailCodeSending"
                OnPhoneCodeSending="UcRegBase_PhoneCodeSending"
                OnUserRegistering="UcRegBase_UserRegistering" />
        </div>
    </form>
</body>
</html>