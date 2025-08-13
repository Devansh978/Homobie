import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
}

export const SEO = ({
  title,
  description,
  canonicalUrl = "https://www.homobie.com/",
  ogImageUrl = "https://www.homobie.com/assets/preview.jpg"
}: SEOProps) => {
  const keywords = [
    "Home loans", "Mortgage loans", "Loan against property", 
    "Loan against property loan", "Loan against property interest rates",
    "Balance transfer", "Balance transfer credit card", "SIP investment plan",
    "Systematic investment plan", "EMI calculator", "EMI calculator online",
    "SIP calculator", "SIP calculator online"
  ].join(", ");

  // In a Vite React app, we can directly manipulate document head
  React.useEffect(() => {
    // Set title
    document.title = title;
    
    // Set meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', 'Homobie Team');
    setMetaTag('robots', 'index, follow');
    
    // Open Graph
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:image', ogImageUrl, true);
    
    // Twitter
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImageUrl);
    
    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [title, description, canonicalUrl, ogImageUrl, keywords]);

  return null;
};