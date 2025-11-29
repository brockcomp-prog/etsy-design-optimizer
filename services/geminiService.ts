
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { AnalysisResult, CopyResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    theme: { type: Type.STRING, description: "A concise, marketable description of the flyer's theme, e.g., 'Minimalist Wedding Invitation', '90s Hip Hop Birthday Party'." },
    dominantColors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 5 dominant HEX color codes from the flyer, from most to least prominent."
    },
    keyText: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of key text phrases extracted from the flyer (e.g., 'You're Invited', 'Save the Date')."
    },
    eventType: { type: Type.STRING, description: "The specific type of event, e.g., 'Birthday Party', 'Wedding', 'Corporate Event', 'Halloween Party'."},
    productType: { type: Type.STRING, description: "The general type of product being sold, inferred from the flyer's content. Examples: 'Digital Template', 'Printable Wall Art', 'Physical Product', 'Event Service'."}
  },
  required: ["theme", "dominantColors", "keyText", "eventType", "productType"]
};

const copySchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "One highly-optimized, concise Etsy title (under 140 characters) that uses natural language SEO. It must clearly state the product is an 'Editable Canva Template'."
    },
    description: {
      type: Type.STRING,
      description: "A comprehensive Etsy description. Start with a strong hook. Use emoji-prefixed bullet points to detail what's included, key features (editable in Canva), and benefits. Include sections for 'How It Works', 'What You Receive', and 'Important Disclaimers' (digital product, Canva use)."
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 13 SEO-optimized, multi-word Etsy tags. CRITICAL: Each tag MUST be 20 characters or less (including spaces). Must include terms like 'Canva Template', 'Editable Invitation', and tags relevant to the flyer's theme, event type, and style."
    },
    materials: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of materials for Etsy's materials field. CRITICAL: Each material MUST be 20 characters or less (including spaces). Examples: 'Canva Template', 'Digital Download', 'PDF with link'."
    }
  },
  required: ["title", "description", "tags", "materials"]
};

const mockupPromptsSchema = {
  type: Type.OBJECT,
  properties: {
    prompts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "A short, descriptive name for the mockup (e.g., 'Coffee Shop Table Mockup')." },
          prompt: { type: Type.STRING, description: "A detailed prompt for an AI image generator to create the mockup. This prompt must instruct the AI to place the user's flyer design into the generated scene and should incorporate the flyer's theme and context." }
        },
        required: ["name", "prompt"]
      },
      description: "An array of 10 unique and creative mockup prompts."
    }
  },
  required: ["prompts"]
};


export const analyzeImages = async (images: { data: string; mimeType: string }[]): Promise<AnalysisResult> => {
    const imageParts = images.map(image => ({
        inlineData: { data: image.data, mimeType: image.mimeType }
    }));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                ...imageParts,
                { text: "Analyze this collection of event flyers. They are variations of the same design. Identify the common theme, dominant colors across all designs, key text elements, and the single event type they are for. Also determine the product type being advertised (e.g., 'Digital Template', 'Printable Wall Art', 'Physical Product'). Provide the output in the requested JSON format." }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema
        }
    });

    const jsonString = response.text.trim();
    try {
        return JSON.parse(jsonString) as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse analysis JSON:", jsonString);
        throw new Error("Could not analyze the image. The model returned an invalid format.");
    }
};

