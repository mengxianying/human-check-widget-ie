using System;
using System.Web.UI;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // 页面首次加载时的初始化代码  
            lblMessage.Text = "";
        }
    }

    protected void BtnSubmit_Click(object sender, EventArgs e)
    {
        try
        {
            // 检查页面验证  
            if (!Page.IsValid)
            {
                ShowMessage("请检查表单输入是否正确！", false);
                return;
            }

            // 检查人机验证  
            bool emailVerified = hdnEmailVerified.Value == "true";
            bool phoneVerified = hdnPhoneVerified.Value == "true";

            if (!emailVerified && !phoneVerified)
            {
                ShowMessage(string.Format("请完成邮箱和短信验证"), false);
                return;
            }

            // 获取表单数据  
            string username = txtUsername.Text.Trim();
            string email = txtEmail.Text.Trim();

            // 这里可以添加业务逻辑，比如保存到数据库  
            // 示例：保存用户信息  
            SaveUserInfo(username, email);

            // 验证成功  
            string verificationInfo = "";
            if (emailVerified && phoneVerified)
                verificationInfo = "邮箱和短信已验证通过";
            else if (emailVerified)
                verificationInfo = "邮箱已验证通过";
            else if (phoneVerified)
                verificationInfo ="短信已验证通过";

            ShowMessage(string.Format("表单提交成功！欢迎 {0}！{1}", username, verificationInfo), true);

            // 清空表单  
            ClearForm();
        }
        catch (Exception ex)
        {
            // 记录错误日志  
            System.Diagnostics.Debug.WriteLine(string.Format("表单提交错误: {0}", ex.Message));
            ShowMessage("false", false);
        }
    }

    protected void BtnReset_Click(object sender, EventArgs e)
    {
        // 重置表单
        ClearForm();
        ShowMessage("reset", true);
    }

    /// <summary>
    /// 显示消息
    /// </summary>
    /// <param name="message">消息内容</param>
    /// <param name="isSuccess">是否成功</param>
    private void ShowMessage(string message, bool isSuccess)
    {
        lblMessage.Text = message;

        // 使用JavaScript显示消息  
        string script = string.Format("showResult('{0}', {1});", message.Replace("'", "\\'"), isSuccess.ToString().ToLower());
        ClientScript.RegisterStartupScript(this.GetType(), "showMessage", script, true);
    }

    /// <summary>  
    /// 清空表单  
    /// </summary>  
    /// <summary>  
    /// 清空表单  
    /// </summary>  
    private void ClearForm()
    {
        txtUsername.Text = "";
        txtEmail.Text = "";
        hdnEmailVerified.Value = "";
        hdnPhoneVerified.Value = "";

        // 重置人机验证控件和状态显示  
        string resetScript =  "setTimeout(function() {" + "// 重置验证控件\\n" +  "if (window.emailHumanCheck && typeof window.emailHumanCheck.reset === 'function') {" +      "window.emailHumanCheck.reset();" +   "}" +  "if (window.phoneHumanCheck && typeof window.phoneHumanCheck.reset === 'function') {" +               "window.phoneHumanCheck.reset();" +          "}" +     "// 重置状态显示\\n" +       "document.getElementById('emailStatus').textContent = '邮箱验证：未验证';" +           "document.getElementById('emailStatus').className = 'status-text';" +         "document.getElementById('phoneStatus').textContent = '短信验证：未验证';" +     "document.getElementById('phoneStatus').className = 'status-text';" +   "}, 100);";
        ClientScript.RegisterStartupScript(this.GetType(), "resetHumanCheck", resetScript, true);
    }

    /// <summary>  
    /// 保存用户信息 (示例方法)  
    /// </summary>  
    /// <param name="username">用户名</param>  
    /// <param name="email">邮箱</param>  
    private void SaveUserInfo(string username, string email)
    {
        System.Diagnostics.Debug.WriteLine(string.Format("用户注册 - 用户名: {0}, 邮箱: {1}, 时间: {2}", username, email, DateTime.Now));
    }
}