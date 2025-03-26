import { readFile } from "fs/promises";
import * as mammoth from "mammoth";

// Process PDF files
async function processPdf(buffer: Buffer): Promise<string> {
  try {
    // Dynamically import pdf-parse only when needed
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer, {
      // Avoid using test files
      version: "default",
    });
    return data.text;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error("Failed to process PDF file");
  }
}

// Process DOCX files
async function processDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("Error processing DOCX:", error);
    throw new Error("Failed to process DOCX file");
  }
}

// Process text files
async function processText(buffer: Buffer): Promise<string> {
  return buffer.toString("utf-8");
}

// Main function to extract text from various file types
export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);

  const fileType = file.name.split(".").pop()?.toLowerCase();

  switch (fileType) {
    case "pdf":
      return processPdf(fileBuffer);
    case "docx":
      return processDocx(fileBuffer);
    case "txt":
      return processText(fileBuffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
