import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from '@/lib/store';

const products = {
  'professional-lightroom-presets': {
    id: "professional-lightroom-presets",
    name: "Professional Lightroom Presets",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1505238680356-667803448bb6",
      "https://images.unsplash.com/photo-1516035645876-b019b3e64958",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
    ],
    category: "Presets",
    bestseller: true,
    description: `
      Transform your photos instantly with our professional Lightroom presets. Perfect for:
      - Portrait photography
      - Landscape shots
      - Street photography
      - Wedding photos
    `,
    features: [
      "50+ unique presets",
      "Compatible with Lightroom Mobile & Desktop",
      "Video installation guide",
      "Regular updates",
      "Lifetime access"
    ],
    specifications: {
      compatibility: "Adobe Lightroom CC, Classic CC, Mobile",
      format: "XMP & LR Template",
      devices: "Desktop & Mobile",
      includes: "Installation guide, Support"
    },
    reviews: [
      {
        name: "Sarah Johnson",
        rating: 5,
        comment: "These presets have completely transformed my workflow. Highly recommended!",
        date: "April 10, 2024"
      },
      {
        name: "Mike Chen",
        rating: 4,
        comment: "Great presets, very versatile. Would love to see more urban presets in the future.",
        date: "April 8, 2024"
      }
    ]
  }
};

interface ProductDetailsProps {
  slug?: string;
}

export function ProductDetails({ slug }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const product = slug ? products[slug as keyof typeof products] : null;
  const { addItem } = useCartStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/shop">
        <Button variant="ghost" className="group mb-8">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </Button>
      </Link>

      <div ref={contentRef} className="grid md:grid-cols-2 gap-12 opacity-0">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.bestseller && (
                <Badge>Bestseller</Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-2xl font-bold">${product.price}</div>
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.reviews.length} reviews)
                </span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose dark:prose-invert">
                {product.description}
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-6">
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{review.name}</div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="flex items-center mb-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}