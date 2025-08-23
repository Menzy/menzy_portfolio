import { useEffect, useState } from 'react';
import { ShoppingCart, Minus, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from '@/lib/store';

interface PaystackResponse {
  reference: string;
  status: string;
}

interface PaystackPop {
  setup: (config: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
  }) => {
    openIframe: () => void;
  };
}

declare const PaystackPop: PaystackPop;

export function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePayment = () => {
    // Convert total to pesewas (multiply by 100) and ensure it's an integer
    const amountInPesewas = Math.round(total * 100); // Convert GHS to pesewas

    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: 'joshuamensah46@gmil.com',
      amount: amountInPesewas, // Amount in pesewas
      currency: 'GHS',
      ref: 'ref_' + Math.floor(Math.random() * 1000000000 + 1),
      callback: function(response: PaystackResponse) {
        console.log('Payment complete! Reference:', response.reference);
        clearCart();
      },
      onClose: function() {
        console.log('Payment window closed');
      }
    });
    
    handler.openIframe();
  };

  if (!isClient) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty</p>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between space-x-4 border-b pb-4"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      GH₵{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <div>GH₵{total.toFixed(2)}</div>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={handlePayment}
                  disabled={total <= 0}
                >
                  Checkout with Paystack (GH₵{total.toFixed(2)})
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}