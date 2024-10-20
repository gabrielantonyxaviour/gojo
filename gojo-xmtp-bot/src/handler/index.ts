import fetch from "node-fetch";

interface Convo {
  role: string;
  content: string;
}

interface GenerateContractResponse {
  contract?: string; // Adjust this based on the actual response structure
  error?: string; // Optional: to handle any error messages returned by the endpoint
}

export default async function handler(
  context: Convo[],
  input: string
): Promise<string> {
  // Create the prompt by combining the context messages
  const prompt =
    context.map((c) => `${c.role}: ${c.content}`).join("\n") +
    `\nuser: ${input}`;

  // Prepare the request payload
  const payload = {
    prompt: prompt,
    openai_api_key: process.env.OPENAI_API_KEY,
  };

  try {
    // Send a POST request to the specified endpoint
    const response = await fetch(
      "https://c69b-103-98-209-120.ngrok-free.app/generate-contract",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    // Check if the response is okay (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const responseData: GenerateContractResponse = await response.json();

    // Return the generated contract or a default message if not present
    return responseData.contract || "No contract generated.";
  } catch (error) {
    console.error("Error while communicating with the endpoint:", error);
    return "An error occurred while generating the contract.";
  }
}
