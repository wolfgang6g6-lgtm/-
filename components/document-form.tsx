"use client";

import { DocumentType, getDocumentTypeConfig } from "@/lib/document-types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface DocumentFormProps {
  documentType: DocumentType;
  formData: Record<string, string>;
  onFormChange: (name: string, value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function DocumentForm({
  documentType,
  formData,
  onFormChange,
  onGenerate,
  isGenerating,
}: DocumentFormProps) {
  const config = getDocumentTypeConfig(documentType);

  if (!config) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {config.fields.map((field) => (
          <div
            key={field.name}
            className={cn(field.type === "textarea" ? "md:col-span-2" : "")}
          >
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.type === "input" ? (
              <Input
                id={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => onFormChange(field.name, e.target.value)}
                className="mt-1.5"
              />
            ) : (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => onFormChange(field.name, e.target.value)}
                className="mt-1.5 min-h-[120px]"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          size="lg"
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              生成公文
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
