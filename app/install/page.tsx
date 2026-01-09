"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";

export default function InstallPage() {
  const [copied, setCopied] = useState(false);
  const appUrl = "https://ruby-eight-80.vercel.app";

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogo = () => {
    const link = document.createElement("a");
    link.href = "/logo.svg";
    link.download = "logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">钉钉/企业微信接入指南</h1>
          <p className="text-muted-foreground">
            请将以下信息提供给您的企业管理员，或直接登录管理后台配置。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. 必需信息</CardTitle>
            <CardDescription>在创建应用时填写以下内容</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">应用首页地址 / PC端首页地址</label>
              <div className="flex gap-2">
                <code className="flex-1 p-3 bg-muted rounded border font-mono text-sm overflow-x-auto whitespace-nowrap">
                  {appUrl}
                </code>
                <Button onClick={handleCopy} variant="outline" size="icon">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">应用图标</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <img src="/logo.svg" alt="Logo" className="w-10 h-10 text-white" />
                </div>
                <Button onClick={handleDownloadLogo} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  下载图标文件
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. 操作步骤 (钉钉)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li>
                登录 <a href="https://open-dev.dingtalk.com" target="_blank" className="text-primary hover:underline">钉钉开发者后台</a> (电脑端)
              </li>
              <li>点击 <strong>应用开发</strong> -&gt; <strong>企业内部开发</strong> -&gt; <strong>创建应用</strong></li>
              <li>填写应用名称 (如"公文助理") 并上传上方下载的图标</li>
              <li>在 <strong>开发管理</strong> 中，将 <strong>应用首页地址</strong> 和 <strong>PC端首页地址</strong> 都填入上方复制的链接</li>
              <li>点击 <strong>版本管理与发布</strong> -&gt; <strong>发布</strong></li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
