"use client";

import { useState } from "react";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export default function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      onFilesSelected(filesArray);
    }
  };

  return (
    <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <svg
          className="w-8 h-8 text-gray-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <span className="text-gray-500 mb-2">Upload patient files</span>
        <span className="text-xs text-gray-500">
          Supported formats: PDF, DOCX, TXT
        </span>
        <input
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
        />
      </label>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium">Selected Files:</h3>
          <ul className="mt-2 space-y-1">
            {selectedFiles.map((file, index) => (
              <li key={index} className="text-xs text-gray-600">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
