// Illustrative demo testimonials — replace with genuine, consented customer reviews.
export const testimonials = [
  { name: 'Sarah M.', role: 'Plant lover', rating: 5, plant: 'pothos', quote: 'Absolutely love this plant shop! Beautiful, healthy plants and a great selection. The team helped me pick the perfect plant for my low-light apartment.' },
  { name: 'Emily R.', role: 'First-time plant parent', rating: 5, plant: 'zz', quote: 'My ZZ plant arrived perfectly packed and looks even better than the photos. The care card made it so easy to get started.' },
  { name: 'Daniel K.', role: 'Home office gardener', rating: 5, plant: 'peperomia', quote: 'Three plants on my desk now and they’re all thriving. Quick delivery and genuinely helpful care tips.' },
  { name: 'Aisha P.', role: 'Balcony gardener', rating: 4, plant: 'boston-fern', quote: 'Lovely ferns and great communication. One pot was slightly scuffed and they sorted it straight away.' },
];

export const reviewsFor = (product) => {
  const n = product.id.charCodeAt(product.id.length - 1);
  return [0, 1, 2].map((i) => {
    const t = testimonials[(n + i) % testimonials.length];
    return { id: `${product.id}-${i}`, name: t.name, rating: t.rating, body: t.quote, date: `2026-0${9 - i}-1${i + 2}` };
  });
};
