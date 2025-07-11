using System;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
/// 注册基础用户控件
/// 集成了人机验证功能的邮箱和手机注册
/// </summary>
public partial class Controls_UcRegBase : UserControl
{
    #region 事件定义

    /// <summary>
    /// 邮箱验证码发送事件
    /// </summary>
    public event EventHandler<VerificationCodeEventArgs> EmailCodeSending;

    /// <summary>
    /// 手机验证码发送事件
    /// </summary>
    public event EventHandler<VerificationCodeEventArgs> PhoneCodeSending;

    /// <summary>
    /// 用户注册事件
    /// </summary>
    public event EventHandler<UserRegisterEventArgs> UserRegistering;

    #endregion

    #region 属性

    /// <summary>
    /// 邮箱地址
    /// </summary>
    public string Email
    {
        get { return txtEmail.Text.Trim(); }
        set { txtEmail.Text = value; }
    }

    /// <summary>
    /// 手机号码
    /// </summary>
    public string Phone
    {
        get { return txtPhone.Text.Trim(); }
        set { txtPhone.Text = value; }
    }

    /// <summary>
    /// 用户名
    /// </summary>
    public string Username
    {
        get { return txtUsername.Text.Trim(); }
        set { txtUsername.Text = value; }
    }

    /// <summary>
    /// 密码
    /// </summary>
    public string Password
    {
        get { return txtPassword.Text; }
        set { txtPassword.Text = value; }
    }

    /// <summary>
    /// 邮箱验证码
    /// </summary>
    public string EmailCode
    {
        get { return txtEmailCode.Text.Trim(); }
        set { txtEmailCode.Text = value; }
    }

    /// <summary>
    /// 手机验证码
    /// </summary>
    public string PhoneCode
    {
        get { return txtPhoneCode.Text.Trim(); }
        set { txtPhoneCode.Text = value; }
    }

    /// <summary>
    /// 邮箱是否已通过人机验证
    /// </summary>
    public bool IsEmailVerified
    {
        get { return hdnEmailVerified.Value == "true"; }
    }

    /// <summary>
    /// 手机是否已通过人机验证
    /// </summary>
    public bool IsPhoneVerified
    {
        get { return hdnPhoneVerified.Value == "true"; }
    }

    #endregion

