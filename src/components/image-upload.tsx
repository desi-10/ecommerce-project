/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X } from "lucide-react";
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

  // Update preview if currentImage changes (e.g. from props)
  useEffect(() => {
    if (currentImage) setPreview(currentImage);
  }, [currentImage]);

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }

      setError(null);
      
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

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
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
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium">
            Drag and drop image here
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select from your computer
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Max size: {maxSize}MB
          </p>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {preview && (
        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border">
           <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={clearImage}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

