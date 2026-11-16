# 读页 PaperLens Web

适合 iPad Safari 和桌面浏览器的论文精读网页。PDF 在浏览器本地渲染，只有你主动选中的文字和当前页上下文会发送给已配置的 AI 接口。

## iPad 使用

1. 用 Safari 打开部署后的 HTTPS 地址。
2. 点击 Safari 的“分享”，选择“添加到主屏幕”。
3. 点击“打开 PDF”，从 iPad“文件”App 选择论文。
4. 长按或划过英文，使用“翻译 / 解释术语 / 解读数据”。
5. 右侧“继续问这篇论文”可以自由提问。
6. 点击右上角齿轮，配置 OpenAI 兼容接口。

DeepSeek 示例配置：

- API Base URL：`https://api.deepseek.com`
- 模型名称：`deepseek-flash`
- API Key：在 DeepSeek API 控制台单独创建

密钥只保存在当前浏览器的 localStorage，不写入网站源码或 GitHub 仓库。

## 当前限制

- 扫描版图片 PDF 暂未接入 OCR。
- 网页版不能把解释直接写入 GoodNotes，需要和 GoodNotes 分屏使用。
- 如果 AI 服务商拒绝浏览器跨域请求，需要增加后端代理。
- PDF.js 版本为 `5.6.205`，许可证见 `vendor/PDFJS-LICENSE.txt`。
