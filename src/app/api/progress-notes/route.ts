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
              progressNotes: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    date: { type: SchemaType.STRING },
                    juniorPhysicianNote: {
                      type: SchemaType.OBJECT,
                      properties: {
                        historyAndComplaints: { type: SchemaType.STRING },
                        physicalExamination: {
                          type: SchemaType.OBJECT,
                          properties: {
                            pulse: { type: SchemaType.STRING },
                            bp: { type: SchemaType.STRING },
                            rr: { type: SchemaType.STRING },
                            temp: { type: SchemaType.STRING },
                            weight: { type: SchemaType.STRING },
                          },
                        },
                        general: { type: SchemaType.STRING },
                        heent: { type: SchemaType.STRING },
                        cvs: { type: SchemaType.STRING },
                        rs: { type: SchemaType.STRING },
                        abd: { type: SchemaType.STRING },
                        neuro: { type: SchemaType.STRING },
                        ext: { type: SchemaType.STRING },
                      },
                    },
                    seniorResidentNote: { type: SchemaType.STRING },
                  },
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
          "Extract information from this medical progress note image. Include the date, junior physician's notes (including history, complaints, and all examination details), and senior resident's notes. Format the data according to the specified schema. Ensure all measurements and observations are accurately captured.",
          {
            inlineData: {
              mimeType: file.type,
              data: Buffer.from(bytes).toString("base64"),
            },
          },
        ]);
  
        // Parse the JSON response
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