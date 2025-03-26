"use client";

import { useState } from "react";
import { useText } from "../../context/TextContext";

interface PhysicalExamination {
  pulse: string;
  bp: string;
  rr: string;
  temp: string;
  weight: string;
}

interface JuniorPhysicianNote {
  historyAndComplaints: string;
  physicalExamination: PhysicalExamination;
  general: string;
  heent: string;
  cvs: string;
  rs: string;
  abd: string;
  neuro: string;
  ext: string;
}

interface ProgressNote {
  date: string;
  juniorPhysicianNote: JuniorPhysicianNote;
  seniorResidentNote: string;
}

interface NotesData {
  progressNotes: ProgressNote[];
}

export default function ProgressNotes() {
  const { extractedText, setExtractedText } = useText();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingNote, setEditingNote] = useState<{ index: number; note: ProgressNote } | null>(null);

  let notesData: NotesData = { progressNotes: [] };
  try {
    if (extractedText) {
      notesData = JSON.parse(extractedText);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  const handleEdit = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editMode) return;
    
    const noteToEdit = notesData.progressNotes[index];
    setEditingNote({
      index,
      note: JSON.parse(JSON.stringify(noteToEdit)) // Deep copy
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editingNote) return;

    const updatedNotes = { ...notesData };
    updatedNotes.progressNotes[editingNote.index] = editingNote.note;
    setExtractedText(JSON.stringify(updatedNotes));
    setEditingNote(null);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNote(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/progress-notes", {
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Daily Progress Notes</h1>
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
          {notesData.progressNotes.length > 0 && (
            <button
              onClick={() => {
                setEditMode(!editMode);
                if (editingNote) setEditingNote(null);
              }}
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

      {loading && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-blue-400">Processing image, please wait...</p>
        </div>
      )}

      <div className="space-y-6">
        {notesData.progressNotes.map((note, index) => (
          <div 
            key={index} 
            className={`bg-gray-800 rounded-lg p-6 ${
              editMode && !editingNote ? 'cursor-pointer hover:bg-gray-700/50' : ''
            }`}
            onClick={(e) => handleEdit(e, index)}
          >
            {editingNote?.index === index ? (
              // Edit Form
              <div onClick={e => e.stopPropagation()} className="space-y-4">
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">Date: {note.date}</h2>
                </div>

                {/* Junior Physician Note Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4">Junior Physician Note</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-400">History and Complaints:</h4>
                      <textarea
                        value={note.juniorPhysicianNote.historyAndComplaints}
                        onChange={(e) => {
                          const updatedNote = { ...note.juniorPhysicianNote, historyAndComplaints: e.target.value };
                          const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? updatedNote : n) };
                          setExtractedText(JSON.stringify(updatedNotes));
                        }}
                        className="w-full h-20 p-2 bg-gray-700 text-white rounded"
                      />
                    </div>

                    <div>
                      <h4 className="text-gray-400">Physical Examination:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                        <div className="text-white">
                          <span className="text-gray-400">Pulse: </span>
                          <input
                            type="text"
                            value={note.juniorPhysicianNote.physicalExamination.pulse}
                            onChange={(e) => {
                              const updatedNote = { ...note.juniorPhysicianNote.physicalExamination, pulse: e.target.value };
                              const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? { ...n, juniorPhysicianNote: { ...n.juniorPhysicianNote, physicalExamination: updatedNote } } : n) };
                              setExtractedText(JSON.stringify(updatedNotes));
                            }}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                          />
                        </div>
                        <div className="text-white">
                          <span className="text-gray-400">BP: </span>
                          <input
                            type="text"
                            value={note.juniorPhysicianNote.physicalExamination.bp}
                            onChange={(e) => {
                              const updatedNote = { ...note.juniorPhysicianNote.physicalExamination, bp: e.target.value };
                              const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? { ...n, juniorPhysicianNote: { ...n.juniorPhysicianNote, physicalExamination: updatedNote } } : n) };
                              setExtractedText(JSON.stringify(updatedNotes));
                            }}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                          />
                        </div>
                        <div className="text-white">
                          <span className="text-gray-400">Temp: </span>
                          <input
                            type="text"
                            value={note.juniorPhysicianNote.physicalExamination.temp}
                            onChange={(e) => {
                              const updatedNote = { ...note.juniorPhysicianNote.physicalExamination, temp: e.target.value };
                              const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? { ...n, juniorPhysicianNote: { ...n.juniorPhysicianNote, physicalExamination: updatedNote } } : n) };
                              setExtractedText(JSON.stringify(updatedNotes));
                            }}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                          />
                        </div>
                        <div className="text-white">
                          <span className="text-gray-400">RR: </span>
                          <input
                            type="text"
                            value={note.juniorPhysicianNote.physicalExamination.rr || '-'}
                            onChange={(e) => {
                              const updatedNote = { ...note.juniorPhysicianNote.physicalExamination, rr: e.target.value };
                              const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? { ...n, juniorPhysicianNote: { ...n.juniorPhysicianNote, physicalExamination: updatedNote } } : n) };
                              setExtractedText(JSON.stringify(updatedNotes));
                            }}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                          />
                        </div>
                        <div className="text-white">
                          <span className="text-gray-400">Weight: </span>
                          <input
                            type="text"
                            value={note.juniorPhysicianNote.physicalExamination.weight}
                            onChange={(e) => {
                              const updatedNote = { ...note.juniorPhysicianNote.physicalExamination, weight: e.target.value };
                              const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? { ...n, juniorPhysicianNote: { ...n.juniorPhysicianNote, physicalExamination: updatedNote } } : n) };
                              setExtractedText(JSON.stringify(updatedNotes));
                            }}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-gray-400">HEENT:</h4>
                        <textarea
                          value={note.juniorPhysicianNote.heent || '-'}
                          onChange={(e) => {
                            const updatedNote = { ...note.juniorPhysicianNote, heent: e.target.value };
                            const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? updatedNote : n) };
                            setExtractedText(JSON.stringify(updatedNotes));
                          }}
                          className="w-full h-20 p-2 bg-gray-700 text-white rounded"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-400">CVS:</h4>
                        <textarea
                          value={note.juniorPhysicianNote.cvs || '-'}
                          onChange={(e) => {
                            const updatedNote = { ...note.juniorPhysicianNote, cvs: e.target.value };
                            const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? updatedNote : n) };
                            setExtractedText(JSON.stringify(updatedNotes));
                          }}
                          className="w-full h-20 p-2 bg-gray-700 text-white rounded"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-400">RS:</h4>
                        <textarea
                          value={note.juniorPhysicianNote.rs || '-'}
                          onChange={(e) => {
                            const updatedNote = { ...note.juniorPhysicianNote, rs: e.target.value };
                            const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? updatedNote : n) };
                            setExtractedText(JSON.stringify(updatedNotes));
                          }}
                          className="w-full h-20 p-2 bg-gray-700 text-white rounded"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-400">ABD:</h4>
                        <textarea
                          value={note.juniorPhysicianNote.abd || '-'}
                          onChange={(e) => {
                            const updatedNote = { ...note.juniorPhysicianNote, abd: e.target.value };
                            const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? updatedNote : n) };
                            setExtractedText(JSON.stringify(updatedNotes));
                          }}
                          className="w-full h-20 p-2 bg-gray-700 text-white rounded"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-400">Neuro:</h4>
                        <textarea
                          value={note.juniorPhysicianNote.neuro || '-'}
                          onChange={(e) => {
                            const updatedNote = { ...note.juniorPhysicianNote, neuro: e.target.value };
                            const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? updatedNote : n) };
                            setExtractedText(JSON.stringify(updatedNotes));
                          }}
                          className="w-full h-20 p-2 bg-gray-700 text-white rounded"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-400">EXT:</h4>
                        <textarea
                          value={note.juniorPhysicianNote.ext || '-'}
                          onChange={(e) => {
                            const updatedNote = { ...note.juniorPhysicianNote, ext: e.target.value };
                            const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? updatedNote : n) };
                            setExtractedText(JSON.stringify(updatedNotes));
                          }}
                          className="w-full h-20 p-2 bg-gray-700 text-white rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Senior Resident Note Section */}
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-4">Senior Resident Note</h3>
                  <textarea
                    value={note.seniorResidentNote}
                    onChange={(e) => {
                      const updatedNotes = { ...notesData, progressNotes: notesData.progressNotes.map((n, i) => i === index ? { ...n, seniorResidentNote: e.target.value } : n) };
                      setExtractedText(JSON.stringify(updatedNotes));
                    }}
                    className="w-full h-20 p-2 bg-gray-700 text-white rounded"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              // Display View
              <>
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">Date: {note.date}</h2>
                </div>

                {/* Junior Physician Note Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4">Junior Physician Note</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-400">History and Complaints:</h4>
                      <p className="text-white whitespace-pre-wrap">{note.juniorPhysicianNote.historyAndComplaints}</p>
                    </div>

                    <div>
                      <h4 className="text-gray-400">Physical Examination:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                        <div className="text-white">
                          <span className="text-gray-400">Pulse: </span>
                          {note.juniorPhysicianNote.physicalExamination.pulse}
                        </div>
                        <div className="text-white">
                          <span className="text-gray-400">BP: </span>
                          {note.juniorPhysicianNote.physicalExamination.bp}
                        </div>
                        <div className="text-white">
                          <span className="text-gray-400">Temp: </span>
                          {note.juniorPhysicianNote.physicalExamination.temp}
                        </div>
                        <div className="text-white">
                          <span className="text-gray-400">RR: </span>
                          {note.juniorPhysicianNote.physicalExamination.rr || '-'}
                        </div>
                        <div className="text-white">
                          <span className="text-gray-400">Weight: </span>
                          {note.juniorPhysicianNote.physicalExamination.weight}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-gray-400">HEENT:</h4>
                        <p className="text-white">{note.juniorPhysicianNote.heent || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400">CVS:</h4>
                        <p className="text-white">{note.juniorPhysicianNote.cvs || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400">RS:</h4>
                        <p className="text-white">{note.juniorPhysicianNote.rs || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400">ABD:</h4>
                        <p className="text-white">{note.juniorPhysicianNote.abd || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400">Neuro:</h4>
                        <p className="text-white">{note.juniorPhysicianNote.neuro || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400">EXT:</h4>
                        <p className="text-white">{note.juniorPhysicianNote.ext || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Senior Resident Note Section */}
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-4">Senior Resident Note</h3>
                  <p className="text-white whitespace-pre-wrap">{note.seniorResidentNote}</p>
                </div>
              </>
            )}
          </div>
        ))}

        {notesData.progressNotes.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-8">
            No progress notes yet. Upload an image to get started.
          </div>
        )}
      </div>

      {editMode && !editingNote && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Click on a note to edit
        </div>
      )}
    </div>
  );
}