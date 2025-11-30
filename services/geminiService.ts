
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { AnalysisResult, CopyResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    theme: { type: Type.STRING, description: "A concise, marketable description of the design's theme and style, e.g., 'Minimalist Wedding Invitation', '90s Hip Hop Birthday Party'." },
    dominantColors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 5 dominant HEX color codes from the design, from most to least prominent."
    },
    keyText: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of key text phrases extracted from the design (e.g., 'You're Invited', 'Save the Date')."
    },
    eventType: { type: Type.STRING, description: "The occasion, use case, or purpose. Examples: 'Home Decor', 'Daily Wear', 'Gift Giving'. Or the specific type of event, e.g., 'Birthday Party', 'Wedding', 'Corporate Event', 'Halloween Party'."},
    productType: { type: Type.STRING, description: "The specific Etsy product category. Must be one of: 'Digital Template', 'Printable Art', 'Stickers', 'SVG/Cut File', 'Jewelry & Accessories', 'Clothing & Apparel', 'Home & Living', 'Handmade Goods', 'Vintage', 'Craft Supplies', 'Physical Product'."}
  },
  required: ["theme", "dominantColors", "keyText", "eventType", "productType"]
};

const copySchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "One highly-optimized, concise Etsy title (under 140 characters) that uses natural language SEO. Clearly state the product type and key benefits."
    },
    description: {
      type: Type.STRING,
      description: "A comprehensive Etsy description. Start with a strong hook. Use emoji-prefixed bullet points to detail what's included, key features, and benefits. Include relevant sections like 'How It Works', 'What You Receive', shipping info, or care instructions as appropriate."
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 13 SEO-optimized, multi-word Etsy tags. CRITICAL: Each tag MUST be 20 characters or less (including spaces). Include product-specific keywords and trending search terms relevant to the theme and style."
    },
    materials: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of materials for Etsy's materials field. CRITICAL: Each material MUST be 20 characters or less (including spaces). Use materials appropriate to the product type."
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
          prompt: { type: Type.STRING, description: "A detailed prompt for an AI image generator to create the mockup. This prompt must instruct the AI to place the user's flyer design into the generated scene and should incorporate the design's theme and style and context." }
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
                { text: "Analyze this product image(s) for an Etsy listing. Identify: 1) Theme/style, 2) Dominant colors (5 HEX codes), 3) Key text or descriptive elements, 4) Occasion/use case, 5) Product category (Digital Template, Printable Art, Stickers, SVG/Cut File, Jewelry & Accessories, Clothing & Apparel, Home & Living, Handmade Goods, Vintage, Craft Supplies, or Physical Product). Multiple images are variations of the same product." }
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
  const productType = analysis.productType.toLowerCase();
  const isDigitalTemplate = productType.includes('digital') || productType.includes('template');
  const isPrintable = productType.includes('printable');
  const isSVG = productType.includes('svg') || productType.includes('cut file');
  const isStickers = productType.includes('sticker');
  const isJewelry = productType.includes('jewelry') || productType.includes('accessor');
  const isClothing = productType.includes('clothing') || productType.includes('apparel');
  const isHomeDecor = productType.includes('home') || productType.includes('living');
  const isVintage = productType.includes('vintage');
  const isCraftSupplies = productType.includes('craft') || productType.includes('supplies');

  let contextPrompt = '';
  if (isDigitalTemplate) {
    contextPrompt = 'This is an EDITABLE CANVA TEMPLATE. Emphasize: instant download, easy customization, lifetime access, no Canva Pro required.';
  } else if (isPrintable) {
    contextPrompt = 'This is PRINTABLE ART. Emphasize: instant download, high resolution, multiple sizes, print-ready files.';
  } else if (isSVG) {
    contextPrompt = 'This is an SVG/CUT FILE for Cricut/Silhouette. Emphasize: compatible formats (SVG, PNG, DXF, EPS), instant download, scalable.';
  } else if (isStickers) {
    contextPrompt = 'These are STICKERS. Emphasize: material quality (vinyl, matte, glossy), waterproof, size options, uses (laptop, water bottle, planner).';
  } else if (isJewelry) {
    contextPrompt = 'This is JEWELRY/ACCESSORIES. Emphasize: materials (sterling silver, gold-filled, gemstones), dimensions, hypoallergenic, gift-ready packaging.';
  } else if (isClothing) {
    contextPrompt = 'This is CLOTHING/APPAREL. Emphasize: fabric composition, sizing, care instructions, print/embroidery quality, fit description.';
  } else if (isHomeDecor) {
    contextPrompt = 'This is HOME & LIVING. Emphasize: dimensions, materials, installation/display options, room styling ideas, care instructions.';
  } else if (isVintage) {
    contextPrompt = 'This is VINTAGE. Emphasize: age/era, condition details, provenance, measurements, authenticity. Be honest about imperfections.';
  } else if (isCraftSupplies) {
    contextPrompt = 'These are CRAFT SUPPLIES. Emphasize: quantity, dimensions/weights, material, suggested uses, compatibility with other supplies.';
  } else {
    contextPrompt = 'This is a PHYSICAL PRODUCT. Emphasize: materials, dimensions, quality craftsmanship, shipping details, handmade aspects.';
  }

  const prompt = `
    ${contextPrompt}

    Based on the following product analysis, generate compelling Etsy listing copy.
    Analysis:
    - Theme: ${analysis.theme}
    - Product Type: ${analysis.productType}
    - Occasion/Use: ${analysis.eventType}
    - Key Elements: ${analysis.keyText.join(', ')}

    Follow Etsy's latest SEO guidelines. Create:
    - ONE concise, keyword-rich title (under 140 characters)
    - ONE comprehensive description with clear sections and emoji bullet points
    - 13 optimized multi-word tags (each under 20 characters)
    - A materials list appropriate for this product type (each under 20 characters)
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
    const productType = analysis.productType.toLowerCase();
    const isDigitalTemplate = productType.includes('digital') || productType.includes('template');
    const isPrintable = productType.includes('printable');
    const isSVG = productType.includes('svg') || productType.includes('cut file');
    const isStickers = productType.includes('sticker');
    const isJewelry = productType.includes('jewelry') || productType.includes('accessor');
    const isClothing = productType.includes('clothing') || productType.includes('apparel');
    const isHomeDecor = productType.includes('home') || productType.includes('living');
    const isVintage = productType.includes('vintage');
    const isCraftSupplies = productType.includes('craft') || productType.includes('supplies');

    let prompt = `
      Based on the product analysis, generate 10 diverse, creative mockup ideas for an Etsy listing.

      Product Analysis:
      - Theme: ${analysis.theme}
      - Product Type: ${analysis.productType}
      - Occasion/Use: ${analysis.eventType}
      - Dominant Colors: ${analysis.dominantColors.join(', ')}
      - Key Elements: ${analysis.keyText.join(', ')}
    `;

    if (isDigitalTemplate) {
        prompt += `
          This is a DIGITAL TEMPLATE (editable in Canva). Generate 10 prompts:
          1. Hero Thumbnail - Premium bundle shot on modern surface
          2. What's Included Infographic - List of deliverables
          3. How It Works Infographic - 3-step guide
          4. Editable Features Infographic - Callouts showing editable elements
          5. Lifestyle Mockup - Design in context
          6. Device Mockup - Phone & tablet with Canva app
          7. Desktop Mockup - Laptop with Canva interface
          8. Social Media Preview - Instagram post mockup
          9. Thank You Card - Matching review request card
          10. Print & Share Ideas - Options infographic
        `;
    } else if (isPrintable) {
        prompt += `
          This is PRINTABLE ART. Generate 10 prompts:
          1. Hero Frame Display - Art in beautiful frame on styled wall
          2. Gallery Wall Mockup - Part of curated gallery arrangement
          3. Room Context Shot - Art in styled room
          4. Size Comparison - Multiple frame sizes
          5. Lifestyle Vignette - With plants, books, decor
          6. What's Included - File formats and sizes
          7. How to Print - Download, print, frame guide
          8. Gift Presentation - Wrapped as gift
          9. Detail Close-up - Print quality
          10. Seasonal Styling - With seasonal decor
        `;
    } else if (isSVG) {
        prompt += `
          This is an SVG/CUT FILE. Generate 10 prompts:
          1. Hero Product Display - Finished projects on multiple materials
          2. Cricut/Silhouette Mockup - On cutting machine
          3. T-Shirt Application - Heat transfer vinyl
          4. Tumbler/Mug Mockup - Vinyl on drinkware
          5. Car Decal Preview - Vehicle sticker
          6. Wood Sign Project - Cut or stenciled
          7. Paper Craft Application - Card/scrapbook use
          8. File Formats Included - SVG, PNG, DXF, EPS
          9. Size Scalability - Various sizes
          10. Color Variations - Different colors
        `;
    } else if (isStickers) {
        prompt += `
          These are STICKERS. Generate 10 prompts:
          1. Hero Sticker Sheet - Collection on clean background
          2. Laptop Application - On laptop lid
          3. Water Bottle Display - On hydro flask
          4. Planner/Journal Use - Decorating pages
          5. Phone Case Styling - On or around phone
          6. Size Reference - Next to coin/pen
          7. Packaging Preview - Ready to ship
          8. Material Quality - Vinyl/matte/glossy closeup
          9. Weatherproof Demo - With water droplets
          10. Gift Set Display - Arranged as gift
        `;
    } else if (isJewelry) {
        prompt += `
          This is JEWELRY/ACCESSORIES. Generate 10 prompts:
          1. Hero Product Shot - On elegant display
          2. Model Wearing - Showing scale and styling
          3. Detail Macro Shot - Craftsmanship closeup
          4. Gift Box Presentation - Ready to give
          5. Lifestyle Flat Lay - With flowers, fabric
          6. Size Reference - Next to ruler/common object
          7. Styling Options - Multiple ways to wear
          8. Material Close-up - Metal quality/shine
          9. Collection Display - With coordinating pieces
          10. Occasion Styling - For specific events
        `;
    } else if (isClothing) {
        prompt += `
          This is CLOTHING/APPAREL. Generate 10 prompts:
          1. Hero Model Shot - Worn in styled setting
          2. Flat Lay Display - With accessories
          3. Detail Close-up - Fabric, stitching, print
          4. Hanger/Rack Display - On stylish hanger
          5. Back View - Showing full garment
          6. Styled Outfit - Complete look
          7. Size Range - Fit demonstration
          8. Folded/Packaged - Ready to ship
          9. Lifestyle Action - Model in motion
          10. Care Tag/Label - Brand details
        `;
    } else if (isHomeDecor) {
        prompt += `
          This is HOME & LIVING. Generate 10 prompts:
          1. Hero Room Setting - In styled room
          2. Detail Close-up - Texture and craftsmanship
          3. Scale Reference - With furniture
          4. Multiple Angles - Front, side, top views
          5. Lifestyle Vignette - With decor, plants
          6. Seasonal Styling - Holiday/seasonal decor
          7. Gift Presentation - Wrapped as gift
          8. In-Use Shot - Being used as intended
          9. Color/Style Variants - Options available
          10. Packaging - How it arrives
        `;
    } else if (isVintage) {
        prompt += `
          This is VINTAGE. Generate 10 prompts:
          1. Hero Vintage Shot - Era-appropriate styling
          2. Detail Close-ups - Marks, labels, patina
          3. Condition Documentation - Any wear/character
          4. Size/Scale Reference - With ruler
          5. Styled Modern - In modern decor
          6. Styled Period - Period-appropriate setting
          7. Multiple Angles - Full rotation
          8. Functionality Demo - If functional
          9. Collection Context - With vintage items
          10. Natural Light Shot - True colors
        `;
    } else if (isCraftSupplies) {
        prompt += `
          These are CRAFT SUPPLIES. Generate 10 prompts:
          1. Hero Supply Display - Attractively arranged
          2. Quantity/Count Shot - How many included
          3. Size Reference - Next to ruler
          4. Color/Variety Display - Full range
          5. Project Example - Finished project
          6. Detail Quality - Material closeup
          7. Packaging - How they arrive
          8. Work in Progress - Being used
          9. Compatibility Demo - With tools
          10. Comparison Shot - Value demonstration
        `;
    } else {
        prompt += `
          This is a PHYSICAL PRODUCT. Generate 10 prompts:
          1. Hero Product Shot - Clean, professional
          2. Lifestyle Context - In use
          3. Detail Close-up - Quality details
          4. Scale Reference - Size context
          5. Multiple Angles - Various viewpoints
          6. Packaging Display - Shipping/gift
          7. In-Use Action - Being used
          8. Styled Flat Lay - With props
          9. Gift Presentation - Gift-ready
          10. Feature Highlight - Key benefit
        `;
    }

    prompt += `

For each, generate a detailed AI image prompt incorporating the theme (${analysis.theme}) and colors (${analysis.dominantColors.join(', ')}).`;

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
      ? `You are a professional mockup generator. Your task is to place the provided product images onto a single background to create a composite "bundle" or "collection" image.
**CRITICAL RULE: You MUST treat the provided images as final, physical prints. DO NOT redraw, regenerate, blend, or alter the content within the images in any way. The text and design on them must be preserved with 100% accuracy.**
Follow the creative prompt below to determine the background and scene, but apply the critical rule above all else.
Creative Prompt: ${prompt}`
      : `You are a professional mockup generator. Your task is to place the single provided product design into a realistic mockup scene.
**CRITICAL RULE: You MUST treat the provided image as a final, physical print. DO NOT redraw, regenerate, or alter the content of the image. The text and design must be preserved with 100% accuracy.**
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