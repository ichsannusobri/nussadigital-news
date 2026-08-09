async function main() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      console.log("Available generateContent models:");
      data.models.forEach(m => {
        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log("No models field in response:", data);
    }
  } catch (e) {
    console.error(e);
  }
}
main();
