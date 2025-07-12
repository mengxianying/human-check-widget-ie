<%@ Control Language="C#" AutoEventWireup="true" CodeFile="UcRegBase.ascx.cs" Inherits="Controls_UcRegBase" %>

<div class="reg-form-container">
    <!-- 邮箱注册区域 -->
    <div class="form-section">
        <h3>邮箱注册</h3>
        <div class="form-group">
            <label for="txtEmail">邮箱地址：</label>
            <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control" placeholder="请输入邮箱地址" />
            <asp:RequiredFieldValidator ID="rfvEmail" runat="server" 
                ControlToValidate="txtEmail" 
                ErrorMessage="请输入邮箱地址" 
                ForeColor="Red" 
                Display="Dynamic" 
                ValidationGroup="EmailGroup" />
            <asp:RegularExpressionValidator ID="revEmail" runat="server" 
                ControlToValidate="txtEmail" 
                ValidationExpression="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" 
                ErrorMessage="邮箱格式不正确" 
                ForeColor="Red" 
                Display="Dynamic" 
                ValidationGroup="EmailGroup" />
        </div>
        <div class="form-group">
            <label for="txtEmailCode">邮箱验证码：</label>
            <div class="verification-code-group">
                <asp:TextBox ID="txtEmailCode" runat="server" CssClass="form-control code-input" placeholder="请输入验证码" />
                <asp:Button ID="btnSendEmailCode" runat="server" Text="发送验证码" 
                    CssClass="btn btn-primary send-code-btn" 
                    OnClientClick="return sendEmailVerificationCode();" 
                    OnClick="BtnSendEmailCode_Click" 
                    ValidationGroup="EmailGroup" />
            </div>
            <asp:RequiredFieldValidator ID="rfvEmailCode" runat="server" 
                ControlToValidate="txtEmailCode" 
                ErrorMessage="请输入邮箱验证码" 
                ForeColor="Red" 
                Display="Dynamic" 
                ValidationGroup="EmailGroup" />
        </div>
    </div>

    <!-- 手机注册区域 -->
    <div class="form-section">
        <h3>手机注册</h3>
        <div class="form-group">
            <label for="txtPhone">手机号码：</label>
            <asp:TextBox ID="txtPhone" runat="server" CssClass="form-control" placeholder="请输入手机号码" />
            <asp:RequiredFieldValidator ID="rfvPhone" runat="server" 
                ControlToValidate="txtPhone" 
                ErrorMessage="请输入手机号码" 
                ForeColor="Red" 
                Display="Dynamic" 
                ValidationGroup="PhoneGroup" />
            <asp:RegularExpressionValidator ID="revPhone" runat="server" 
                ControlToValidate="txtPhone" 
                ValidationExpression="^1[3-9]\d{9}$" 
                ErrorMessage="手机号码格式不正确" 
                ForeColor="Red" 
                Display="Dynamic" 
                ValidationGroup="PhoneGroup" />
        </div>
        <div class="form-group">
            <label for="txtPhoneCode">手机验证码：</label>
            <div class="verification-code-group">
                <asp:TextBox ID="txtPhoneCode" runat="server" CssClass="form-control code-input" placeholder="请输入验证码" />
                <asp:Button ID="btnSendPhoneCode" runat="server" Text="发送验证码" 
                    CssClass="btn btn-primary send-code-btn" 
                    OnClientClick="return sendPhoneVerificationCode();" 
                    OnClick="BtnSendPhoneCode_Click" 
                    ValidationGroup="PhoneGroup" />
            </div>
            <asp:RequiredFieldValidator ID="rfvPhoneCode" runat="server" 
                ControlToValidate="txtPhoneCode" 
                ErrorMessage="请输入手机验证码" 
                ForeColor="Red" 
                Display="Dynamic" 
                ValidationGroup="PhoneGroup" />
        </div>
    </div>

    <!-- 用户名和密码 -->
    <div class="form-section">
        <h3>账户信息</h3>
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
            <label for="txtPassword">密码：</label>
            <asp:TextBox ID="txtPassword" runat="server" CssClass="form-control" TextMode="Password" placeholder="请输入密码" />
            <asp:RequiredFieldValidator ID="rfvPassword" runat="server" 
                ControlToValidate="txtPassword" 
                ErrorMessage="请输入密码" 
                ForeColor="Red" 
                Display="Dynamic" />
        </div>
        <div class="form-group">
            <label for="txtConfirmPassword">确认密码：</label>
            <asp:TextBox ID="txtConfirmPassword" runat="server" CssClass="form-control" TextMode="Password" placeholder="请再次输入密码" />
            <asp:CompareValidator ID="cvPassword" runat="server" 
                ControlToValidate="txtConfirmPassword" 
                ControlToCompare="txtPassword" 
                ErrorMessage="两次输入的密码不一致" 
                ForeColor="Red" 
                Display="Dynamic" />
        </div>
    </div>

    <!-- 提交按钮 -->
    <div class="form-actions">
        <asp:Button ID="btnRegister" runat="server" Text="注册" 
            CssClass="btn btn-success btn-large" 
            OnClick="BtnRegister_Click" />
    </div>

    <!-- 隐藏字段存储验证状态 -->
    <asp:HiddenField ID="hdnEmailVerified" runat="server" Value="false" />
    <asp:HiddenField ID="hdnPhoneVerified" runat="server" Value="false" />
