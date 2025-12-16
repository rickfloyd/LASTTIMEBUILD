import { Router } from "express";

export const aiRouter = Router();

// POST /api/ai/ask  { prompt: "..." }
aiRouter.post("/ask", async (req, res) => {
  try {
    const prompt = String(req.body?.prompt || "").trim();
    if (!prompt) return res.status(400).json({ ok: false, error: "Missing prompt" });

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(503).json({
        ok: false,
        error: "OPENAI_API_KEY not set on server"
      });
    }

    // Simple, modern OpenAI call using fetch (no extra SDK needed)
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ ok: false, error: "OpenAI error", details: txt });
    }

    const data: any = await r.json();
    const text = data?.choices?.[0]?.message?.content || "";

    res.json({ ok: true, text });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});
