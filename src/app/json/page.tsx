"use client";

import { useState } from "react";
import Image from "next/image";

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
    <div className="min-h-screen p-8 bg-white dark:bg-black text-black dark:text-white">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Image to Text Converter</h1>

        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {image && (
            <div className="space-y-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processing..." : "Convert to Text"}
              </button>
            </div>
          )}

          {result && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Result:</h2>
              <pre className="whitespace-pre-wrap overflow-auto max-h-96 text-sm">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
