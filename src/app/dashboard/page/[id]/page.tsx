"use client";

import { useParams } from "next/navigation";
import { useText } from "../../../context/TextContext";
import { useEffect, useState } from "react";

interface Investigation {
  name: string;
  day1: string | null;
  day2: string | null;
  day3: string | null;
  day4: string | null;
  day5: string | null;
  day6: string | null;
  remarks: string | null;
}

interface MedicalData {
  investigations: Investigation[];
}

export default function RecordPage() {
  const params = useParams();
  const pageId = params.id;
  const { extractedText, setExtractedText } = useText();
  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    column: keyof Investigation;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  // File upload handling
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setExtractedText(JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  let medicalData: MedicalData | null = null;
  try {
    if (extractedText) {
      medicalData = JSON.parse(extractedText);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  const handleEdit = (row: number, column: keyof Investigation, value: string | null) => {
    if (!editMode) return;
    setEditingCell({ row, column });
    setEditValue(value || "");
  };

  const handleSave = () => {
    if (!editingCell || !medicalData) return;

    const updatedData = { ...medicalData };
    updatedData.investigations[editingCell.row][editingCell.column] = editValue as string;

    setExtractedText(JSON.stringify(updatedData));
    setEditingCell(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  // Define column order
  const columnOrder: (keyof Investigation)[] = [
    'name',
    'day1',
    'day2',
    'day3',
    'day4',
    'day5',
    'day6',
    'remarks'
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Medical Investigations</h1>
        <div className="flex gap-4">
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
            <span>{loading ? "Processing..." : "Upload Image"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
          {medicalData && (
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                editMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
            </button>
          )}
        </div>
      </div>

      {!medicalData && !loading && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-gray-400 mb-4">
            Upload a medical record image to view and edit investigations data.
          </p>
        </div>
      )}
      
      {loading && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-blue-400">Processing image, please wait...</p>
        </div>
      )}

      {medicalData && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full text-white border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-left border-b border-gray-600">Investigation</th>
                <th className="px-4 py-3 text-center border-b border-gray-600">Day 1</th>
                <th className="px-4 py-3 text-center border-b border-gray-600">Day 2</th>
                <th className="px-4 py-3 text-center border-b border-gray-600">Day 3</th>
                <th className="px-4 py-3 text-center border-b border-gray-600">Day 4</th>
                <th className="px-4 py-3 text-center border-b border-gray-600">Day 5</th>
                <th className="px-4 py-3 text-center border-b border-gray-600">Day 6</th>
                <th className="px-4 py-3 text-left border-b border-gray-600">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {medicalData.investigations.map((investigation, index) => (
                <tr 
                  key={index} 
                  className={`${
                    index % 2 === 0 ? 'bg-gray-700/50' : 'bg-gray-700/30'
                  } hover:bg-gray-600/50 transition-colors`}
                >
                  {columnOrder.map((column) => {
                    const value = investigation[column];
                    const isEditing = editingCell?.row === index && editingCell?.column === column;

                    return (
                      <td 
                        key={`${index}-${column}`}
                        className={`px-4 py-3 border-b border-gray-600 ${
                          column === 'name' ? 'font-medium text-left' : 
                          column === 'remarks' ? 'text-left' : 'text-center'
                        }`}
                        onClick={() => editMode && handleEdit(index, column, value)}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyPress}
                            className="w-full bg-gray-600 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          <div className={`${
                            editMode ? 'cursor-pointer hover:bg-gray-600/50' : ''
                          } px-2 py-1 rounded whitespace-pre-wrap`}>
                            {column === 'remarks' && value ? (
                              value.split('\n').map((line, i) => (
                                <div key={i}>{line}</div>
                              ))
                            ) : (
                              value || '-'
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editMode && (
        <div className="mt-4 text-gray-400">
          <p>Click on any cell to edit. Press Enter to save or Escape to cancel.</p>
        </div>
      )}
    </div>
  );
} 