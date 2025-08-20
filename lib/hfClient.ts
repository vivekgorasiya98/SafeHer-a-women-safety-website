const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base";

const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY!;

export async function queryHuggingFace(input: string) {
  try {
    const res = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: input }),
    });

    if (!res.ok) {
      throw new Error(`HF API Error: ${res.status}`);
    }

    const data = await res.json();

    // Hugging Face usually returns an array of objects
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }

    return data;
  } catch (err) {
    console.error("HF Query failed:", err);
    return null;
  }
}
