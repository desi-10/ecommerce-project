/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  currentImage?: string | null;
  maxSize?: number; // in MB
}

export function ImageUpload({
  onFileSelect,
  disabled = false,
  currentImage,
  maxSize = 5,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  // Update preview if currentImage changes (e.g. from props)
  useEffect(() => {
    if (currentImage) setPreview(currentImage);
  }, [currentImage]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (JPG, PNG, WebP, etc.)");
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB (current: ${formatFileSize(file.size)})`);
        return;
      }

      setError(null);
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Pass file to parent
      onFileSelect(file);
      
      // Cleanup
      return () => URL.revokeObjectURL(objectUrl);
    },
    [onFileSelect, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFileName(null);
    setFileSize(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <div className="flex justify-center mb-3">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Upload className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="font-semibold text-gray-900">
              Drag and drop image here
            </p>
            <p className="text-sm text-gray-600 mt-1">
              or click to select from your computer
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, WebP. Max size: {maxSize}MB
            </p>
          </label>
        </div>
      ) : null}

      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <div className="relative w-full h-56 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={clearImage}
              className="absolute top-3 right-3 rounded-lg shadow-md hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-green-700 truncate">{fileName}</p>
                <p className="text-xs text-green-600 mt-0.5">{fileSize}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImage}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

