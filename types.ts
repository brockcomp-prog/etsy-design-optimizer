// Comprehensive Etsy Category Types

export type EtsyCategory =
  | 'digital-templates'
  | 'printable-art'
  | 'invitations'
  | 'planners-journals'
  | 'stickers'
  | 'svg-files'
  | 'social-media'
  | 'business-cards'
  | 'resume-templates'
  | 'wedding'
  | 'baby-kids'
  | 'home-decor'
  | 'clothing'
  | 'jewelry'
  | 'craft-supplies'
  | 'vintage'
  | 'handmade';

export interface CategoryConfig {
  id: EtsyCategory;
  name: string;
  icon: string;
  description: string;
  mockupTypes: string[];
  suggestedTags: string[];
}

export const ETSY_CATEGORIES: CategoryConfig[] = [
  {
    id: 'digital-templates',
    name: 'Digital Templates',
    icon: '📄',
    description: 'Canva templates, editable designs',
    mockupTypes: ['device-mockup', 'lifestyle', 'how-it-works', 'what-included', 'editing-preview'],
    suggestedTags: ['canva template', 'editable', 'instant download', 'digital']
  },
  {
    id: 'printable-art',
    name: 'Printable Art',
    icon: '🖼️',
    description: 'Wall art, posters, prints',
    mockupTypes: ['frame-mockup', 'room-scene', 'gallery-wall', 'close-up', 'size-comparison'],
    suggestedTags: ['printable art', 'wall art', 'home decor', 'digital print']
  },
  {
    id: 'invitations',
    name: 'Invitations',
    icon: '💌',
    description: 'Party, wedding, event invites',
    mockupTypes: ['flatlay', 'envelope-scene', 'party-setup', 'device-preview', 'print-preview'],
    suggestedTags: ['invitation', 'party invite', 'editable invite', 'printable']
  },
  {
    id: 'planners-journals',
    name: 'Planners & Journals',
    icon: '📔',
    description: 'Digital planners, printable pages',
    mockupTypes: ['tablet-mockup', 'desk-scene', 'page-spread', 'goodnotes-preview', 'feature-highlights'],
    suggestedTags: ['digital planner', 'goodnotes', 'notability', 'printable planner']
  },
  {
    id: 'stickers',
    name: 'Stickers',
    icon: '✨',
    description: 'Digital stickers, planner stickers',
    mockupTypes: ['sticker-sheet', 'in-use-mockup', 'planner-preview', 'close-up', 'bundle-display'],
    suggestedTags: ['digital stickers', 'planner stickers', 'goodnotes stickers', 'png stickers']
  },
  {
    id: 'svg-files',
    name: 'SVG & Cut Files',
    icon: '✂️',
    description: 'Cricut, Silhouette cut files',
    mockupTypes: ['vinyl-mockup', 'shirt-mockup', 'mug-mockup', 'sign-mockup', 'layered-preview'],
    suggestedTags: ['svg file', 'cricut', 'silhouette', 'cut file', 'vinyl decal']
  },
  {
    id: 'social-media',
    name: 'Social Media',
    icon: '📱',
    description: 'Instagram, Pinterest templates',
    mockupTypes: ['phone-mockup', 'feed-preview', 'story-mockup', 'carousel-preview', 'profile-mockup'],
    suggestedTags: ['instagram template', 'social media', 'canva template', 'content creator']
  },
  {
    id: 'business-cards',
    name: 'Business & Branding',
    icon: '💼',
    description: 'Business cards, logos, branding kits',
    mockupTypes: ['card-stack', 'desk-scene', 'brand-board', 'stationery-set', 'logo-mockup'],
    suggestedTags: ['business card', 'branding kit', 'logo template', 'canva template']
  },
  {
    id: 'resume-templates',
    name: 'Resume & CV',
    icon: '📋',
    description: 'Resume, CV, cover letter templates',
    mockupTypes: ['page-mockup', 'professional-scene', 'multi-page-spread', 'device-preview', 'print-stack'],
    suggestedTags: ['resume template', 'cv template', 'cover letter', 'canva resume']
  },
  {
    id: 'wedding',
    name: 'Wedding',
    icon: '💒',
    description: 'Wedding invites, signs, programs',
    mockupTypes: ['elegant-flatlay', 'venue-scene', 'invitation-suite', 'signage-mockup', 'table-setting'],
    suggestedTags: ['wedding invitation', 'wedding sign', 'bridal shower', 'wedding template']
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    icon: '👶',
    description: 'Baby shower, birthday, kids printables',
    mockupTypes: ['party-scene', 'nursery-mockup', 'activity-preview', 'invitation-flatlay', 'banner-mockup'],
    suggestedTags: ['baby shower', 'birthday party', 'kids printable', 'nursery decor']
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    icon: '🏠',
    description: 'Physical home items, decor',
    mockupTypes: ['room-scene', 'lifestyle-shot', 'detail-close-up', 'scale-reference', 'styled-vignette'],
    suggestedTags: ['home decor', 'wall decor', 'living room', 'farmhouse']
  },
  {
    id: 'clothing',
    name: 'Clothing & Apparel',
    icon: '👕',
    description: 'T-shirts, hoodies, apparel',
    mockupTypes: ['model-shot', 'flat-lay', 'hanging-mockup', 'detail-shot', 'lifestyle-scene'],
    suggestedTags: ['t-shirt', 'graphic tee', 'unisex shirt', 'funny shirt']
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    icon: '💎',
    description: 'Handmade jewelry, accessories',
    mockupTypes: ['jewelry-display', 'model-wearing', 'detail-macro', 'gift-box', 'styled-flatlay'],
    suggestedTags: ['handmade jewelry', 'necklace', 'earrings', 'gift for her']
  },
  {
    id: 'craft-supplies',
    name: 'Craft Supplies',
    icon: '🧵',
    description: 'Patterns, supplies, craft materials',
    mockupTypes: ['material-flatlay', 'project-preview', 'packaging-shot', 'scale-reference', 'in-use-demo'],
    suggestedTags: ['craft supplies', 'sewing pattern', 'diy kit', 'handmade']
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: '🏺',
    description: 'Vintage items, antiques',
    mockupTypes: ['styled-vintage', 'detail-patina', 'scale-context', 'collection-grouping', 'heritage-scene'],
    suggestedTags: ['vintage', 'antique', 'retro', 'collectible']
  },
  {
    id: 'handmade',
    name: 'Handmade Goods',
    icon: '🧶',
    description: 'Handcrafted items, artisan goods',
    mockupTypes: ['craft-in-progress', 'finished-product', 'packaging', 'gift-ready', 'artisan-scene'],
    suggestedTags: ['handmade', 'artisan', 'handcrafted', 'unique gift']
  }
];

export interface AnalysisResult {
  theme: string;
  dominantColors: string[];
  keyText: string[];
  eventType: string;
  productType: string;
  category?: EtsyCategory;
  style?: string;
  targetAudience?: string;
}

export interface CopyResult {
  title: string;
  description: string;
  tags: string[];
  materials: string[];
}

export interface GeneratedImage {
  id: string;
  name: string;
  base64: string | null;
  status: 'pending' | 'completed' | 'failed';
  mockupType?: string;
}

export interface MockupPrompt {
  name: string;
  prompt: string;
  mockupType: string;
}

export function getCategoryById(id: EtsyCategory): CategoryConfig | undefined {
  return ETSY_CATEGORIES.find(cat => cat.id === id);
}
