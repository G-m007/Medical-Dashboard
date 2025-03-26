import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  SchemaType,
} from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return Response.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const data = await request.formData();
    const file = data.get("image") as File;

    if (!file) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    console.log("File received:", file.name, file.type, file.size);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            investigations: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING, nullable: false },
                  day1: { type: SchemaType.STRING, nullable: true },
                  day2: { type: SchemaType.STRING, nullable: true },
                  day3: { type: SchemaType.STRING, nullable: true },
                  day4: { type: SchemaType.STRING, nullable: true },
                  day5: { type: SchemaType.STRING, nullable: true },
                  day6: { type: SchemaType.STRING, nullable: true },
                  remarks: { type: SchemaType.STRING, nullable: true },
                },
              },
            },
            patientInfo: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING, nullable: true },
                ipNumber: { type: SchemaType.STRING, nullable: true },
                registrationNumber: {
                  type: SchemaType.STRING,
                  nullable: true,
                },
                ward: { type: SchemaType.STRING, nullable: true },
                bedNumber: { type: SchemaType.STRING, nullable: true },
                doctorName: { type: SchemaType.STRING, nullable: true },
              },
            },
          },
        },
      },
    });

    // Convert the file to bytes
    const bytes = await file.arrayBuffer();

    try {
      const chatSession = model.startChat({
        history: [],
      });

      const result = await chatSession.sendMessage([
        "This image contains a medical investigation report. Extract all patient information and investigation details in a structured format. For each investigation, include the name and values for each day (day1-day6) if available. Also extract patient details including name, IP number, registration number, ward, bed number, and doctor name. Return the data in JSON format according to the provided schema.",
        {
          inlineData: {
            mimeType: file.type,
            data: Buffer.from(bytes).toString("base64"),
          },
        },
      ]);

      // Parse the JSON response properly
      const responseText = result.response.text();
      const parsedData = JSON.parse(responseText);

      return Response.json(parsedData);
    } catch (modelError: any) {
      console.error("Gemini API Error:", modelError);
      return Response.json(
        {
          error: `Gemini API Error: ${modelError.message || "Unknown error"}`,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error processing image:", error);
    return Response.json(
      {
        error: `Failed to process image: ${error.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
