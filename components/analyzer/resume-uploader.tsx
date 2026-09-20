"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileText, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { MAX_FILE_SIZE_BYTES } from "@/lib/config/app";

interface ResumeUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string | null;
}

export function ResumeUploader({ file, onFileSelect, error }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.toLowerCase();
    if (!ext.endsWith(".pdf") && !ext.endsWith(".docx")) {
      alert("Please upload a PDF (.pdf) or Microsoft Word (.docx) document.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      alert(`File size exceeds the 2 MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB).`);
      return;
    }

    onFileSelect(selectedFile);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-900">
          Upload Resume <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-slate-500 font-mono">PDF or DOCX (Max 2 MB)</span>
      </div>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-slate-900 bg-slate-100/70"
              : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-100/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-700 shadow-xs">
            <UploadCloud className="w-5 h-5" />
          </div>

          <p className="text-sm font-medium text-slate-900 mb-1">
            Click to upload or drag & drop resume
          </p>
          <p className="text-xs text-slate-500">
            Supports .pdf and .docx files up to 2 MB
          </p>
        </div>
      ) : (
        <div className="saas-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {(file.size / 1024).toFixed(1)} KB • {file.name.endsWith(".pdf") ? "PDF Document" : "DOCX Document"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-slate-700 font-medium px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready
            </span>

            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-md border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

