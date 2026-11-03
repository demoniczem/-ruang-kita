export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Pesan kosong" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: "Kamu adalah asisten AI yang ramah, hangat, dan berbicara dalam bahasa Indonesia santai. Jawab pesan pengguna dengan alami.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI gagal menjawab"
      });
    }

    const reply = data.output
      ?.flatMap(item => item.content || [])
      .find(item => item.type === "output_text")?.text || "";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
