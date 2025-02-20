import Groq from "groq-sdk";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const messages = [];

function chatLoop() {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    messages.push({ role: "user", content: input });

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
      });

      const reply = chatCompletion.choices[0]?.message?.content || "No response.";
      console.log("AI:", reply);

      messages.push({ role: "assistant", content: reply });
    } catch (error) {
      console.error("Error:", error);
    }
    chatLoop();
  });
}

chatLoop();
