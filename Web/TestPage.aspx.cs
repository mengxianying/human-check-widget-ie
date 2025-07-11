using System;
using System.Web.UI;

/// <summary>
/// 测试页面代码背后
/// </summary>
public partial class TestPage : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            // 页面初始化
        }
    }

    /// <summary>
    /// 处理邮箱验证码发送
    /// </summary>
    protected void UcRegBase_EmailCodeSending(object sender, VerificationCodeEventArgs e)
    {
        try
        {
            // 这里应该调用真实的邮箱发送服务
            // 示例代码：
            // var emailService = new EmailService();
            // var result = emailService.SendVerificationCode(e.Contact);
            
            // 模拟发送逻辑
            if (IsValidEmail(e.Contact))
            {
                // 模拟生成验证码
                string verificationCode = GenerateVerificationCode();
                
                // 这里应该保存验证码到数据库或缓存
                // Session["EmailCode_" + e.Contact] = verificationCode;
                
                // 模拟发送邮件
                // SendEmail(e.Contact, "验证码", $"您的验证码是：{verificationCode}");
                
                e.Success = true;
                
                // 记录日志
                System.Diagnostics.Debug.WriteLine($"邮箱验证码已发送到：{e.Contact}，验证码：{verificationCode}");
            }
            else
            {
                e.Success = false;
                e.ErrorMessage = "邮箱地址格式不正确";
            }
        }
        catch (Exception ex)
        {
            e.Success = false;
            e.ErrorMessage = "发送邮箱验证码失败：" + ex.Message;
            
            // 记录错误日志
            System.Diagnostics.Debug.WriteLine($"发送邮箱验证码异常：{ex}");
        }
    }

    /// <summary>
    /// 处理手机验证码发送
    /// </summary>
    protected void UcRegBase_PhoneCodeSending(object sender, VerificationCodeEventArgs e)
    {
        try
        {
            // 这里应该调用真实的短信发送服务
            // 示例代码：
            // var smsService = new SmsService();
            // var result = smsService.SendVerificationCode(e.Contact);
            
            // 模拟发送逻辑
            if (IsValidPhone(e.Contact))
            {
                // 模拟生成验证码
                string verificationCode = GenerateVerificationCode();
                
                // 这里应该保存验证码到数据库或缓存
                // Session["PhoneCode_" + e.Contact] = verificationCode;
                
                // 模拟发送短信
                // SendSms(e.Contact, $"【您的应用】验证码：{verificationCode}，5分钟内有效。");
                
                e.Success = true;
                
                // 记录日志
                System.Diagnostics.Debug.WriteLine($"手机验证码已发送到：{e.Contact}，验证码：{verificationCode}");
            }
            else
            {
                e.Success = false;
                e.ErrorMessage = "手机号码格式不正确";
            }
        }
        catch (Exception ex)
        {
            e.Success = false;
            e.ErrorMessage = "发送手机验证码失败：" + ex.Message;
            
            // 记录错误日志
            System.Diagnostics.Debug.WriteLine($"发送手机验证码异常：{ex}");
        }
    }

    /// <summary>
    /// 处理用户注册
    /// </summary>
    protected void UcRegBase_UserRegistering(object sender, UserRegisterEventArgs e)
    {
        try
        {
            // 验证验证码
            bool emailValid = string.IsNullOrEmpty(e.Email) || ValidateVerificationCode(e.Email, e.EmailCode, "Email");
            bool phoneValid = string.IsNullOrEmpty(e.Phone) || ValidateVerificationCode(e.Phone, e.PhoneCode, "Phone");
            
            if (!emailValid && !phoneValid)
            {
                e.Success = false;
                e.ErrorMessage = "验证码错误或已过期";
                return;
            }

            // 检查用户名是否已存在
            if (IsUsernameExists(e.Username))
            {
                e.Success = false;
                e.ErrorMessage = "用户名已存在";
                return;
            }

            // 检查邮箱是否已注册
            if (!string.IsNullOrEmpty(e.Email) && IsEmailExists(e.Email))
            {
                e.Success = false;
                e.ErrorMessage = "邮箱已被注册";
                return;
            }

            // 检查手机号是否已注册
            if (!string.IsNullOrEmpty(e.Phone) && IsPhoneExists(e.Phone))
            {
                e.Success = false;
                e.ErrorMessage = "手机号已被注册";
                return;
            }

            // 创建用户
            var userId = CreateUser(e);
            
            if (userId > 0)
            {
                e.Success = true;
                
                // 记录日志
                System.Diagnostics.Debug.WriteLine($"用户注册成功：{e.Username}，ID：{userId}");
                
                // 可以在这里添加其他逻辑，如发送欢迎邮件等
            }
            else
            {
                e.Success = false;
                e.ErrorMessage = "用户创建失败";
            }
        }
        catch (Exception ex)
        {
            e.Success = false;
            e.ErrorMessage = "注册失败：" + ex.Message;
            
            // 记录错误日志
            System.Diagnostics.Debug.WriteLine($"用户注册异常：{ex}");
        }
    }

    #region 辅助方法

    /// <summary>
    /// 验证邮箱格式
    /// </summary>
    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// 验证手机号格式
    /// </summary>
    private bool IsValidPhone(string phone)
    {
        return System.Text.RegularExpressions.Regex.IsMatch(phone, @"^1[3-9]\d{9}$");
    }

    /// <summary>
    /// 生成验证码
    /// </summary>
    private string GenerateVerificationCode()
    {
        Random random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    /// <summary>
    /// 验证验证码
    /// </summary>
    private bool ValidateVerificationCode(string contact, string code, string type)
    {
        // 这里应该从数据库或缓存中验证验证码
        // 示例代码：
        // string savedCode = Session[type + "Code_" + contact] as string;
        // return !string.IsNullOrEmpty(savedCode) && savedCode == code;
        
        // 演示用：所有6位数字验证码都认为有效
        return !string.IsNullOrEmpty(code) && code.Length == 6 && System.Text.RegularExpressions.Regex.IsMatch(code, @"^\d{6}$");
    }

    /// <summary>
    /// 检查用户名是否存在
    /// </summary>
    private bool IsUsernameExists(string username)
    {
        // 这里应该查询数据库
        // 演示用：假设 "admin" 和 "test" 已存在
        return username.ToLower() == "admin" || username.ToLower() == "test";
    }

    /// <summary>
    /// 检查邮箱是否存在
    /// </summary>
    private bool IsEmailExists(string email)
    {
        // 这里应该查询数据库
        // 演示用：假设 "test@example.com" 已存在
        return email.ToLower() == "test@example.com";
    }

    /// <summary>
    /// 检查手机号是否存在
    /// </summary>
    private bool IsPhoneExists(string phone)
    {
        // 这里应该查询数据库
        // 演示用：假设 "13800138000" 已存在
        return phone == "13800138000";
    }

    /// <summary>
    /// 创建用户
    /// </summary>
    private int CreateUser(UserRegisterEventArgs e)
    {
        // 这里应该在数据库中创建用户记录
        // 示例代码：
        // using (var conn = new SqlConnection(connectionString))
        // {
        //     var sql = "INSERT INTO Users (Username, Password, Email, Phone, CreateTime) VALUES (@username, @password, @email, @phone, @createTime); SELECT SCOPE_IDENTITY()";
        //     var userId = conn.QuerySingle<int>(sql, new { 
        //         username = e.Username, 
        //         password = HashPassword(e.Password), 
        //         email = e.Email, 
        //         phone = e.Phone,
        //         createTime = DateTime.Now 
        //     });
        //     return userId;
        // }
        
        // 演示用：返回模拟的用户ID
        return new Random().Next(1000, 9999);
    }

    /// <summary>
    /// 密码哈希（示例）
    /// </summary>
    private string HashPassword(string password)
    {
        // 这里应该使用安全的哈希算法，如 BCrypt
        // 演示用：简单的 MD5（实际项目中不推荐）
        using (var md5 = System.Security.Cryptography.MD5.Create())
        {
            byte[] data = md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(data);
        }
    }

    #endregion
}