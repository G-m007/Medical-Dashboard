import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/app/lib/ml/documentProcessor";
import { generateDischargeSummary, PatientInfo } from "@/app/lib/ml/summarizer";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get patient info
    const patientInfo: PatientInfo = {
      name: formData.get("name") as string,
      id: formData.get("id") as string,
      dob: formData.get("dob") as string,
      admissionDate: formData.get("admissionDate") as string,
      dischargeDate: formData.get("dischargeDate") as string,
    };

    // Validate patient info
    for (const [key, value] of Object.entries(patientInfo)) {
      if (!value) {
        return NextResponse.json(
          { error: `Missing required patient information: ${key}` },
          { status: 400 }
        );
      }
    }

    // Get files
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Process each file to extract text
    const fileContents = await Promise.all(
      files.map(async (file) => {
        try {
          return await extractTextFromFile(file);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          return `[Error processing file ${file.name}]`;
        }
      })
    );

    // Generate the discharge summary
    const summary = await generateDischargeSummary(fileContents, patientInfo);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      {
        error: "Failed to generate summary",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
