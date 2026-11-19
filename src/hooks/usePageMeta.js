import { useEffect } from 'react';

/** Sets the document title and meta description for a page. */
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Verdelle` : 'Verdelle — Indoor Plants Delivered';
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}
