import React from 'react';
import { CheckIcon, StarIcon, SparklesIcon, ZapIcon, ShieldIcon, UsersIcon } from './icons';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenPricing: () => void;
}

const FEATURES = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Mockups',
    description: 'Generate 10 professional product mockups instantly. Perfect for Etsy listings that convert.'
  },
  {
    icon: ZapIcon,
    title: 'SEO-Optimized Copy',
    description: 'Get titles, descriptions, and all 13 tags optimized for Etsy search. Rank higher, sell more.'
  },
  {
    icon: ShieldIcon,
    title: 'All Product Categories',
    description: 'Works for digital templates, jewelry, clothing, home decor, vintage, stickers, and more.'
  },
  {
    icon: UsersIcon,
    title: 'Built for Sellers',
    description: 'Save hours per listing. Focus on creating, let AI handle the marketing.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Digital Template Seller',
    avatar: 'SM',
    rating: 5,
    text: 'This tool cut my listing time from 2 hours to 10 minutes. The mockups look professional and my sales increased 40% in the first month!'
  },
  {
    name: 'James R.',
    role: 'Jewelry Maker',
    avatar: 'JR',
    rating: 5,
    text: 'Finally, AI that understands Etsy! The tags it generates actually match what buyers search for. Game changer for my shop.'
  },
  {
    name: 'Emily K.',
    role: 'Printable Art Creator',
    avatar: 'EK',
    rating: 5,
    text: 'I was skeptical, but the gallery wall mockups it creates are stunning. Customers can visualize the art in their home now.'
  }
];

const STATS = [
  { value: '50K+', label: 'Listings Created' },
  { value: '12K+', label: 'Happy Sellers' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '10x', label: 'Faster Listings' }
];

const FAQ = [
  {
    q: 'How does the AI mockup generator work?',
    a: 'Upload your product images, and our AI analyzes them to understand style, colors, and category. It then generates 10 professional mockups tailored to your product type - lifestyle shots, infographics, size comparisons, and more.'
  },
  {
    q: 'What product categories are supported?',
    a: 'We support all major Etsy categories: Digital Templates, Printable Art, Stickers, SVG/Cut Files, Jewelry & Accessories, Clothing & Apparel, Home & Living, Handmade Goods, Vintage items, and Craft Supplies.'
  },
  {
    q: 'Are the generated tags Etsy-compliant?',
    a: 'Yes! All 13 tags are under 20 characters and optimized for Etsy search. We follow Etsy\'s latest SEO guidelines to help your listings rank higher.'
  },
  {
    q: 'Can I use this for my existing listings?',
    a: 'Absolutely! Upload photos of your current products and get fresh mockups and updated SEO copy. Many sellers use this to refresh underperforming listings.'
  },
  {
    q: 'What\'s included in the free plan?',
    a: 'Free users get 3 complete listing generations per day with watermarked mockups. Upgrade to Pro for unlimited generations and watermark-free images.'
  },
  {
    q: 'How do I remove the watermark?',
    a: 'Upgrade to Pro ($9/month) or get Lifetime access ($49 one-time) to download all mockups without watermarks, plus get priority AI generation.'
  }
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Upload Your Design', description: 'Add up to 5 product images. Works with templates, photos, or product shots.' },
  { step: 2, title: 'AI Analyzes & Creates', description: 'Our AI identifies your product type and generates tailored mockups + SEO copy.' },
  { step: 3, title: 'Download & List', description: 'Download everything as a ZIP. Copy-paste into Etsy and you\'re live!' }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenPricing }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 50%, #F0FFFF 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6" style={{background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B'}}>
              <SparklesIcon className="w-4 h-4 mr-2" />
              Trusted by 12,000+ Etsy Sellers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Create Professional Etsy Listings in{' '}
              <span style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #F5A623 50%, #20B2AA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                Seconds, Not Hours
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered mockup generator + SEO-optimized titles, descriptions, and tags.
              Works for digital products, jewelry, clothing, home decor, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 text-lg font-semibold rounded-xl text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}
              >
                Start Creating Free
              </button>
              <button
                onClick={onOpenPricing}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-all duration-300"
              >
                View Pricing
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">No credit card required. 3 free listings per day.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold" style={{color: '#FF6B6B'}}>{stat.value}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Sell More</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional listing assets in minutes, not hours. Let AI do the heavy lifting.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to professional Etsy listings</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6" style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {item.step < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-gray-300 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by Etsy Sellers</h2>
            <p className="text-xl text-gray-600">See what our users have to say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <StarIcon key={j} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg font-normal text-gray-500">/forever</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> 3 listings per day</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> 10 mockups per listing</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> SEO titles & descriptions</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> 13 optimized tags</li>
                <li className="flex items-center text-gray-400"><span className="w-5 h-5 mr-2">✗</span> Watermark on images</li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 px-6 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:border-gray-300 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 relative" style={{borderColor: '#FF6B6B'}}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">$9<span className="text-lg font-normal text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> Unlimited listings</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> No watermarks</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> Priority AI generation</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> Bulk download as ZIP</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> Email support</li>
              </ul>
              <button
                onClick={onOpenPricing}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all hover:scale-105"
                style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Lifetime Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">$49<span className="text-lg font-normal text-gray-500">/once</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> Everything in Pro</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> One-time payment</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> Lifetime updates</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> Priority support</li>
                <li className="flex items-center text-gray-600"><CheckIcon className="w-5 h-5 mr-2 text-teal-500" /> Early access features</li>
              </ul>
              <button
                onClick={onOpenPricing}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all hover:scale-105"
                style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}
              >
                Get Lifetime Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Got questions? We've got answers.</p>
          </div>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 group">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 list-none">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Supercharge Your Etsy Shop?</h2>
          <p className="text-xl text-white/90 mb-8">Join 12,000+ sellers who save hours every week with AI-powered listings.</p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 text-lg font-semibold rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{color: '#FF6B6B'}}
          >
            Start Creating Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Etsy Design Optimizer</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © {new Date().getFullYear()} Etsy Design Optimizer. All rights reserved. Not affiliated with Etsy, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
};
