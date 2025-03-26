"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error:", error);
      setResult("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-4xl w-full space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-blue-400 animate-slideDown">
            AI-Powered Medical Assistant
          </h1>
          <p className="text-xl text-gray-300 animate-slideUp">
            Leveraging artificial intelligence to transform healthcare
            documentation and analysis.
          </p>

          <Link href="/dashboard">
            <button className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 animate-pulse">
              Get Started
            </button>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 animate-fadeIn">
            Choose a Service
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link
              href="/text"
              className="flex flex-col items-center p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-blue-900/30 transform transition duration-300 hover:scale-105 border border-gray-700"
            >
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-100">
                Extract Text
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Convert medical images to readable text
              </p>
            </Link>

            <Link
              href="/json"
              className="flex flex-col items-center p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-green-900/30 transform transition duration-300 hover:scale-105 border border-gray-700"
            >
              <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-100">JSON Format</h3>
              <p className="mt-2 text-sm text-gray-400">
                Extract structured data in JSON format
              </p>
            </Link>

            <Link
              href="/summary"
              className="flex flex-col items-center p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-purple-900/30 transform transition duration-300 hover:scale-105 border border-gray-700"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-100">
                Discharge Summary
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Generate comprehensive discharge summaries
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
