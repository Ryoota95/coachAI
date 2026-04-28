import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("cv") as File | null;
  const targetRole = formData.get("targetRole") as string || "frontend developer";

  console.log("role lu nih", targetRole);

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ message: "Only PDF allowed" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const { text, totalPages } = await extractText(uint8Array, { mergePages: true });

    console.log("Text extracted:", text.slice(0, 200));

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    // 1. PARSING CV
    const prompt = `
Extract structured data from this CV text. Return ONLY valid JSON with this exact structure:

{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "company name",
      "position": "job title",
      "duration": "start - end date",
      "description": "brief description"
    }
  ],
  "education": [
    {
      "institution": "school/university name",
      "degree": "degree/certification",
      "year": "graduation year"
    }
  ]
}

CV Text:
${text}
`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "Gemini API failed");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // 2. CV ANALYSIS + LEARNING PATH (GABUNG JADI SATU)
    const analysisPrompt = `
You are an expert career advisor. Analyze this CV for someone targeting the role: "${targetRole}"
Use Indonesian language for all text responses.

CV Data:
- Name: ${parsedData.name}
- Skills: ${parsedData.skills?.join(", ") || "None listed"}
- Experience: ${JSON.stringify(parsedData.experience)}
- Education: ${JSON.stringify(parsedData.education)}

Provide a detailed analysis in JSON format with this structure:
{
  "atsScore": 75,
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "improvements": [
    {
      "category": "Skills",
      "issue": "what's wrong",
      "suggestion": "how to fix"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "learningPath": [
    {
      "skill": "React.js",
      "priority": "High",
      "reason": "Essential for frontend role, currently missing from CV",
      "timeEstimate": "2-3 months",
      "resources": [
        {
          "type": "Course",
          "title": "React - The Complete Guide",
          "provider": "Udemy",
          "link": "https://www.udemy.com/course/react-the-complete-guide/"
        },
        {
          "type": "Practice",
          "title": "Build a Todo App with React",
          "description": "Hands-on project to practice hooks and state management"
        },
        {
          "type": "Documentation",
          "title": "Official React Docs",
          "link": "https://react.dev"
        }
      ]
    }
  ]
}

Focus on:
1. What technical skills are missing for ${targetRole}
2. What experience gaps exist
3. How to improve the CV to match ${targetRole} requirements
4. Specific actionable recommendations
5. *IMPORTANT: For learningPath, provide 3-5 critical skills the candidate needs to learn, with concrete learning resources (courses, tutorials, projects, documentation). Include real course links when possible.*

Return ONLY valid JSON, no markdown.
`;

    const analysisResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: analysisPrompt }] }]
      })
    });

    const analysisData = await analysisResponse.json();
    
    if (!analysisResponse.ok) {
      console.error("Analysis API error:", analysisData);
      throw new Error(analysisData.error?.message || "Analysis failed");
    }

    const analysisText = analysisData.candidates[0].content.parts[0].text;

    const analysisMatch = analysisText.match(/\{[\s\S]*\}/);
    const feedback = analysisMatch ? JSON.parse(analysisMatch[0]) : null;

    return NextResponse.json({
      message: "Upload success",
      fileName: file.name,
      pages: totalPages,
      rawText: text,
      parsedData,
      feedback,
      targetRole,
    });

  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Failed to parse CV", error: err.message || String(err) },
      { status: 500 }
    );
  }
}