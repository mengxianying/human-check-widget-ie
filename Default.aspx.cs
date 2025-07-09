using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

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

    protected void btnSubmit_Click(object sender, EventArgs e)
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
            if (hdnVerified.Value != "true")
            {
                ShowMessage("请先完成人机验证！", false);
                return;
            }

            // 获取表单数据
            string username = txtUsername.Text.Trim();
            string email = txtEmail.Text.Trim();

            // 这里可以添加业务逻辑，比如保存到数据库
            // 示例：保存用户信息
            SaveUserInfo(username, email);

            // 验证成功
            ShowMessage($"表单提交成功！欢迎 {username}！", true);
            
            // 清空表单
            ClearForm();
        }
        catch (Exception ex)
        {
            // 记录错误日志
            System.Diagnostics.Debug.WriteLine($"表单提交错误: {ex.Message}");
            ShowMessage("提交失败，请稍后重试！", false);
        }
    }

    protected void btnReset_Click(object sender, EventArgs e)
    {
        // 重置表单
        ClearForm();
        ShowMessage("表单已重置", true);
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
        string script = $"showResult('{message.Replace("'", "\\'")}', {isSuccess.ToString().ToLower()});";
        ClientScript.RegisterStartupScript(this.GetType(), "showMessage", script, true);
    }

    /// <summary>
    /// 清空表单
    /// </summary>
    private void ClearForm()
    {
        txtUsername.Text = "";
        txtEmail.Text = "";
        hdnVerified.Value = "";
        
        // 重置人机验证控件
        string resetScript = @"
            setTimeout(function() {
                if (window.humanCheck && typeof window.humanCheck.reset === 'function') {
                    window.humanCheck.reset();
                }
            }, 100);
        ";
        ClientScript.RegisterStartupScript(this.GetType(), "resetHumanCheck", resetScript, true);
    }

    /// <summary>
    /// 保存用户信息 (示例方法)
    /// </summary>
    /// <param name="username">用户名</param>
    /// <param name="email">邮箱</param>
    private void SaveUserInfo(string username, string email)
    {
        // 这里可以添加数据库保存逻辑
        // 示例：
        /*
        try
        {
            using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                string sql = "INSERT INTO Users (Username, Email, CreateTime) VALUES (@Username, @Email, @CreateTime)";
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@Username", username);
                    cmd.Parameters.AddWithValue("@Email", email);
                    cmd.Parameters.AddWithValue("@CreateTime", DateTime.Now);
                    
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        catch (Exception ex)
        {
            // 记录错误日志
            System.Diagnostics.Debug.WriteLine($"保存用户信息失败: {ex.Message}");
            throw;
        }
        */
        
        // 临时方案：记录到应用程序日志
        System.Diagnostics.Debug.WriteLine($"用户注册 - 用户名: {username}, 邮箱: {email}, 时间: {DateTime.Now}");
    }
}