    #region 页面事件

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            InitializeControl();
        }
    }

    /// <summary>
    /// 发送邮箱验证码
    /// </summary>
    protected void BtnSendEmailCode_Click(object sender, EventArgs e)
    {
        try
        {
            // 检查是否通过人机验证
            if (!IsEmailVerified)
            {
                ShowMessage("请先完成人机验证！", MessageType.Error);
                return;
            }

            // 验证邮箱格式
            if (string.IsNullOrEmpty(Email))
            {
                ShowMessage("请输入邮箱地址！", MessageType.Error);
                return;
            }

            // 触发邮箱验证码发送事件
            var args = new VerificationCodeEventArgs
            {
                Contact = Email,
                Type = VerificationCodeType.Email
            };

            OnEmailCodeSending(args);

            if (args.Success)
            {
                ShowMessage("邮箱验证码已发送，请查收！", MessageType.Success);
                // 重置人机验证状态，要求下次发送时重新验证
                hdnEmailVerified.Value = "false";
            }
            else
            {
                ShowMessage(args.ErrorMessage ?? "邮箱验证码发送失败，请重试！", MessageType.Error);
            }
        }
        catch (Exception ex)
        {
            ShowMessage("发送邮箱验证码时发生错误：" + ex.Message, MessageType.Error);
        }
    }

    /// <summary>
    /// 发送手机验证码
    /// </summary>
    protected void BtnSendPhoneCode_Click(object sender, EventArgs e)
    {
        try
        {
            // 检查是否通过人机验证
            if (!IsPhoneVerified)
            {
                ShowMessage("请先完成人机验证！", MessageType.Error);
                return;
            }

            // 验证手机号格式
            if (string.IsNullOrEmpty(Phone))
            {
                ShowMessage("请输入手机号码！", MessageType.Error);
                return;
            }

            // 触发手机验证码发送事件
            var args = new VerificationCodeEventArgs
            {
                Contact = Phone,
                Type = VerificationCodeType.Phone
            };

            OnPhoneCodeSending(args);

            if (args.Success)
            {
                ShowMessage("手机验证码已发送，请查收！", MessageType.Success);
                // 重置人机验证状态，要求下次发送时重新验证
                hdnPhoneVerified.Value = "false";
            }
            else
            {
                ShowMessage(args.ErrorMessage ?? "手机验证码发送失败，请重试！", MessageType.Error);
            }
        }
        catch (Exception ex)
        {
            ShowMessage("发送手机验证码时发生错误：" + ex.Message, MessageType.Error);
        }
    }

    /// <summary>
    /// 用户注册
    /// </summary>
    protected void BtnRegister_Click(object sender, EventArgs e)
    {
        try
        {
            // 验证表单
            if (!ValidateForm())
            {
                return;
            }

            // 触发用户注册事件
            var args = new UserRegisterEventArgs
            {
                Email = Email,
                Phone = Phone,
                Username = Username,
                Password = Password,
                EmailCode = EmailCode,
                PhoneCode = PhoneCode
            };

            OnUserRegistering(args);

            if (args.Success)
            {
                ShowMessage("注册成功！", MessageType.Success);
                ClearForm();
            }
            else
            {
                ShowMessage(args.ErrorMessage ?? "注册失败，请重试！", MessageType.Error);
            }
        }
        catch (Exception ex)
        {
            ShowMessage("注册时发生错误：" + ex.Message, MessageType.Error);
        }
    }

    #endregion

    #region 私有方法

    /// <summary>
    /// 初始化控件
    /// </summary>
    private void InitializeControl()
    {
        // 设置默认值
        hdnEmailVerified.Value = "false";
        hdnPhoneVerified.Value = "false";
    }

    /// <summary>
    /// 验证表单
    /// </summary>
    private bool ValidateForm()
    {
        // 验证必填字段
        if (string.IsNullOrEmpty(Username))
        {
            ShowMessage("请输入用户名！", MessageType.Error);
            return false;
        }

        if (string.IsNullOrEmpty(Password))
        {
            ShowMessage("请输入密码！", MessageType.Error);
            return false;
        }

        if (txtPassword.Text != txtConfirmPassword.Text)
        {
            ShowMessage("两次输入的密码不一致！", MessageType.Error);
            return false;
        }

        // 至少需要一种联系方式
        bool hasEmail = !string.IsNullOrEmpty(Email) && !string.IsNullOrEmpty(EmailCode);
        bool hasPhone = !string.IsNullOrEmpty(Phone) && !string.IsNullOrEmpty(PhoneCode);

        if (!hasEmail && !hasPhone)
        {
            ShowMessage("请至少完成邮箱或手机号的验证！", MessageType.Error);
            return false;
        }

        return true;
    }

    /// <summary>
    /// 清空表单
    /// </summary>
    private void ClearForm()
    {
        txtEmail.Text = "";
        txtPhone.Text = "";
        txtUsername.Text = "";
        txtPassword.Text = "";
        txtConfirmPassword.Text = "";
        txtEmailCode.Text = "";
        txtPhoneCode.Text = "";
        hdnEmailVerified.Value = "false";
        hdnPhoneVerified.Value = "false";
    }

    /// <summary>
    /// 显示消息
    /// </summary>
    private void ShowMessage(string message, MessageType type)
    {
        string script = string.Format("alert('{0}');", message.Replace("'", "\\'"));
        ScriptManager.RegisterStartupScript(this, GetType(), "Message", script, true);
    }

    #endregion

    #region 事件触发方法

    /// <summary>
    /// 触发邮箱验证码发送事件
    /// </summary>
    protected virtual void OnEmailCodeSending(VerificationCodeEventArgs e)
    {
        EmailCodeSending?.Invoke(this, e);
    }

    /// <summary>
    /// 触发手机验证码发送事件
    /// </summary>
    protected virtual void OnPhoneCodeSending(VerificationCodeEventArgs e)
    {
        PhoneCodeSending?.Invoke(this, e);
    }

    /// <summary>
    /// 触发用户注册事件
    /// </summary>
    protected virtual void OnUserRegistering(UserRegisterEventArgs e)
    {
        UserRegistering?.Invoke(this, e);
    }

    #endregion
}

#region 事件参数类

/// <summary>
/// 验证码事件参数
/// </summary>
public class VerificationCodeEventArgs : EventArgs
{
    /// <summary>
    /// 联系方式（邮箱或手机号）
    /// </summary>
    public string Contact { get; set; }

    /// <summary>
    /// 验证码类型
    /// </summary>
    public VerificationCodeType Type { get; set; }

    /// <summary>
    /// 是否成功
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// 错误消息
    /// </summary>
    public string ErrorMessage { get; set; }
}

/// <summary>
/// 用户注册事件参数
/// </summary>
public class UserRegisterEventArgs : EventArgs
{
    /// <summary>
    /// 邮箱
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// 手机号
    /// </summary>
    public string Phone { get; set; }

    /// <summary>
    /// 用户名
    /// </summary>
    public string Username { get; set; }

    /// <summary>
    /// 密码
    /// </summary>
    public string Password { get; set; }

    /// <summary>
    /// 邮箱验证码
    /// </summary>
    public string EmailCode { get; set; }

    /// <summary>
    /// 手机验证码
    /// </summary>
    public string PhoneCode { get; set; }

    /// <summary>
    /// 是否成功
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// 错误消息
    /// </summary>
    public string ErrorMessage { get; set; }
}

/// <summary>
/// 验证码类型
/// </summary>
public enum VerificationCodeType
{
    /// <summary>
    /// 邮箱
    /// </summary>
    Email,

    /// <summary>
    /// 手机
    /// </summary>
    Phone
}

/// <summary>
/// 消息类型
/// </summary>
public enum MessageType
{
    /// <summary>
    /// 成功
    /// </summary>
    Success,

    /// <summary>
    /// 错误
    /// </summary>
    Error,

    /// <summary>
    /// 警告
    /// </summary>
    Warning,

    /// <summary>
    /// 信息
    /// </summary>
    Info
}

#endregion