import Groq from "groq-sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const app = express();
app.use(express.json());
app.use(cors());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const systemMessage = {
    role: "system",
    content:
      "You are an expert on Brazilian Dances. Only answer questions related to Brazilian Dances and politely decline any off-topic queries.\n" +
      "Do not use markdown or any other formatting.\n" +
      "Do not ask follow up questions.\n" +
      "Keep answers short and concise.\n",
  };
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [systemMessage, { role: "user", content: userMessage }],
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse =
      chatCompletion.choices[0]?.message?.content || "No response.";
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Chatbot server running on http://localhost:${PORT}`);
});
