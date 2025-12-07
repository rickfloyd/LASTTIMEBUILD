export const askGemini = async (prompt: string): Promise<string> => {
  console.log("Ask Gemini called with prompt:", prompt);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is a placeholder response from Gemini Bridge.");
    }, 1000);
  });
};