export const generateCopy = async (analysis: AnalysisResult): Promise<CopyResult> => {
  const prompt = `
    IMPORTANT: The product is an EDITABLE CANVA TEMPLATE. The customer receives a PDF with a link to edit the design in Canva. All generated copy must clearly reflect this.

    Based on the following analysis of an Etsy digital flyer, generate compelling listing copy.
    Analysis:
    - Theme: ${analysis.theme}
    - Event Type: ${analysis.eventType}
    - Key Text: ${analysis.keyText.join(', ')}

    Follow Etsy's latest guidelines. Create ONE concise title, ONE comprehensive description, 13 optimized multi-word tags (each under 20 characters), and a materials list (each under 20 characters). The description and tags must mention 'Canva' and 'editable'.
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: copySchema
    }
  });

  const jsonString = response.text.trim();
  try {
    return JSON.parse(jsonString) as CopyResult;
  } catch(e) {
    console.error("Failed to parse copy JSON:", jsonString);
    throw new Error("Could not generate listing copy. The model returned an invalid format.");
  }
};

export const generateMockupPrompts = async (analysis: AnalysisResult): Promise<{ name: string; prompt: string }[]> => {
    const isDigitalTemplate = analysis.productType.toLowerCase().includes('digital') || analysis.productType.toLowerCase().includes('template');

    let prompt = `
      Based on the analysis of a flyer, generate a list of 10 diverse, creative, and contextually relevant mockup ideas. The goal is to create a comprehensive Etsy listing that educates the customer and showcases the flyer in various appealing settings that match its theme.

      Flyer Analysis:
      - Theme: ${analysis.theme}
      - Event Type: ${analysis.eventType}
      - Product Type: ${analysis.productType}
      - Dominant Colors: ${analysis.dominantColors.join(', ')}
      - Key Text: ${analysis.keyText.join(', ')}
    `;

    if (isDigitalTemplate) {
        prompt += `
          This is a DIGITAL TEMPLATE. The customer will edit it in Canva. The generated mockup prompts MUST reflect this. Generate exactly 10 prompts with the following specific purposes and names:

          1.  **Name:** "Hero Thumbnail"
              **Prompt Goal:** A scroll-stopping, premium "bundle" shot. The prompt must instruct the image generator to lay out each uploaded flyer as a distinct, physical-looking print on a modern, professional background (e.g., a wood table, marble surface). **Crucially, the prompt MUST forbid the AI from altering the content of the flyers themselves.**

          2.  **Name:** "What's Included Infographic"
              **Prompt Goal:** A clear, visually appealing graphic that lists exactly what the customer receives. The prompt must instruct the AI to create a graphic with a title "What's Included" and list items like: 'Canva Template Link (PDF)', '5x7 Inch Flyer Design', 'Lifetime Access', 'Instant Download'. The design should use the flyer's color palette and be easy to read.

          3.  **Name:** "How It Works Infographic"
              **Prompt Goal:** A simple, 3-step 'How It Works' infographic. The prompt must instruct the AI to create a graphic with a title "How It Works" and three numbered steps with icons: 1. Purchase & Download PDF. 2. Click the link to access your template in Canva. 3. Edit, Save, and Share/Print. Clarity and readability are paramount.

          4.  **Name:** "Editable Features Infographic"
              **Prompt Goal:** A graphic that showcases what is editable in the template. The prompt must instruct the AI to show the flyer with callouts or arrows pointing to different elements (text, photos, colors) with labels like 'Edit All Text & Fonts', 'Change Colors', 'Add Your Photos', 'Move or Resize Elements'.

          5.  **Name:** "Lifestyle Mockup"
              **Prompt Goal:** A realistic lifestyle scene. Show the flyer being viewed or used in a setting that matches the theme (${analysis.theme}). For example, on a table at a cafe for a coffee shop flyer, or held by someone at a party for an invitation.

          6.  **Name:** "Device Mockup (Phone & Tablet)"
              **Prompt Goal:** Display the flyer template being edited in the Canva app interface on both a modern smartphone and a tablet, placed side-by-side in a clean, stylish setting.

          7.  **Name:** "Desktop Mockup"
              **Prompt Goal:** Show the flyer design on a modern laptop screen (like a MacBook) on a clean desk, showing the design being edited in the Canva web interface. Include related items like a coffee mug and notebook.

          8.  **Name:** "Social Media Preview"
              **Prompt Goal:** Create a realistic mockup of the flyer shown as an Instagram post or story on a phone screen. The post should include UI elements like a caption, likes, and comments relevant to the ${analysis.eventType}.

          9.  **Name:** "Thank You Card Bonus"
              **Prompt Goal:** A photorealistic mockup of a matching Thank You card. The prompt must instruct the AI to design a card that uses the flyer's theme and colors. The card must contain the text: "Thank You! Your support means the world. We'd love it if you could leave a review!" and include a graphic of five empty stars (☆☆☆☆☆).

          10. **Name:** "Printing & Sharing Ideas"
              **Prompt Goal:** An infographic that gives the customer ideas. The prompt should instruct the AI to create a graphic with a title "Share Your Design" and show icons for 'Print at Home', 'Local Print Shop', and 'Share Digitally' (with icons like a phone, email, social media).

          For each of these 10 points, generate a detailed, descriptive prompt for an AI image generator that accomplishes the goal.
        `;
    } else {
        // Default prompt for other product types
        prompt += `
          This is a ${analysis.productType}. Generate 10 mockup prompts suitable for this type of product. Include a variety of shots:
          - A main "Hero" shot showing the product clearly.
          - Lifestyle images showing the product in use in a relevant environment.
          - Detail or close-up shots highlighting quality and texture.
          - Images showing the scale or size of the product, maybe next to a common object.
          - A packaging shot if applicable.
          - At least 5 other creative, contextually relevant shots.
        `;
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mockupPromptsSchema,
      },
    });

    const jsonString = response.text.trim();
    try {
      const parsed = JSON.parse(jsonString) as { prompts: { name: string; prompt: string }[] };
      return parsed.prompts;
    } catch (e) {
      console.error("Failed to parse mockup prompts JSON:", jsonString);
      throw new Error("Could not generate mockup ideas. The model returned an invalid format.");
    }
};

export const generateMockup = async (images: { data: string, mimeType: string }[], prompt: string): Promise<string> => {
    const imageParts = images.map(image => ({
        inlineData: { data: image.data, mimeType: image.mimeType }
    }));
    
    const textPrompt = images.length > 1
      ? `You are a professional mockup generator. Your task is to place the provided flyer images onto a single background to create a composite "bundle" or "collection" image.
**CRITICAL RULE: You MUST treat the provided images as final, physical prints. DO NOT redraw, regenerate, blend, or alter the content within the flyers in any way. The text and design on them must be preserved with 100% accuracy.**
Follow the creative prompt below to determine the background and scene, but apply the critical rule above all else.
Creative Prompt: ${prompt}`
      : `You are a professional mockup generator. Your task is to place the single provided flyer design into a realistic mockup scene.
**CRITICAL RULE: You MUST treat the provided image as a final, physical print. DO NOT redraw, regenerate, or alter the content of the flyer. The text and design must be preserved with 100% accuracy.**
Follow the creative prompt below to create the final image.
Creative Prompt: ${prompt}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                ...imageParts,
                { text: textPrompt }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const mime = part.inlineData.mimeType;
            const data = part.inlineData.data;
            return `data:${mime};base64,${data}`;
        }
    }

    throw new Error("Image generation failed. The model did not return an image.");
};