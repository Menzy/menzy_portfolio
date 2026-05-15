import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePaystackPayment } from 'react-paystack';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { nextDay, isWednesday, isSaturday, startOfDay, format, addWeeks } from 'date-fns';
import { Loader2, ArrowLeft, ArrowRight, ShieldCheck, Check, Minus, Plus } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

interface Slot {
  date: Date;
  dayName: string;
  formattedDate: string;
  available: boolean;
  remaining: number;
}

export function BreadPreOrderPage() {
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [qtyWhole, setQtyWhole] = useState(1);
  const [qtySliced, setQtySliced] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const BREAD_PRICE = 100;
  const SLICED_PRICE = 110;
  const totalQty = qtyWhole + qtySliced;
  const totalAmount = (qtyWhole * BREAD_PRICE) + (qtySliced * SLICED_PRICE);

  useEffect(() => {
    if (selectedSlot) {
      const slotObj = slots.find(s => format(s.date, 'yyyy-MM-dd') === selectedSlot);
      if (slotObj && slotObj.remaining < totalQty) {
        setSelectedSlot('');
      }
    }
  }, [totalQty, slots, selectedSlot]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const today = startOfDay(new Date());
      
      const { data: orders, error } = await supabase
        .from('bread_orders')
        .select('delivery_date, payment_status, quantity_whole, quantity_sliced')
        .gte('delivery_date', format(today, 'yyyy-MM-dd'))
        .eq('payment_status', 'success');

      if (error) throw error;

      const orderCounts = (orders || []).reduce((acc: any, order) => {
        const qty = (order.quantity_whole || 0) + (order.quantity_sliced || 0);
        const finalQty = qty > 0 ? qty : 1;
        acc[order.delivery_date] = (acc[order.delivery_date] || 0) + finalQty;
        return acc;
      }, {});

      let candidateWed = isWednesday(today) ? today : nextDay(today, 3);
      let candidateSat = isSaturday(today) ? today : nextDay(today, 6);
      
      const findAvailableSlot = (startDate: Date): Slot => {
        let current = startDate;
        for (let i = 0; i < 4; i++) {
          const dateStr = format(current, 'yyyy-MM-dd');
          const count = orderCounts[dateStr] || 0;
          if (count < 3) {
            return {
              date: current,
              dayName: format(current, 'EEEE'),
              formattedDate: format(current, 'MMM do, yyyy'),
              available: true,
              remaining: 3 - count
            };
          }
          current = addWeeks(current, 1);
        }
        return { date: startDate, dayName: '', formattedDate: '', available: false, remaining: 0 };
      };

      const wedSlot = findAvailableSlot(candidateWed);
      const satSlot = findAvailableSlot(candidateSat);

      const availableSlots = [wedSlot, satSlot]
        .filter(s => s.available)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setSlots(availableSlots);
      if (availableSlots.length > 0) {
        setSelectedSlot(format(availableSlots[0].date, 'yyyy-MM-dd'));
      }
    } catch (err: any) {
      console.error('Error fetching slots:', err);
      toast.error('Failed to load availability slots.');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email || 'order@zozacrumb.com',
    amount: totalAmount * 100, 
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
    currency: 'GHS',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    try {
      const selectedSlotObj = slots.find(s => format(s.date, 'yyyy-MM-dd') === selectedSlot);
      
      const { error } = await supabase.from('bread_orders').insert({
        customer_name: name,
        customer_address: address,
        customer_phone: phone,
        delivery_date: selectedSlot,
        delivery_day: selectedSlotObj?.dayName || '',
        is_sliced: qtySliced > 0,
        quantity_whole: qtyWhole,
        quantity_sliced: qtySliced,
        total_amount: totalAmount,
        paystack_reference: reference.reference,
        payment_status: 'success'
      });

      if (error) throw error;
      
      setIsSuccess(true);
      
    } catch (err: any) {
      console.error('Error saving order:', err);
      toast.error('Payment succeeded, but failed to save order. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    setIsProcessing(false);
    toast.info('Payment cancelled');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    initializePayment({ onSuccess, onClose });
  };

  if (isSuccess) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you, {name}! Your fresh bread has been secured for delivery on {slots.find(s => format(s.date, 'yyyy-MM-dd') === selectedSlot)?.formattedDate}.
            </p>
            <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
              We will prepare your order and contact you via {phone} to arrange delivery via Uber/Yango. Please have your delivery fee ready for the driver.
            </p>
            <Button 
              className="mt-8" 
              variant="outline"
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
                setName('');
                setPhone('');
                setAddress('');
                setQtyWhole(1);
                setQtySliced(0);
                fetchSlots();
              }}
            >
              Place Another Order
            </Button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Zoza Crumb
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Fresh sourdough bread delivered to your door.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="glass-card shadow-xl overflow-hidden border-none relative">
                  <CardContent className="space-y-8 pt-8">
                    
                    {/* Bread Options */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex justify-between items-center pb-2">
                        <span>How would you like your bread?</span>
                      </h3>
                      <div className="flex flex-col space-y-4">
                        {/* Option 1: Whole */}
                        <div 
                          className={`relative border-2 rounded-2xl p-4 transition-all duration-200 flex flex-row items-center text-left ${qtyWhole > 0 ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20' : 'border-border/50 hover:border-primary/40 hover:bg-secondary/20'}`}
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 mr-4 shrink-0 relative rounded-xl overflow-hidden bg-white/50">
                            <img src="/assets/bread/bread.png" alt="Whole Sourdough" className="object-contain w-full h-full drop-shadow-sm p-2" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">Whole Loaf</h4>
                            <p className="text-sm font-medium text-primary mb-1">GH₵100.00</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">Freshly baked, crusty on the outside</p>
                          </div>
                          <div className="ml-4 shrink-0 flex items-center bg-background rounded-full border border-border p-1 shadow-sm">
                            <button 
                              type="button"
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={qtyWhole === 0 || (totalQty === 1 && qtyWhole === 1)}
                              onClick={() => setQtyWhole(Math.max(0, qtyWhole - 1))}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{qtyWhole}</span>
                            <button 
                              type="button"
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={totalQty >= 3}
                              onClick={() => setQtyWhole(qtyWhole + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Option 2: Sliced */}
                        <div 
                          className={`relative border-2 rounded-2xl p-4 transition-all duration-200 flex flex-row items-center text-left ${qtySliced > 0 ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20' : 'border-border/50 hover:border-primary/40 hover:bg-secondary/20'}`}
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 mr-4 shrink-0 relative rounded-xl overflow-hidden bg-white/50">
                            <img src="/assets/bread/sliced.png" alt="Sliced Sourdough" className="object-contain w-full h-full drop-shadow-sm p-2" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">Sliced</h4>
                            <p className="text-sm font-medium text-primary mb-1">GH₵110.00</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">Perfectly sliced for toast and sandwiches</p>
                          </div>
                          <div className="ml-4 shrink-0 flex items-center bg-background rounded-full border border-border p-1 shadow-sm">
                            <button 
                              type="button"
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={qtySliced === 0 || (totalQty === 1 && qtySliced === 1)}
                              onClick={() => setQtySliced(Math.max(0, qtySliced - 1))}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{qtySliced}</span>
                            <button 
                              type="button"
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={totalQty >= 3}
                              onClick={() => setQtySliced(qtySliced + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Slot */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Select Delivery Day</h3>
                      {loadingSlots ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                          <Loader2 className="w-6 h-6 animate-spin mr-2" />
                          Checking availability...
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                          We are completely sold out for the upcoming weeks. Please check back later!
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-3">
                          {slots.map((slot) => {
                            const isDisabled = slot.remaining < totalQty;
                            return (
                              <div 
                                key={format(slot.date, 'yyyy-MM-dd')}
                                className={`border-2 rounded-xl p-4 transition-all flex items-center justify-between ${
                                  isDisabled 
                                    ? 'opacity-50 cursor-not-allowed bg-secondary/10 border-border' 
                                    : selectedSlot === format(slot.date, 'yyyy-MM-dd') 
                                      ? 'border-primary bg-primary/5 shadow-md scale-[1.02] cursor-pointer' 
                                      : 'hover:border-primary/50 hover:bg-secondary/20 bg-background cursor-pointer'
                                }`}
                                onClick={() => !isDisabled && setSelectedSlot(format(slot.date, 'yyyy-MM-dd'))}
                              >
                                <div className="flex-1">
                                  <div className="font-bold text-lg mb-1">{slot.dayName}</div>
                                  <div className="text-sm text-muted-foreground">{slot.formattedDate}</div>
                                </div>
                                <div className="flex items-center space-x-4 shrink-0">
                                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isDisabled ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                                    {slot.remaining} left
                                  </div>
                                  {selectedSlot === format(slot.date, 'yyyy-MM-dd') && !isDisabled ? (
                                    <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                                      <Check className="w-4 h-4" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-muted" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 flex justify-between items-center">
                      <div className="text-xl font-bold">
                        Total: GH₵{totalAmount.toFixed(2)}
                      </div>
                      <Button 
                        size="lg"
                        className="rounded-full px-8"
                        disabled={loadingSlots || slots.length === 0 || !selectedSlot}
                        onClick={() => setStep(2)}
                      >
                        Proceed <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="glass-card shadow-xl border-none overflow-hidden relative">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="-ml-3 mr-2 text-muted-foreground">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                      </Button>
                    </div>
                    <CardTitle className="text-2xl">Delivery Details</CardTitle>
                    <CardDescription>Where should we send your bread?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                            className="bg-secondary/20 h-12"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input 
                              id="phone" 
                              type="tel" 
                              placeholder="024 123 4567" 
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required 
                              className="bg-secondary/20 h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email (Optional)</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="john@example.com" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="bg-secondary/20 h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Delivery Address (Google Maps location) *</Label>
                          <Input 
                            id="address" 
                            placeholder="E.g., 123 Main St, Accra" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required 
                            className="bg-secondary/20 h-12"
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900 mt-6">
                        <p className="text-sm text-blue-800 dark:text-blue-300 flex gap-3">
                          <span className="mt-0.5"><ShieldCheck className="w-5 h-5" /></span>
                          <span>Delivery will be arranged via Uber/Yango on your selected day. You will pay the driver directly for the delivery fee upon arrival.</span>
                        </p>
                      </div>

                      <div className="pt-4 pb-2">
                        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative shadow-lg">
                          <div className="absolute top-0 right-0 p-10 bg-white/10 rounded-bl-full w-24 h-24 -mr-6 -mt-6 pointer-events-none" />
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2 pb-4 border-b border-white/20 text-sm">
                              {qtyWhole > 0 && (
                                <div className="flex justify-between items-center text-primary-foreground/90">
                                  <span>Sourdough Bread (Whole) x{qtyWhole}</span>
                                  <span>GH₵{(qtyWhole * BREAD_PRICE).toFixed(2)}</span>
                                </div>
                              )}
                              {qtySliced > 0 && (
                                <div className="flex justify-between items-center text-primary-foreground/90">
                                  <span>Sourdough Bread (Sliced) x{qtySliced}</span>
                                  <span>GH₵{(qtySliced * SLICED_PRICE).toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center text-lg font-bold">
                              <span>Total</span>
                              <span>GH₵{totalAmount.toFixed(2)}</span>
                            </div>
                            
                            <div className="bg-black/20 p-3 rounded-xl backdrop-blur-sm mt-2 text-sm">
                              <p className="text-xs text-primary-foreground/80 mb-1 uppercase tracking-wider font-semibold">Delivery Day</p>
                              <p className="font-medium">
                                {slots.find(s => format(s.date, 'yyyy-MM-dd') === selectedSlot)?.dayName},{' '}
                                {slots.find(s => format(s.date, 'yyyy-MM-dd') === selectedSlot)?.formattedDate}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-14 text-lg font-semibold mt-4 shadow-lg shadow-primary/20"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay GH₵${totalAmount.toFixed(2)}`
                        )}
                      </Button>
                      
                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground font-medium pt-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span>Secured by Paystack</span>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
}
