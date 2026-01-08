"use client";

import { DocumentType, documentTypes } from "@/lib/document-types";
import { cn } from "@/lib/utils";

interface DocumentTypeTabsProps {
  selectedType: DocumentType;
  onTypeChange: (type: DocumentType) => void;
}

export function DocumentTypeTabs({ selectedType, onTypeChange }: DocumentTypeTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {documentTypes.map((docType) => (
        <button
          key={docType.type}
          onClick={() => onTypeChange(docType.type)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            selectedType === docType.type
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{docType.icon}</span>
          <span>{docType.type}</span>
        </button>
      ))}
    </div>
  );
}
