import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePaystackPayment } from 'react-paystack';
import { format, startOfDay } from 'date-fns';
import {
  BadgeCheck,
  Check,
  Loader2,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageTransition } from '@/components/PageTransition';
import { supabase } from '@/lib/supabase';

interface Slot {
  date: Date;
  dayName: string;
  formattedDate: string;
  available: boolean;
  remaining: number;
}

interface BreadAvailabilityRow {
  delivery_date: string;
  paid_quantity: number;
  status: 'open' | 'closed';
  capacity: number;
}

interface PaystackReference {
  reference: string;
}

interface QuantityControlProps {
  value: number;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

function QuantityControl({ value, canDecrease, canIncrease, onDecrease, onIncrease }: QuantityControlProps) {
  return (
    <div className="flex h-10 w-[128px] max-w-full items-center justify-between rounded-full border border-stone-200 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrease}
        onClick={onDecrease}
        className="grid h-10 w-10 place-items-center rounded-full text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-stone-950">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={!canIncrease}
        onClick={onIncrease}
        className="grid h-10 w-10 place-items-center rounded-full text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

interface LoafRowProps {
  title: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  totalQty: number;
  maxQty: number;
  disabled?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

function LoafRow({
  title,
  description,
  image,
  price,
  quantity,
  totalQty,
  maxQty,
  disabled = false,
  onDecrease,
  onIncrease,
}: LoafRowProps) {
  const selected = quantity > 0;

  return (
    <div
      className={`grid grid-cols-[72px_minmax(0,1fr)] gap-3 border-b border-stone-200 py-4 transition last:border-b-0 sm:grid-cols-[116px_minmax(0,1fr)] sm:gap-4 sm:py-5 ${selected ? 'opacity-100' : 'opacity-80'
        }`}
    >
      <div
        className={`relative h-20 overflow-hidden rounded-[8px] border bg-stone-100 sm:h-28 ${
          selected ? 'border-[#AB6D40]' : 'border-transparent'
        }`}
      >
        <img src={image} alt={title} className={`absolute inset-0 h-full w-full object-contain p-2 ${disabled ? 'grayscale' : ''}`} />
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-3 sm:gap-4">
        <div className="grid min-w-0 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold tracking-normal text-stone-950 sm:text-lg">{title}</h3>
              {disabled && (
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                  Unavailable
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-5 text-stone-500">{description}</p>
          </div>
          {!disabled && <p className="text-sm font-semibold text-[#87512E] sm:shrink-0">GH₵{price.toFixed(2)}</p>}
        </div>

        <div className="mt-auto flex min-w-0 flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-stone-400">
            Max {maxQty} total
          </p>
          <div className="min-w-0 shrink-0">
            <QuantityControl
              value={quantity}
              canDecrease={!disabled && quantity > 0 && !(totalQty === 1 && quantity === 1)}
              canIncrease={!disabled && totalQty < maxQty}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldWrapProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FieldWrap({ icon, children }: FieldWrapProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">{icon}</span>
      {children}
    </div>
  );
}

function setMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

export function BreadPreOrderPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [qtyWhole, setQtyWhole] = useState(1);
  const [qtySliced, setQtySliced] = useState(0);
  const [slicedAvailable, setSlicedAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paystackRef, setPaystackRef] = useState<string>('');

  const BREAD_PRICE = 110;
  const SLICED_PRICE = 120;
  const totalQty = qtyWhole + qtySliced;
  const totalAmount = qtyWhole * BREAD_PRICE + qtySliced * SLICED_PRICE;
  const selectedSlotObj = slots.find((slot) => format(slot.date, 'yyyy-MM-dd') === selectedSlot);
  
  const maxQty = selectedSlotObj 
    ? selectedSlotObj.remaining 
    : (slots.length > 0 ? Math.max(...slots.map((s) => s.remaining)) : 4);

  const orderMetadata = {
    customer_name: name,
    customer_phone: phone,
    customer_email: email || '',
    customer_address: address,
    delivery_date: selectedSlot,
    delivery_day: selectedSlotObj?.dayName || '',
    quantity_whole: qtyWhole,
    quantity_sliced: qtySliced,
    total_quantity: totalQty,
    total_amount: totalAmount,
    order_source: 'zoza-order',
    custom_fields: [
      {
        display_name: 'Customer Name',
        variable_name: 'customer_name',
        value: name,
      },
      {
        display_name: 'Phone',
        variable_name: 'customer_phone',
        value: phone,
      },
      {
        display_name: 'Delivery Address',
        variable_name: 'customer_address',
        value: address,
      },
      {
        display_name: 'Delivery Date',
        variable_name: 'delivery_date',
        value: selectedSlot,
      },
      {
        display_name: 'Delivery Day',
        variable_name: 'delivery_day',
        value: selectedSlotObj?.dayName || '',
      },
      {
        display_name: 'Whole Loaves',
        variable_name: 'quantity_whole',
        value: qtyWhole,
      },
      {
        display_name: 'Sliced Loaves',
        variable_name: 'quantity_sliced',
        value: qtySliced,
      },
      {
        display_name: 'Total Loaves',
        variable_name: 'total_quantity',
        value: totalQty,
      },
    ],
  };

  useEffect(() => {
    const previousTitle = document.title;
    const previousIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.href;
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]') || document.createElement('link');
    const pageUrl = `${window.location.origin}/zoza-order`;
    const previewImage = `${window.location.origin}/assets/bread/bread.png`;

    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = '/assets/bread/zoza-favicon.svg';
    if (!favicon.parentNode) {
      document.head.appendChild(favicon);
    }

    document.title = 'Zoza Bread';
    setMetaTag('name', 'title', 'Zoza Bread');
    setMetaTag('name', 'description', 'Freshly baked sourdough bread, available for pre-order from Zoza Crumb.');
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:title', 'Zoza Bread');
    setMetaTag('property', 'og:description', 'Freshly baked sourdough bread, available for pre-order from Zoza Crumb.');
    setMetaTag('property', 'og:image', previewImage);
    setMetaTag('property', 'og:site_name', 'Zoza Crumb');
    setMetaTag('property', 'twitter:card', 'summary_large_image');
    setMetaTag('property', 'twitter:url', pageUrl);
    setMetaTag('property', 'twitter:title', 'Zoza Bread');
    setMetaTag('property', 'twitter:description', 'Freshly baked sourdough bread, available for pre-order from Zoza Crumb.');
    setMetaTag('property', 'twitter:image', previewImage);

    return () => {
      document.title = previousTitle;
      if (previousIcon) {
        favicon.href = previousIcon;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedSlot) {
      const slotObj = slots.find((slot) => format(slot.date, 'yyyy-MM-dd') === selectedSlot);
      if (slotObj && slotObj.remaining < totalQty) {
        setSelectedSlot('');
      }
    }
  }, [totalQty, slots, selectedSlot]);

  useEffect(() => {
    if (!slicedAvailable && qtySliced > 0) {
      setQtySliced(0);
      setQtyWhole((current) => Math.max(1, current));
    }
  }, [qtySliced, slicedAvailable]);

  const fetchSlicedAvailability = async () => {
    const { data, error } = await supabase
      .from('bread_product_availability')
      .select('available')
      .eq('product_key', 'sliced')
      .maybeSingle();

    const available = !error && Boolean(data?.available);
    setSlicedAvailable(available);
    return available;
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const today = startOfDay(new Date());

      const { data: availabilityRows, error } = await supabase
        .from('bread_order_availability')
        .select('delivery_date, paid_quantity, status, capacity')
        .gte('delivery_date', format(today, 'yyyy-MM-dd'))
        .eq('status', 'open')
        .returns<BreadAvailabilityRow[]>();

      if (error) throw error;

      const availableSlots = (availabilityRows || [])
        .map((row) => {
          const remaining = Math.max(0, row.capacity - (row.paid_quantity || 0));
          if (remaining < 1) return null;

          // Note: dates from supabase might need parsing if we want to ensure correct local timezone
          // but row.delivery_date is YYYY-MM-DD. Appending T00:00:00 ensures local timezone parsing.
          const date = new Date(`${row.delivery_date}T00:00:00`);

          return {
            date,
            dayName: format(date, 'EEEE'),
            formattedDate: format(date, 'MMM do, yyyy'),
            available: true,
            remaining,
          };
        })
        .filter((slot): slot is Slot => Boolean(slot))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setSlots(availableSlots);
      if (availableSlots.length > 0) {
        setSelectedSlot(format(availableSlots[0].date, 'yyyy-MM-dd'));
      }
    } catch (err: unknown) {
      console.error('Error fetching slots:', err);
      toast.error('Failed to load availability slots.');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchSlicedAvailability();
  }, []);

  const config = {
    reference: new Date().getTime().toString(),
    email: email || 'order@zozacrumb.com',
    amount: totalAmount * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
    currency: 'GHS',
    firstname: name,
    phone,
    metadata: orderMetadata,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: PaystackReference) => {
    try {
      const { error } = await supabase.functions.invoke('verify-paystack-order', {
        body: {
          reference: reference.reference,
          customer_name: name,
          customer_address: address,
          customer_phone: phone,
          customer_email: email || undefined,
          delivery_date: selectedSlot,
          delivery_day: selectedSlotObj?.dayName || '',
          quantity_whole: qtyWhole,
          quantity_sliced: qtySliced,
          total_amount: totalAmount,
        },
      });

      if (error) {
        throw error;
      }

      setPaystackRef(reference.reference);
      setIsSuccess(true);
    } catch (err: unknown) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (qtySliced > 0 && !(await fetchSlicedAvailability())) {
      toast.error('Sliced loaves are unavailable right now.');
      setQtySliced(0);
      return;
    }

    setIsProcessing(true);
    initializePayment({ onSuccess, onClose });
  };

  const resetOrder = () => {
    setIsSuccess(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setQtyWhole(1);
    setQtySliced(0);
    fetchSlots();
  };

  if (isSuccess) {
    return (
      <PageTransition>
        <main className="zoza-dark min-h-screen bg-stone-100 px-2 py-4 text-stone-950 sm:px-6 sm:py-6 lg:px-8">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl content-center gap-6 lg:grid-cols-[1fr_360px]"
          >
            <div className="rounded-[8px] bg-white p-3 shadow-sm sm:p-6 lg:p-7">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-stone-200 pb-4 sm:mb-6 sm:pb-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">Zoza Crumb</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Order confirmed</h1>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-950 text-white">
                  <BadgeCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-[1fr_220px] md:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">Your bread is reserved</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
                    Thanks, {name}.
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-stone-500">
                    Your {totalQty === 1 ? 'loaf is' : 'loaves are'} booked for {selectedSlotObj?.formattedDate}. We will
                    call {phone} before dispatch.
                  </p>
                </div>
                <img src="/assets/bread/bread.png" alt="Sourdough loaf" className="hidden w-full object-contain md:block" />
              </div>

              <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
                <div className="flex items-center justify-between gap-4 py-4 text-sm">
                  <dt className="flex items-center gap-1 text-stone-500">
                    <img src="/assets/bread/date.png" alt="" className="h-10 w-10 object-contain bg-transparent" />
                    <span>Delivery day</span>
                  </dt>
                  <dd className="text-right font-semibold text-stone-950">{selectedSlotObj?.dayName}</dd>
                </div>
                <div className="flex justify-between gap-4 py-4 text-sm">
                  <dt className="text-stone-500">Loaves</dt>
                  <dd className="font-semibold text-stone-950">{totalQty}</dd>
                </div>
                <div className="flex justify-between gap-4 py-4 text-sm">
                  <dt className="text-stone-500">Paid</dt>
                  <dd className="font-semibold text-[#87512E]">GH₵{totalAmount.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-4 text-sm">
                  <dt className="text-stone-500">Reference</dt>
                  <dd className="font-mono text-xs font-semibold text-stone-950">{paystackRef}</dd>
                </div>
              </dl>
            </div>

            <aside className="h-fit rounded-[8px] bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-6">
              <div className="flex items-center">
                <img src="/assets/bread/order.png" alt="" className="h-14 w-14 object-contain bg-transparent" />
                <h2 className="text-base font-semibold">Order summary</h2>
              </div>

              <div className="mt-5 space-y-3 border-b border-stone-200 pb-5 text-sm">
                {qtyWhole > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="flex items-center gap-2 text-stone-500">
                      <span>Whole Loaf</span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
                        x{qtyWhole}
                      </span>
                    </span>
                    <span className="font-semibold text-stone-950">GH₵{(qtyWhole * BREAD_PRICE).toFixed(2)}</span>
                  </div>
                )}
                {qtySliced > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="flex items-center gap-2 text-stone-500">
                      <span>Sliced Loaf</span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
                        x{qtySliced}
                      </span>
                    </span>
                    <span className="font-semibold text-stone-950">GH₵{(qtySliced * SLICED_PRICE).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Delivery day</span>
                  <span className="text-right font-semibold text-stone-950">
                    {selectedSlotObj ? `${selectedSlotObj.dayName}, ${selectedSlotObj.formattedDate}` : 'Selected'}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <span className="text-sm text-stone-500">Total paid</span>
                <span className="text-3xl font-semibold tracking-normal text-stone-950">GH₵{totalAmount.toFixed(2)}</span>
              </div>

              <Button
                className="mt-5 h-12 w-full rounded-full bg-[#AB6D40] px-6 text-base font-semibold text-white hover:bg-[#965E38]"
                onClick={resetOrder}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Place another order
              </Button>
            </aside>
          </motion.section>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="zoza-dark min-h-screen bg-stone-100 px-2 py-4 text-stone-950 sm:px-6 sm:py-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[8px] bg-white p-3 shadow-sm sm:p-6 lg:p-7">
            <div className="mb-4 flex items-start justify-between gap-4 border-b border-stone-200 pb-4 sm:mb-6 sm:pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">Zoza Crumb</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Order bread</h1>
              </div>
              <img src="/assets/bread/bread.png" alt="Sourdough loaf" className="hidden h-24 w-36 object-contain sm:block" />
            </div>

            <div className="space-y-6 sm:space-y-8">
              <section>
                <h2 className="text-base font-semibold">Choose your loaf</h2>
                <div className="mt-1 text-sm text-stone-500">Fresh sourdough, baked Wednesdays and Saturdays.</div>
                <div className="mt-3">
                  <LoafRow
                    title="Whole Loaf"
                    description="A full round loaf with a crisp crust."
                    image="/assets/bread/bread.png"
                    price={BREAD_PRICE}
                    quantity={qtyWhole}
                    totalQty={totalQty}
                    maxQty={maxQty}
                    onDecrease={() => setQtyWhole(Math.max(0, qtyWhole - 1))}
                    onIncrease={() => setQtyWhole(qtyWhole + 1)}
                  />
                  <LoafRow
                    title="Sliced Loaf"
                    description={slicedAvailable ? 'Ready for toast, sandwiches, and sharing.' : 'Slicing is unavailable right now.'}
                    image="/assets/bread/sliced.png"
                    price={SLICED_PRICE}
                    quantity={qtySliced}
                    totalQty={totalQty}
                    maxQty={maxQty}
                    disabled={!slicedAvailable}
                    onDecrease={() => setQtySliced(Math.max(0, qtySliced - 1))}
                    onIncrease={() => setQtySliced(qtySliced + 1)}
                  />
                </div>
              </section>

              <section className="border-t border-stone-200 pt-7">
                <div className="flex items-center">
                  <img src="/assets/bread/date.png" alt="" className="h-14 w-14 object-contain bg-transparent" />
                  <h2 className="text-base font-semibold">Delivery day</h2>
                </div>

                {loadingSlots ? (
                  <div className="mt-4 flex items-center rounded-2xl border border-dashed border-stone-300 px-4 py-5 text-sm text-stone-500">
                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                    Checking availability
                  </div>
                ) : slots.length === 0 ? (
                  <div className="mt-4 rounded-[8px] bg-stone-200 px-4 py-5 text-sm font-medium text-stone-700">
                    We are sold out for this week. Please come back next week.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {slots.map((slot) => {
                      const slotKey = format(slot.date, 'yyyy-MM-dd');
                      const disabled = slot.remaining < totalQty;
                      const selected = selectedSlot === slotKey;

                      return (
                        <button
                          key={slotKey}
                          type="button"
                          disabled={disabled}
                          onClick={() => setSelectedSlot(slotKey)}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${disabled
                            ? 'cursor-not-allowed border-stone-200 bg-stone-100 opacity-50'
                            : selected
                              ? 'border-[#AB6D40] bg-[#AB6D40] text-white'
                              : 'border-stone-200 bg-white hover:border-stone-400'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-semibold">{slot.dayName}</p>
                              <p className={`mt-1 text-sm ${selected ? 'text-white/70' : 'text-stone-500'}`}>
                                {slot.formattedDate}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                              <p
                                className={`text-xs font-medium uppercase tracking-[0.14em] ${selected ? 'text-white/65' : 'text-stone-400'
                                  }`}
                              >
                                {slot.remaining} left
                              </p>
                              <span
                                className={`grid h-5 w-5 place-items-center rounded-full border ${selected ? 'border-white bg-white text-stone-950' : 'border-stone-300 text-transparent'
                                  }`}
                              >
                                <Check className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="border-t border-stone-200 pt-7">
                <h2 className="text-base font-semibold">Delivery details</h2>
                <div className="mt-4 grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium text-stone-800">
                      Full Name *
                    </Label>
                    <FieldWrap icon={<User className="h-4 w-4" />}>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 rounded-2xl border-stone-200 bg-white pl-11 text-base placeholder:text-sm focus-visible:ring-stone-950"
                      />
                    </FieldWrap>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-medium text-stone-800">
                        Phone Number *
                      </Label>
                      <FieldWrap icon={<Phone className="h-4 w-4" />}>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="h-12 rounded-2xl border-stone-200 bg-white pl-11 text-base placeholder:text-sm focus-visible:ring-stone-950"
                        />
                      </FieldWrap>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium text-stone-800">
                        Email
                      </Label>
                      <FieldWrap icon={<Mail className="h-4 w-4" />}>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 rounded-2xl border-stone-200 bg-white pl-11 text-base placeholder:text-sm focus-visible:ring-stone-950"
                        />
                      </FieldWrap>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-medium text-stone-800">
                      Delivery Address *
                    </Label>
                    <FieldWrap icon={<MapPin className="h-4 w-4" />}>
                      <Input
                        id="address"
                        placeholder="Google Maps location or street address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="h-12 rounded-2xl border-stone-200 bg-white pl-11 text-base placeholder:text-sm focus-visible:ring-stone-950"
                      />
                    </FieldWrap>
                  </div>

                  <p className="flex gap-2 text-sm leading-6 text-stone-500">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0" />
                    Delivery is arranged via Uber or Yango. The delivery fee is paid to the driver.
                  </p>
                </div>
              </section>
            </div>
          </section>

          <aside className="h-fit rounded-[8px] bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-6">
            <div className="flex items-center">
              <img src="/assets/bread/order.png" alt="" className="h-14 w-14 object-contain bg-transparent" />
              <h2 className="text-base font-semibold">Order summary</h2>
            </div>

            <div className="mt-5 space-y-3 border-b border-stone-200 pb-5 text-sm">
              {qtyWhole > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="flex items-center gap-2 text-stone-500">
                    <span>Whole Loaf</span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
                      x{qtyWhole}
                    </span>
                  </span>
                  <span className="font-semibold text-stone-950">GH₵{(qtyWhole * BREAD_PRICE).toFixed(2)}</span>
                </div>
              )}
              {qtySliced > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="flex items-center gap-2 text-stone-500">
                    <span>Sliced Loaf</span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
                      x{qtySliced}
                    </span>
                  </span>
                  <span className="font-semibold text-stone-950">GH₵{(qtySliced * SLICED_PRICE).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Delivery day</span>
                <span className="text-right font-semibold text-stone-950">
                  {selectedSlotObj ? `${selectedSlotObj.dayName}, ${selectedSlotObj.formattedDate}` : 'Select a day'}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <span className="text-sm text-stone-500">Total</span>
              <span className="text-3xl font-semibold tracking-normal text-stone-950">GH₵{totalAmount.toFixed(2)}</span>
            </div>

            <Button
              type="submit"
              disabled={isProcessing || loadingSlots || slots.length === 0 || !selectedSlot}
              className="mt-5 h-12 w-full rounded-full bg-[#AB6D40] text-base font-semibold text-white hover:bg-[#965E38]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing
                </>
              ) : (
                `Pay GH₵${totalAmount.toFixed(2)}`
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400">
              <ShieldCheck className="h-4 w-4" />
              Secured by Paystack
            </div>
          </aside>
        </form>
      </main>
    </PageTransition>
  );
}
