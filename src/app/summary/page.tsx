"use client";

import { useState } from "react";
import FileUploader from "@/app/components/fileUploader";
import { PatientInfo } from "@/app/lib/ml/summarizer";

export default function Summary() {
  const [files, setFiles] = useState<File[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    id: "",
    dob: "",
    admissionDate: "",
    dischargeDate: "",
  });
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add patient info to form data
      Object.entries(patientInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add files to form data
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/generate-summary", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Patient Discharge Summary Generator
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Patient Name
            </label>
            <input
              type="text"
              name="name"
              value={patientInfo.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Patient ID</label>
            <input
              type="text"
              name="id"
              value={patientInfo.id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={patientInfo.dob}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Admission Date
            </label>
            <input
              type="date"
              name="admissionDate"
              value={patientInfo.admissionDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Discharge Date
            </label>
            <input
              type="date"
              name="dischargeDate"
              value={patientInfo.dischargeDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Upload Patient Files</h2>
          <FileUploader onFilesSelected={handleFilesSelected} />
        </div>

        <button
          type="submit"
          disabled={isLoading || files.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Generating..." : "Generate Discharge Summary"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {summary && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Discharge Summary
          </h2>
          <div className="border rounded-lg shadow-md overflow-hidden bg-white">
            <div dangerouslySetInnerHTML={{ __html: summary }} />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                // Create a styled HTML document for download
                const htmlContent = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>${patientInfo.name} - Discharge Summary</title>
                    <style>
                      body { 
                        font-family: Arial, sans-serif; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px;
                        color: #333;
                        line-height: 1.5;
                        background-color: #f8f9fa;
                      }
                      h1 { 
                        color: #0d47a1; 
                        text-align: center; 
                        font-size: 28px; 
                        margin-bottom: 20px; 
                        padding-bottom: 10px; 
                        border-bottom: 2px solid #0d47a1;
                      }
                      h2 { 
                        color: #0d47a1; 
                        font-size: 20px; 
                        margin-bottom: 15px; 
                        padding-bottom: 8px; 
                        border-bottom: 1px solid #bbdefb;
                      }
                      div.section {
                        background-color: white; 
                        padding: 15px; 
                        margin-bottom: 20px; 
                        border-radius: 6px; 
                        border: 1px solid #cfd8dc; 
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                      }
                      .grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                      }
                      p {
                        margin: 5px 0;
                        color: #333;
                      }
                      .font-bold, strong { 
                        font-weight: bold; 
                      }
                      .footer {
                        margin-top: 30px; 
                        padding: 15px; 
                        background-color: #e3f2fd; 
                        border: 1px solid #bbdefb; 
                        border-radius: 6px; 
                        text-align: center; 
                        color: #0d47a1;
                      }
                      .alert {
                        margin-top: 15px; 
                        padding: 10px; 
                        border-left: 4px solid; 
                        border-radius: 4px;
                      }
                      .alert-warning {
                        background-color: #fff3e0; 
                        border-color: #ff9800;
                      }
                      .alert-success {
                        background-color: #e8f5e9; 
                        border-color: #4caf50;
                      }
                      .alert-title {
                        margin: 0; 
                        font-weight: bold;
                      }
                      .alert-warning .alert-title {
                        color: #e65100;
                      }
                      .alert-success .alert-title {
                        color: #2e7d32;
                      }
                    </style>
                  </head>
                  <body>
                    ${summary}
                  </body>
                  </html>
                `;

                const blob = new Blob([htmlContent], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${patientInfo.name}_discharge_summary.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Summary
            </button>
            <button
              onClick={() => {
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>${patientInfo.name} - Discharge Summary</title>
                      <style>
                        @media print {
                          body { 
                            font-family: Arial, sans-serif;
                            color: #000;
                            line-height: 1.5;
                          }
                          h1 { 
                            color: #000; 
                            text-align: center; 
                            font-size: 24px; 
                            margin-bottom: 20px; 
                            padding-bottom: 10px; 
                            border-bottom: 2px solid #000;
                          }
                          h2 { 
                            color: #000; 
                            font-size: 18px; 
                            margin-bottom: 15px; 
                            padding-bottom: 8px; 
                            border-bottom: 1px solid #000;
                          }
                          div {
                            page-break-inside: avoid;
                          }
                        }
                      </style>
                    </head>
                    <body>
                      ${summary}
                      <script>
                        window.onload = function() {
                          window.print();
                          window.setTimeout(function() {
                            window.close();
                          }, 500);
                        };
                      </script>
                    </body>
                    </html>
                  `);
                  printWindow.document.close();
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
