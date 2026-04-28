import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, userAnswer, targetRole, cvData } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const prompt = `
You are an expert interview coach. Evaluate this candidate's answer to an interview question.

Interview Context:
- Target Role: ${targetRole}
- Candidate's Background: ${JSON.stringify(cvData)}

Question: ${question}

Candidate's Answer:
${userAnswer}

Provide feedback in JSON format:
{
  "score": 4,
  "strengths": "What the candidate did well in their answer",
  "improvements": "What could be improved or added to make the answer stronger"
}

Score guidelines (1-5 stars):
- 5: Excellent answer with specific examples, metrics, and clear structure
- 4: Good answer with relevant examples but missing some details
- 3: Adequate answer but lacks specifics or structure
- 2: Weak answer, too generic or off-topic
- 1: Poor answer, doesn't address the question

Focus on:
1. Does the answer use specific examples from their experience?
2. Does it include quantifiable results/metrics?
3. Is it structured clearly (STAR method for behavioral questions)?
4. Does it align with the target role requirements?

Return ONLY valid JSON, no markdown.
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
      throw new Error(data.error?.message || "Failed to evaluate answer");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const feedback = JSON.parse(jsonMatch[0]);

    return NextResponse.json(feedback);
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Failed to evaluate answer", error: err.message },
      { status: 500 }
    );
  }
}