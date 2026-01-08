"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DocumentTypeTabs } from "@/components/document-type-tabs";
import { DocumentForm } from "@/components/document-form";
import { DocumentEditor } from "@/components/document-editor";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentType } from "@/lib/document-types";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [documentType, setDocumentType] = useState<DocumentType>("通知");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 切换公文类型时清空表单
  const handleTypeChange = useCallback((type: DocumentType) => {
    setDocumentType(type);
    setFormData({});
  }, []);

  // 更新表单数据
  const handleFormChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 生成公文
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: documentType,
          fields: formData,
        }),
      });

      // 检查是否是JSON错误响应
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成失败");
      }

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法读取响应");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith("data: ")) continue;

          const data = trimmedLine.slice(6);
          if (data === "[DONE]") continue;

          try {
            const json = JSON.parse(data);
            if (json.content) {
              setContent((prev) => prev + json.content);
            }
            if (json.error) {
              throw new Error(json.error);
            }
          } catch (e) {
            if (e instanceof SyntaxError) {
              // 忽略JSON解析错误
            } else {
              throw e;
            }
          }
        }
      }
    } catch (error) {
      console.error("生成失败:", error);
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setContent(`生成失败: ${errorMessage}\n\n请检查：\n1. .env.local 文件中是否正确配置了 OPENAI_API_KEY\n2. API地址是否正确（OPENAI_API_BASE）\n3. 模型名称是否正确（OPENAI_MODEL）`);
    } finally {
      setIsGenerating(false);
    }
  }, [documentType, formData]);

  // 清空内容
  const handleClear = useCallback(() => {
    setContent("");
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {/* 标题区 */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">一键生成规范公文</span>
            </div>
            <p className="mt-3 text-muted-foreground">
              AI智能起草，符合国标格式
            </p>
          </div>

          {/* 公文类型选择 */}
          <div className="mb-6">
            <DocumentTypeTabs
              selectedType={documentType}
              onTypeChange={handleTypeChange}
            />
          </div>

          {/* 表单区域 */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <DocumentForm
                documentType={documentType}
                formData={formData}
                onFormChange={handleFormChange}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </CardContent>
          </Card>

          {/* 编辑器区域 */}
          <DocumentEditor
            content={content}
            onContentChange={setContent}
            onClear={handleClear}
            isGenerating={isGenerating}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
