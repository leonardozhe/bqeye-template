export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  category: 'colored-contacts' | 'cosplay' | 'accessories';
  rating: number;
  reviews: number;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  colors?: { name: string; hex: string }[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Galaxy Blue Colored Contacts',
    slug: 'galaxy-blue-colored-contacts',
    price: 19.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop',
    description: 'Stunning galaxy blue lenses that transform your eye color with a natural-looking gradient effect.',
    category: 'colored-contacts',
    rating: 4.8,
    reviews: 234,
    images: [
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=800&fit=crop',
    ],
    isNew: true,
    discount: 33,
    colors: [
      { name: 'Blue', hex: '#463AE8' },
      { name: 'Gray', hex: '#808080' },
    ],
  },
  {
    id: 2,
    name: 'Hazel Brown Natural Contacts',
    slug: 'hazel-brown-natural-contacts',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=600&h=600&fit=crop',
    description: 'Warm hazel brown lenses for a subtle, everyday natural enhancement to your eye color.',
    category: 'colored-contacts',
    rating: 4.6,
    reviews: 189,
    images: [
      'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop',
    ],
    isBestSeller: true,
    discount: 29,
    colors: [
      { name: 'Hazel', hex: '#8B7355' },
      { name: 'Brown', hex: '#6B4226' },
    ],
  },
  {
    id: 3,
    name: 'Sclera White Cosplay Lenses',
    slug: 'sclera-white-cosplay-lenses',
    price: 34.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&h=600&fit=crop',
    description: 'Full sclera white lenses perfect for dramatic cosplay transformations and Halloween looks.',
    category: 'cosplay',
    rating: 4.9,
    reviews: 312,
    images: [
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=800&h=800&fit=crop',
    ],
    isBestSeller: true,
    discount: 30,
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Red', hex: '#FF0000' },
    ],
  },
  {
    id: 4,
    name: 'Violet Purple Dream Lenses',
    slug: 'violet-purple-dream-lenses',
    price: 22.99,
    originalPrice: 32.99,
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop&sat=-30',
    description: 'Enchanting violet purple lenses that create a mystical, eye-catching look.',
    category: 'colored-contacts',
    rating: 4.7,
    reviews: 156,
    images: [
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop&sat=-30',
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=800&fit=crop',
    ],
    isNew: true,
    discount: 30,
    colors: [
      { name: 'Violet', hex: '#7B68EE' },
      { name: 'Purple', hex: '#463AE8' },
    ],
  },
  {
    id: 5,
    name: 'Emerald Green Contacts',
    slug: 'emerald-green-contacts',
    price: 21.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&h=600&fit=crop&sat=20',
    description: 'Vibrant emerald green lenses for a bold, natural-looking color transformation.',
    category: 'colored-contacts',
    rating: 4.5,
    reviews: 178,
    images: [
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=800&fit=crop&sat=20',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop',
    ],
    discount: 27,
    colors: [
      { name: 'Green', hex: '#2E8B57' },
      { name: 'Emerald', hex: '#50C878' },
    ],
  },
  {
    id: 6,
    name: 'Demon Red Cosplay Lenses',
    slug: 'demon-red-cosplay-lenses',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop&sat=50',
    description: 'Intense red lenses perfect for demon, vampire, and villain cosplay characters.',
    category: 'cosplay',
    rating: 4.8,
    reviews: 267,
    images: [
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop&sat=50',
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=800&fit=crop',
    ],
    isBestSeller: true,
    discount: 25,
    colors: [
      { name: 'Red', hex: '#DC143C' },
      { name: 'Dark Red', hex: '#8B0000' },
    ],
  },
  {
    id: 7,
    name: 'Contact Lens Case - Premium',
    slug: 'contact-lens-case-premium',
    price: 9.99,
    originalPrice: 14.99,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop',
    description: 'Compact, travel-friendly contact lens case with leak-proof seal.',
    category: 'accessories',
    rating: 4.3,
    reviews: 89,
    images: [
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=800&fit=crop',
    ],
    discount: 33,
  },
  {
    id: 8,
    name: 'Lens Solution 120ml',
    slug: 'lens-solution-120ml',
    price: 7.99,
    originalPrice: 11.99,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop&sat=-20',
    description: 'Gentle multi-purpose lens solution for daily cleaning and storage.',
    category: 'accessories',
    rating: 4.4,
    reviews: 124,
    images: [
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=800&fit=crop&sat=-20',
    ],
    discount: 33,
  },
  {
    id: 9,
    name: 'Cat Eye Cosplay Contacts',
    slug: 'cat-eye-cosplay-contacts',
    price: 32.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=600&h=600&fit=crop&hue=120',
    description: 'Unique cat-eye slit pupil lenses for feline and supernatural cosplay.',
    category: 'cosplay',
    rating: 4.7,
    reviews: 198,
    images: [
      'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=800&h=800&fit=crop&hue=120',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop',
    ],
    isNew: true,
    discount: 27,
    colors: [
      { name: 'Yellow', hex: '#FFD700' },
      { name: 'Green', hex: '#32CD32' },
    ],
  },
  {
    id: 10,
    name: 'Honey Amber Contacts',
    slug: 'honey-amber-contacts',
    price: 23.99,
    originalPrice: 33.99,
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&h=600&fit=crop&hue=30',
    description: 'Warm honey amber lenses for a sun-kissed, natural enhancement.',
    category: 'colored-contacts',
    rating: 4.6,
    reviews: 145,
    images: [
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=800&fit=crop&hue=30',
      'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=800&h=800&fit=crop',
    ],
    discount: 29,
    colors: [
      { name: 'Honey', hex: '#EB9605' },
      { name: 'Amber', hex: '#FFBF00' },
    ],
  },
  {
    id: 11,
    name: 'Sharingan Cosplay Lenses',
    slug: 'sharingan-cosplay-lenses',
    price: 36.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop&hue=0',
    description: 'Iconic Sharingan pattern lenses inspired by the famous anime series.',
    category: 'cosplay',
    rating: 4.9,
    reviews: 421,
    images: [
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop&hue=0',
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=800&fit=crop',
    ],
    isBestSeller: true,
    discount: 26,
    colors: [
      { name: 'Red', hex: '#FF0000' },
      { name: 'Black', hex: '#000000' },
    ],
  },
  {
    id: 12,
    name: 'Ice Gray Contacts',
    slug: 'ice-gray-contacts',
    price: 20.99,
    originalPrice: 28.99,
    image: 'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=600&h=600&fit=crop&sat=-80',
    description: 'Cool ice gray lenses for an ethereal, otherworldly appearance.',
    category: 'colored-contacts',
    rating: 4.5,
    reviews: 167,
    images: [
      'https://images.unsplash.com/photo-1592981712106-c44375939d7b?w=800&h=800&fit=crop&sat=-80',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop',
    ],
    isNew: true,
    discount: 28,
    colors: [
      { name: 'Gray', hex: '#A9A9A9' },
      { name: 'Light Gray', hex: '#D3D3D3' },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProducts(category?: string): Product[] {
  if (!category) return products;
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(currentSlug: string, limit = 4): Product[] {
  const current = getProductBySlug(currentSlug);
  if (!current) return products.slice(0, limit);
  return products
    .filter((p) => p.slug !== currentSlug && p.category === current.category)
    .slice(0, limit);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}
