import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { parsedData, targetRole } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const prompt = `
Anda adalah seorang pewawancara ahli. Buatlah 5 pertanyaan wawancara untuk seorang... ${targetRole} position.
pakai bahasa indonesian

Candidate's CV Data:
- Name: ${parsedData.name}
- Skills: ${parsedData.skills?.join(", ") || "None"}
- Experience: ${JSON.stringify(parsedData.experience)}
- Education: ${JSON.stringify(parsedData.education)}

Untuk setiap pertanyaan, berikan:
1. Pertanyaan wawancara
2. Kategori (Teknis/Perilaku/Situasional)
3. Jawaban yang disarankan berdasarkan CV kandidat
4. Tips tentang cara menjawab secara efektif


Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "question": "Ceritakan pengalaman Anda dengan...",
      "category": "Technical",
      "suggestedAnswer": "Berdasarkan CV Anda, Anda dapat menyebutkan...",
      "tips": "Fokus pada contoh dan hasil spesifik."
    }
  ]
}

Buatlah 5 pertanyaan beragam yang mencakup keterampilan teknis, pengalaman sebelumnya, skenario perilaku, dan tujuan karir.
pakai bahasa indonesian
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
      throw new Error(data.error?.message || "Failed to generate questions");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Failed to generate mock interview", error: err.message },
      { status: 500 }
    );
  }

}