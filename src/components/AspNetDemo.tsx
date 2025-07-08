import React, { useEffect } from 'react';

declare global {
  interface Window {
    HumanCheckWidget: any;
  }
}

const AspNetDemo = () => {
  useEffect(() => {
    // 模拟加载IE8兼容的JavaScript控件
    const initIE8Widget = () => {
      if (typeof window !== 'undefined') {
        // 这里会由IE8HumanCheck.js文件提供HumanCheckWidget构造函数
        const container = document.getElementById('ie8-human-check');
        if (container) {
          container.innerHTML = `
            <div class="human-check-widget">
              <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; max-width: 320px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <div style="font-weight: bold;">🛡️ 人机验证</div>
                  <button onclick="window.switchMode && window.switchMode()" style="background: none; border: none; cursor: pointer; font-size: 16px;">⟲</button>
                </div>
                <div>
                  <p style="font-size: 14px; color: #64748b; margin-bottom: 12px;">拖动滑块完成验证</p>
                  <div style="background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 20px; height: 40px; position: relative; cursor: pointer;">
                    <div id="slider-thumb" style="background: #22c55e; border-radius: 18px; height: 36px; width: 36px; position: absolute; top: 2px; left: 2px; cursor: pointer; text-align: center; line-height: 36px; color: white; font-size: 14px;">→</div>
                    <div style="position: absolute; top: 50%; left: 50%; margin-top: -8px; margin-left: -30px; font-size: 14px; color: #64748b; pointer-events: none;">向右滑动</div>
                  </div>
                </div>
                <div style="text-align: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                  <span style="font-size: 14px; color: #64748b;">🛡️ 等待验证</span>
                </div>
              </div>
            </div>
          `;
        }
      }
    };

    setTimeout(initIE8Widget, 100);
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-foreground">ASP.NET人机验证控件</h1>
          <p className="text-muted-foreground mb-2">兼容IE8及以上浏览器</p>
          <p className="text-sm text-muted-foreground">纯JavaScript实现，无框架依赖</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* 演示控件 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-foreground">验证控件演示</h2>
            <div id="ie8-human-check" className="mx-auto"></div>
          </div>

          {/* ASP.NET集成说明 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">ASP.NET集成步骤</h3>
            <div className="space-y-6 text-sm">
              
              <div>
                <h4 className="font-medium text-foreground mb-2">1. 添加JavaScript文件</h4>
                <p className="text-muted-foreground mb-2">将IE8HumanCheck.js放入项目Scripts文件夹</p>
                <code className="block bg-muted p-3 rounded text-xs font-mono">
                  Scripts/IE8HumanCheck.js
                </code>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">2. ASPX页面引用</h4>
                <p className="text-muted-foreground mb-2">在页面头部引用脚本文件</p>
                <code className="block bg-muted p-3 rounded text-xs font-mono whitespace-pre">
{`<%-- 在Page头部添加 --%>
<script src="Scripts/IE8HumanCheck.js"></script>`}
                </code>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">3. 表单集成</h4>
                <p className="text-muted-foreground mb-2">在需要验证的表单中添加控件</p>
                <code className="block bg-muted p-3 rounded text-xs font-mono whitespace-pre">
{`<!-- HTML标记 -->
<div id="humanCheckContainer"></div>
<asp:HiddenField ID="hdnVerified" runat="server" />

<script type="text/javascript">
    var humanCheck = new HumanCheckWidget('humanCheckContainer', {
        onVerificationComplete: function(isVerified) {
            document.getElementById('<%= hdnVerified.ClientID %>').value = isVerified;
        }
    });
</script>`}
                </code>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">4. 后台验证代码</h4>
                <p className="text-muted-foreground mb-2">在按钮点击事件中验证</p>
                <code className="block bg-muted p-3 rounded text-xs font-mono whitespace-pre">
{`protected void btnSubmit_Click(object sender, EventArgs e)
{
    // 检查人机验证
    if (hdnVerified.Value == "true")
    {
        // 验证通过，处理表单提交
        Response.Write("验证成功，表单提交！");
    }
    else
    {
        // 验证失败
        ClientScript.RegisterStartupScript(this.GetType(), 
            "alert", "alert('请完成人机验证！');", true);
    }
}`}
                </code>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">5. Web.config配置（可选）</h4>
                <p className="text-muted-foreground mb-2">添加MIME类型支持（如果需要）</p>
                <code className="block bg-muted p-3 rounded text-xs font-mono whitespace-pre">
{`<system.webServer>
  <staticContent>
    <mimeMap fileExtension=".js" mimeType="application/javascript" />
  </staticContent>
</system.webServer>`}
                </code>
              </div>

            </div>
          </div>

          {/* 功能特性 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">控件特性</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-success mb-2">✅ 兼容性</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• IE8+ 浏览器支持</li>
                  <li>• 无框架依赖</li>
                  <li>• 纯JavaScript实现</li>
                  <li>• 响应式设计</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-success mb-2">🔒 验证方式</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 滑块拖拽验证</li>
                  <li>• 数学题计算</li>
                  <li>• 图案点击验证</li>
                  <li>• 可切换验证模式</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 下载链接 */}
          <div className="text-center">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                完整的JavaScript文件已生成，可直接用于ASP.NET项目
              </p>
              <p className="text-xs text-muted-foreground">
                文件位置：src/components/IE8HumanCheck.js
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspNetDemo;