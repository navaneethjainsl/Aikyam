const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

async function main() {
  const endpoint = "https://myaccount.openai.azure.com/";
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

  const deploymentName = "dalle-3";
  const prompt = "a monkey eating a banana";
  const size = "1024x1024";
  const n = 1;
  
  const results = await client.getImages(deploymentName, prompt, { n, size });

  for (const image of results.data) {
    console.log(`Image generation result URL: ${image.url}`);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});