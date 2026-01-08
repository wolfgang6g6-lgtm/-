"use client";

import { useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Trash2, Printer, Check } from "lucide-react";
import { useState } from "react";

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onClear: () => void;
  isGenerating: boolean;
}

// 格式化公文内容，识别不同层级并应用样式
function formatDocumentContent(content: string): string {
  if (!content) return "";

  const lines = content.split("\n");
  const formattedLines = lines.map((line, index) => {
    const trimmedLine = line.trim();

    // 标题行
    if (
      /^关于.+的(通知|请示|报告|决定|函|批复|意见|会议纪要|工作总结)$/.test(trimmedLine) ||
      /^.{2,20}(合同|协议)$/.test(trimmedLine) ||
      /^.{2,30}会议纪要$/.test(trimmedLine) ||
      /^.{2,30}工作总结$/.test(trimmedLine)
    ) {
      return `<div class="doc-title">${escapeHtml(trimmedLine)}</div>`;
    }

    // 一级标题：一、二、三、
    if (/^[一二三四五六七八九十]+、/.test(trimmedLine)) {
      return `<div class="heading-1">${escapeHtml(line)}</div>`;
    }

    // 二级标题：（一）（二）
    if (/^（[一二三四五六七八九十]+）/.test(trimmedLine)) {
      return `<div class="heading-2">${escapeHtml(line)}</div>`;
    }

    // 三级标题：1. 2. 3.
    if (/^\d+[.、．]/.test(trimmedLine)) {
      return `<div class="heading-3">${escapeHtml(line)}</div>`;
    }

    // 四级标题：（1）（2）
    if (/^（\d+）/.test(trimmedLine)) {
      return `<div class="heading-3">${escapeHtml(line)}</div>`;
    }

    // 日期行
    if (
      /^[二〇零一三四五六七八九]+年[一二三四五六七八九十]+月[一二三四五六七八九十]+日$/.test(trimmedLine) ||
      /^\d{4}年\d{1,2}月\d{1,2}日$/.test(trimmedLine)
    ) {
      return `<div class="doc-date">${escapeHtml(trimmedLine)}</div>`;
    }

    // 署名行
    if (
      /^.*(公司|集团|局|部|委员会|办公室|中心|协会|委|厅|院|所|处|科|股|室)$/.test(trimmedLine) &&
      trimmedLine.length <= 30
    ) {
      const nextLine = lines[index + 1]?.trim() || "";
      if (
        /^[二〇零一三四五六七八九]+年/.test(nextLine) ||
        /^\d{4}年/.test(nextLine) ||
        nextLine === ""
      ) {
        return `<div class="doc-date">${escapeHtml(trimmedLine)}</div>`;
      }
    }

    // 空行
    if (trimmedLine === "") {
      return `<div class="doc-content">&nbsp;</div>`;
    }

    // 普通正文
    return `<div class="doc-content">${escapeHtml(line)}</div>`;
  });

  return formattedLines.join("");
}

// HTML转义
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function DocumentEditor({
  content,
  onContentChange,
  onClear,
  isGenerating,
}: DocumentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // 格式化HTML
  const getFormattedHtml = useCallback(() => {
    if (!content) {
      return '<span class="text-muted-foreground">生成的公文内容将显示在这里，您可以直接编辑...</span>';
    }
    return formatDocumentContent(content);
  }, [content]);

  // 同步content到编辑器
  useEffect(() => {
    if (editorRef.current) {
      const html = getFormattedHtml();
      editorRef.current.innerHTML = html;

      // 滚动到底部
      if (isGenerating && content) {
        editorRef.current.scrollTop = editorRef.current.scrollHeight;
      }
    }
  }, [content, isGenerating, getFormattedHtml]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const handlePrint = () => {
    if (!content) return;

    const formattedHtml = formatDocumentContent(content);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>公文打印</title>
          <style>
            @page {
              size: A4;
              margin: 37mm 26mm 35mm 28mm;
            }
            body {
              font-family: "FangSong_GB2312", "仿宋_GB2312", "FangSong", "仿宋", serif;
              font-size: 16pt;
              line-height: 28pt;
              color: #000;
            }
            .doc-title {
              font-family: "FZXiaoBiaoSong-B05S", "方正小标宋简体", "SimSun", "宋体", serif;
              font-size: 22pt;
              font-weight: normal;
              text-align: center;
              line-height: 1.5;
              margin: 0 0 1em 0;
            }
            .heading-1 {
              font-family: "SimHei", "黑体", sans-serif;
              font-size: 16pt;
              font-weight: normal;
              line-height: 28pt;
            }
            .heading-2 {
              font-family: "KaiTi_GB2312", "楷体_GB2312", "KaiTi", "楷体", serif;
              font-size: 16pt;
              font-weight: bold;
              line-height: 28pt;
            }
            .heading-3 {
              font-family: "FangSong_GB2312", "仿宋_GB2312", "FangSong", "仿宋", serif;
              font-size: 16pt;
              font-weight: bold;
              line-height: 28pt;
            }
            .doc-content {
              font-family: "FangSong_GB2312", "仿宋_GB2312", "FangSong", "仿宋", serif;
              font-size: 16pt;
              font-weight: normal;
              line-height: 28pt;
              text-indent: 2em;
            }
            .doc-date {
              font-family: "FangSong_GB2312", "仿宋_GB2312", "FangSong", "仿宋", serif;
              font-size: 16pt;
              font-weight: normal;
              text-align: right;
              padding-right: 4em;
            }
          </style>
        </head>
        <body>
          ${formattedHtml}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleInput = () => {
    if (editorRef.current && !isGenerating) {
      onContentChange(editorRef.current.innerText);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <span className="text-sm font-medium text-muted-foreground">
          公文内容（可直接编辑）
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!content}
          >
            {copied ? (
              <>
                <Check className="mr-1 h-4 w-4 text-green-500" />
                已复制
              </>
            ) : (
              <>
                <Copy className="mr-1 h-4 w-4" />
                复制
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={!content}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            清空
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            disabled={!content}
          >
            <Printer className="mr-1 h-4 w-4" />
            打印/PDF
          </Button>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable={!isGenerating}
        onInput={handleInput}
        className="document-editor min-h-[400px] p-6 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        style={{ wordBreak: "break-word" }}
        suppressContentEditableWarning
      />
    </Card>
  );
}
