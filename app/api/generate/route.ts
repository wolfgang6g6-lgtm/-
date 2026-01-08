import { NextRequest } from "next/server";
import { buildPrompt } from "@/lib/prompts";
import { DocumentType } from "@/lib/document-types";

export async function POST(req: NextRequest) {
  try {
    const { type, fields } = await req.json();

    // 验证必要参数
    if (!type || !fields) {
      return new Response(
        JSON.stringify({ error: "缺少必要参数" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 构建提示词
    const prompt = buildPrompt(type as DocumentType, fields);

    // 获取API配置
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "未配置API密钥，请在.env.local中设置OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 调用OpenAI API（流式）
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "你是一位专业的公文写作专家，精通中国党政机关公文格式标准。请直接输出公文内容，不要添加任何额外说明或解释。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API调用失败:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: `AI服务调用失败: ${response.status}`,
          detail: errorText
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 转发流式响应
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let buffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "无法读取响应" })}\n\n`));
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              break;
            }

            // 解码并添加到buffer
            buffer += decoder.decode(value, { stream: true });

            // 按行分割处理
            const lines = buffer.split("\n");
            // 保留最后一行（可能不完整）
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

              const data = trimmedLine.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch {
                // 忽略JSON解析错误
              }
            }
          }
        } catch (error) {
          console.error("流处理错误:", error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "流处理错误" })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("请求处理错误:", error);
    return new Response(
      JSON.stringify({ error: "服务器内部错误", detail: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