</div>

<!-- 邮箱人机验证遮罩层 -->
<div id="emailVerificationModal" class="verification-modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>邮箱人机验证</h3>
            <span class="close-btn" onclick="closeEmailVerificationModal()">&times;</span>
        </div>
        <div class="modal-body">
            <div id="emailHumanCheckContainer" class="human-check-container"></div>
        </div>
    </div>
</div>

<!-- 手机人机验证遮罩层 -->
<div id="phoneVerificationModal" class="verification-modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>手机人机验证</h3>
            <span class="close-btn" onclick="closePhoneVerificationModal()">&times;</span>
        </div>
        <div class="modal-body">
            <div id="phoneHumanCheckContainer" class="human-check-container"></div>
        </div>
    </div>
</div>

<!-- 引入人机验证脚本 -->
<script src='<%= ResolveUrl("~/Scripts/CrossBrowserHumanCheck.js") %>' type="text/javascript"></script>

<style type="text/css">
    /* 注册表单样式 */
    .reg-form-container {
        max-width: 600px;
        margin: 0 auto;
        font-family: "Microsoft YaHei", "Segoe UI", Arial, sans-serif;
    }
    
    .form-section {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .form-section h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #1f2937;
        border-bottom: 2px solid #22c55e;
        padding-bottom: 8px;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #374151;
    }
    
    .form-control {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
    }
    
    .form-control:focus {
        border-color: #22c55e;
        outline: none;
        box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
    }
    
    .verification-code-group {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .code-input {
        flex: 1;
    }
    
    .send-code-btn {
        white-space: nowrap;
        min-width: 100px;
    }
    
    .btn {
        background: #22c55e;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
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
    
    .btn-success {
        background: #22c55e;
    }
    
    .btn-success:hover {
        background: #16a34a;
    }
    
    .btn-large {
        padding: 12px 30px;
        font-size: 16px;
        font-weight: bold;
    }
    
    .form-actions {
        text-align: center;
        margin-top: 30px;
    }
    
    /* 人机验证遮罩层样式 */
    .verification-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        /* IE8/IE9 fallback */
        background: #000000;
        filter: alpha(opacity=60);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(3px);
    }
    
    /* IE8/IE9 居中方案 */
    .ie8 .verification-modal,
    .ie9 .verification-modal {
        display: block;
        text-align: center;
    }
    
    .ie8 .verification-modal:before,
    .ie9 .verification-modal:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        width: 0;
    }
    
    .modal-content {
        background: #ffffff;
        /* IE8/IE9 渐变fallback */
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#f8fafc');
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 12px;
        /* IE8 border-radius fallback */
        behavior: url(ie-css3.htc);
        box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 10px 20px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        /* IE8/IE9 shadow fallback */
        filter: progid:DXImageTransform.Microsoft.dropshadow(OffX=0, OffY=5, Color='#33000000', Positive='true');
        max-width: 420px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        position: relative;
        border: 1px solid #e5e7eb;
        /* IE8/IE9 居中 */
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        margin: 0 auto;
    }
    
    /* IE8/IE9 特定样式 */
    .ie8 .modal-content,
    .ie9 .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -200px; /* 约为高度的一半 */
        margin-left: -210px; /* 约为宽度的一半 */
        width: 420px;
        display: block;
        vertical-align: top;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 24px 0 24px;
        background: transparent;
        *zoom: 1; /* IE7 clearfix */
    }
    
    .modal-header:after {
        content: "";
        display: table;
        clear: both;
    }
    
    /* IE8/IE9 header layout */
    .ie8 .modal-header,
    .ie9 .modal-header {
        display: block;
        position: relative;
        height: 50px;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #1f2937;
        font-size: 18px;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        border: none;
        padding: 0;
        line-height: 50px;
    }
    
    /* IE8/IE9 标题浮动 */
    .ie8 .modal-header h3,
    .ie9 .modal-header h3 {
        float: left;
        line-height: 36px;
        margin-top: 7px;
    }
    
    .close-btn {
        font-size: 24px;
        color: #6b7280;
        cursor: pointer;
        line-height: 1;
        padding: 8px;
        background: rgba(255, 255, 255, 0.6);
        /* IE8/IE9 fallback */
        background: #f0f0f0;
        filter: alpha(opacity=60);
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    /* IE8/IE9 关闭按钮 */
    .ie8 .close-btn,
    .ie9 .close-btn {
        float: right;
        display: block;
        text-align: center;
        line-height: 20px;
        margin-top: 7px;
    }
    
    .close-btn:hover {
        color: #374151;
        background: rgba(255, 255, 255, 0.9);
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .modal-body {
        padding: 16px 24px 24px 24px;
    }
    
    /* 人机验证控件在弹窗中的样式调整 */
    .modal-body .cb-human-check-widget {
        background: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
        margin: 0;
        max-width: none;
    }
    
    /* IE8 兼容性 */
    .verification-code-group {
        *zoom: 1;
    }
    .verification-code-group:after {
        content: "";
        display: table;
        clear: both;
    }
    
    /* IE8 不支持 flex，使用浮动 */
    .ie8 .verification-code-group .code-input {
        float: left;
        width: 70%;
        margin-right: 10px;
    }
    
    .ie8 .verification-code-group .send-code-btn {
        float: left;
        width: 25%;
    }
</style>

<script type="text/javascript">
    // 全局变量存储验证控件实例
    var emailHumanCheck = null;
    var phoneHumanCheck = null;
    
    // 邮箱验证码发送前的人机验证
    function sendEmailVerificationCode() {
        // 验证邮箱输入
        var emailInput = document.getElementById('<%= txtEmail.ClientID %>');
        if (!emailInput.value) {
            alert('请先输入邮箱地址！');
            return false;
        }
        
        // 检查邮箱格式
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailInput.value)) {
            alert('邮箱格式不正确！');
            return false;
        }
        
        // 显示人机验证
        showEmailVerificationModal();
        return false; // 阻止表单提交，等待人机验证完成
    }
    
    // 手机验证码发送前的人机验证
    function sendPhoneVerificationCode() {
        // 验证手机号输入
        var phoneInput = document.getElementById('<%= txtPhone.ClientID %>');
        if (!phoneInput.value) {
            alert('请先输入手机号码！');
            return false;
        }
        
        // 检查手机号格式
        var phonePattern = /^1[3-9]\d{9}$/;
        if (!phonePattern.test(phoneInput.value)) {
            alert('手机号码格式不正确！');
            return false;
        }
        
        // 显示人机验证
        showPhoneVerificationModal();
        return false; // 阻止表单提交，等待人机验证完成
    }
    
    // 显示邮箱验证弹窗
    function showEmailVerificationModal() {
        var modal = document.getElementById('emailVerificationModal');
        // IE8/IE9 兼容性处理
        if (document.body.className.indexOf('ie8') !== -1 || document.body.className.indexOf('ie9') !== -1) {
            modal.style.display = 'block';
        } else {
            modal.style.display = 'flex';
        }
        
        // 如果还没有初始化，则创建控件
        if (!emailHumanCheck) {
            try {
                emailHumanCheck = new CrossBrowserHumanCheck('emailHumanCheckContainer', {
                    onVerificationComplete: function(isVerified) {
                        document.getElementById('<%= hdnEmailVerified.ClientID %>').value = isVerified.toString();
                        
                        if (isVerified) {
                            // 验证成功，关闭弹窗并提交表单
                            closeEmailVerificationModal();
                            // 触发邮箱验证码发送
                            __doPostBack('<%= btnSendEmailCode.UniqueID %>', '');
                        } else {
                            alert('人机验证失败，请重试！');
                        }
                    }
                });
            } catch (e) {
                alert('人机验证控件初始化失败：' + e.message);
                closeEmailVerificationModal();
            }
        } else {
            // 重置验证状态
            emailHumanCheck.reset();
        }
    }
    
    // 显示手机验证弹窗
    function showPhoneVerificationModal() {
        var modal = document.getElementById('phoneVerificationModal');
        // IE8/IE9 兼容性处理
        if (document.body.className.indexOf('ie8') !== -1 || document.body.className.indexOf('ie9') !== -1) {
            modal.style.display = 'block';
        } else {
            modal.style.display = 'flex';
        }
        
        // 如果还没有初始化，则创建控件
        if (!phoneHumanCheck) {
            try {
                phoneHumanCheck = new CrossBrowserHumanCheck('phoneHumanCheckContainer', {
                    onVerificationComplete: function(isVerified) {
                        document.getElementById('<%= hdnPhoneVerified.ClientID %>').value = isVerified.toString();
                        
                        if (isVerified) {
                            // 验证成功，关闭弹窗并提交表单
                            closePhoneVerificationModal();
                            // 触发手机验证码发送
                            __doPostBack('<%= btnSendPhoneCode.UniqueID %>', '');
                        } else {
                            alert('人机验证失败，请重试！');
                        }
                    }
                });
            } catch (e) {
                alert('人机验证控件初始化失败：' + e.message);
                closePhoneVerificationModal();
            }
        } else {
            // 重置验证状态
            phoneHumanCheck.reset();
        }
    }
    
    // 关闭邮箱验证弹窗
    function closeEmailVerificationModal() {
        document.getElementById('emailVerificationModal').style.display = 'none';
    }
    
    // 关闭手机验证弹窗
    function closePhoneVerificationModal() {
        document.getElementById('phoneVerificationModal').style.display = 'none';
    }
    
    // 点击遮罩层关闭弹窗
    document.getElementById('emailVerificationModal').onclick = function(e) {
        if (e.target === this) {
            closeEmailVerificationModal();
        }
    };
    
    document.getElementById('phoneVerificationModal').onclick = function(e) {
        if (e.target === this) {
            closePhoneVerificationModal();
        }
    };
    
    // IE8/IE9 检测和样式调整
    (function() {
        var isIE8 = navigator.userAgent.indexOf('MSIE 8') !== -1;
        var isIE9 = navigator.userAgent.indexOf('MSIE 9') !== -1;
        
        if (isIE8) {
            document.body.className += ' ie8';
        }
        if (isIE9) {
            document.body.className += ' ie9';
        }
    })();
</script>