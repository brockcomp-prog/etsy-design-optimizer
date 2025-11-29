import type { AnalysisResult } from './types';

export const MOCKUP_PROMPTS: { name: string; prompt: (analysis: AnalysisResult) => string }[] = [
  {
    name: 'Hero Thumbnail (4x3)',
    prompt: (analysis) => `Place this flyer design onto a clean, minimalist flatlay background with subtle, complementary design elements related to a ${analysis.eventType}. Add a small, elegant, semi-transparent overlay in a corner that says 'Editable in Canva'. Ensure the final image is high-resolution with a 4:3 aspect ratio and has a professional, polished look.`
  },
  {
    name: 'Lifestyle Mockup (Square)',
    prompt: (analysis) => `Show this flyer design on a modern smartphone screen where it's being edited in the Canva app. The phone is held by a person in a realistic lifestyle setting matching the ${analysis.theme}. The background should be slightly blurred to focus on the phone. Final image should be a vibrant square (1:1 aspect ratio).`
  },
  {
    name: 'Phone & Social Preview (Vertical)',
    prompt: (analysis) => `Display this flyer as if it's being viewed on a social media app on a phone. The phone screen takes up most of the view. The background is a simple, abstract gradient using the flyer's colors. Include a small 'Edit in Canva' call-to-action overlay. The final aspect ratio should be vertical (1080x1350).`
  },
  {
    name: 'Instagram Post Mockup',
    prompt: (analysis) => `Create a realistic mockup showing this flyer as an Instagram post on a smartphone screen. The post should have a caption relevant to a ${analysis.eventType}, and show UI elements like likes and comments. The background should be a stylish, neutral flatlay. This is for a digital flyer, not a printed poster.`
  },
  {
    name: 'Desktop Mockup',
    prompt: (analysis) => `Show this flyer design on a modern laptop screen (like a MacBook) placed on a clean desk, showing the design being edited in the Canva web interface. Include related items like a coffee mug and notebook to create a realistic workspace for planning a ${analysis.eventType}.`
  },
  {
    name: 'Tablet Mockup',
    prompt: (analysis) => `Place this flyer on the screen of a tablet (like an iPad) resting on a marble countertop. The screen should show the Canva editing interface. The scene should be bright and airy, with a small 'Drag and Drop' text element visible.`
  },
  {
    name: 'Party Scene Mockup',
    prompt: (analysis) => `Integrate this flyer subtly into a festive party scene matching the ${analysis.theme}. It could be on a table next to drinks and confetti. The flyer should be in focus, with the background having a soft, bokeh effect. Add a small text overlay saying 'Customize for your event'.`
  },
  {
    name: 'Features Highlight',
    prompt: (analysis) => `Create a visually appealing graphic that showcases this flyer. Place the flyer prominently. Around it, use icons and short text snippets to highlight key features: 'Editable in Canva', 'Instant Access', 'Fully Customizable'. Use the flyer's color palette for a cohesive look.`
  },
  {
    name: 'Thank You Card Mockup',
    prompt: (analysis) => `Create a photorealistic mockup of a Thank You card. The card's design must strictly match the theme and color palette (${analysis.dominantColors.join(', ')}) of the provided flyer. It should be displayed in a bright, clean, flatlay setting.

**CARD CONTENT REQUIREMENTS (NON-NEGOTIABLE):**

1.  **Header:** The most prominent text must be **"Thank You!"** in a stylish, elegant font that complements the flyer's design.
2.  **Body Text:** Directly below the header, in a smaller, clean sans-serif font, include the following message exactly: **"Your support means the world to us. We would be so grateful if you could share your thoughts in a review!"**
3.  **Visual Cue:** Below the body text, include a simple, clean graphic of **five empty stars** (☆☆☆☆☆) to visually prompt for a review.

**CRITICAL RULES:**
-   **Readability is paramount.** All text must have high contrast against its background and be perfectly legible.
-   The layout must be clean, centered, and balanced. Do not clutter the card.
-   The overall aesthetic must be professional and cohesive with the flyer's ${analysis.theme} theme.`
  },
  {
    name: 'Infographic - How It Works',
    prompt: (analysis) => `Your primary goal is an unambiguous 'How It Works' infographic (800x1200px vertical) that a customer can understand in 5 seconds. Clarity is more important than complex design.
- **Structure:** Create a bold, clear, numbered list from top to bottom. Each step must be a visually separate block or section with a large number (1, 2, 3).
- **Step 1:** Use a clear icon for 'Purchase/Download'. The text must be exactly "1. Purchase & Download: Instantly receive a PDF with your template link."
- **Step 2:** Use a clear icon for 'Click/Link'. The text must be exactly "2. Access Your Template: Open the PDF and click the link to go to Canva."
- **Step 3:** Use a clear icon for 'Edit/Customize'. The text must be exactly "3. Edit & Share: Customize in Canva, then download and share your design."
- **Critical Readability Rules:** Use a clean, legible sans-serif font. Text must be placed on a solid or very simple background with high contrast. Absolutely no overlapping text or elements. Each step should be easily distinguishable.`
  }
];