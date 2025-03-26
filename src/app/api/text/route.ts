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
    });

    // Convert the file to bytes
    const bytes = await file.arrayBuffer();
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage([
        "This is a medical report. Extract all text of patient information and investigation details.",
        {
          inlineData: {
            mimeType: file.type,
            data: Buffer.from(bytes).toString("base64"),
          },
        },
      ]);

      // Parse the JSON response properly
      return Response.json({ text: result.response.text() });
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
