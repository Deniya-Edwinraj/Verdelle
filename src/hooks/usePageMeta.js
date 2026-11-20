import { useEffect } from 'react';

const DEFAULT_TITLE = 'Verdelle — Indoor Plants Delivered';

function setMeta(attr, key, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Sets the document title, meta description and social-sharing (Open Graph / Twitter) tags for a page.
 * Pass `image` (absolute or root-relative URL) to use a page-specific preview image.
 */
export function usePageMeta(title, description, { image, type } = {}) {
  useEffect(() => {
    const full = title ? `${title} | Verdelle` : DEFAULT_TITLE;
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('name', 'twitter:title', full);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:description', description);
    setMeta('property', 'og:url', window.location.href);
    setMeta('property', 'og:type', type || 'website');
    if (image) {
      const abs = new URL(image, window.location.origin).href;
      setMeta('property', 'og:image', abs);
      setMeta('name', 'twitter:image', abs);
    }
  }, [title, description, image, type]);
}
