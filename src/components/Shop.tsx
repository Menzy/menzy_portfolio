import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from '@/lib/store';

const products = [
  {
    id: "professional-lightroom-presets",
    slug: "professional-lightroom-presets",
    name: "Professional Lightroom Presets",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1505238680356-667803448bb6",
    category: "Presets",
    bestseller: true
  },
  {
    id: "photography-masterclass",
    slug: "photography-masterclass",
    name: "Photography Masterclass",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1516035645876-b019b3e64958",
    category: "Course",
    new: true
  },
  {
    id: "portrait-editing-guide",
    slug: "portrait-editing-guide",
    name: "Portrait Editing Guide",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    category: "Guide"
  },
  {
    id: "street-photography-bundle",
    slug: "street-photography-bundle",
    name: "Street Photography Bundle",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1520390138845-fd2d229dd553",
    category: "Bundle"
  }
];

export function Shop() {
  const productsRef = useRef<(HTMLDivElement | null)[]>([]);
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

    productsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <section id="shop" className="pt-32 pb-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-slide-up">
            Shop
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Elevate your photography with our curated collection of presets, courses, and guides
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <Link to={`/shop/${product.slug}`} key={index}>
              <Card 
                className="overflow-hidden group opacity-0 h-full"
                ref={el => productsRef.current[index] = el}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.bestseller && (
                    <Badge className="absolute top-2 left-2">
                      Bestseller
                    </Badge>
                  )}
                  {product.new && (
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      New
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      ${product.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="rounded-full"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}