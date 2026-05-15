import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePaystackPayment } from 'react-paystack';
import { addWeeks, format, isSaturday, isWednesday, nextDay, startOfDay } from 'date-fns';
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

interface BreadOrderRow {
  delivery_date: string;
  payment_status: string;
  quantity_whole: number | null;
  quantity_sliced: number | null;
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
    <div className="flex h-10 items-center rounded-full border border-stone-200 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrease}
        onClick={onDecrease}
        className="grid h-10 w-10 place-items-center rounded-full text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums text-stone-950">{value}</span>
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
  onDecrease,
  onIncrease,
}: LoafRowProps) {
  const selected = quantity > 0;

  return (
    <div
      className={`grid grid-cols-[88px_1fr] gap-4 border-b border-stone-200 py-5 transition last:border-b-0 sm:grid-cols-[116px_1fr] ${selected ? 'opacity-100' : 'opacity-80'
        }`}
    >
      <div className="relative h-24 overflow-hidden rounded-[8px] bg-stone-100 sm:h-28">
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-contain p-2" />
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-normal text-stone-950">{title}</h3>
              {selected && (
                <span className="grid h-4 w-4 place-items-center rounded-full bg-stone-950 text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-5 text-stone-500">{description}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-[#87512E]">GH₵{price.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-400">Max 3 total</p>
          <QuantityControl
            value={quantity}
            canDecrease={quantity > 0 && !(totalQty === 1 && quantity === 1)}
            canIncrease={totalQty < 3}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const BREAD_PRICE = 100;
  const SLICED_PRICE = 110;
  const totalQty = qtyWhole + qtySliced;
  const totalAmount = qtyWhole * BREAD_PRICE + qtySliced * SLICED_PRICE;
  const selectedSlotObj = slots.find((slot) => format(slot.date, 'yyyy-MM-dd') === selectedSlot);

  useEffect(() => {
    if (selectedSlot) {
      const slotObj = slots.find((slot) => format(slot.date, 'yyyy-MM-dd') === selectedSlot);
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
        .eq('payment_status', 'success')
        .returns<BreadOrderRow[]>();

      if (error) throw error;

      const orderCounts = (orders || []).reduce<Record<string, number>>((acc, order) => {
        const qty = (order.quantity_whole || 0) + (order.quantity_sliced || 0);
        const finalQty = qty > 0 ? qty : 1;
        acc[order.delivery_date] = (acc[order.delivery_date] || 0) + finalQty;
        return acc;
      }, {});

      const candidateWed = isWednesday(today) ? today : nextDay(today, 3);
      const candidateSat = isSaturday(today) ? today : nextDay(today, 6);

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
              remaining: 3 - count,
            };
          }
          current = addWeeks(current, 1);
        }
        return { date: startDate, dayName: '', formattedDate: '', available: false, remaining: 0 };
      };

      const availableSlots = [findAvailableSlot(candidateWed), findAvailableSlot(candidateSat)]
        .filter((slot) => slot.available)
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
  }, []);

  const config = {
    reference: new Date().getTime().toString(),
    email: email || 'order@zozacrumb.com',
    amount: totalAmount * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
    currency: 'GHS',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: PaystackReference) => {
    try {
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
        payment_status: 'success',
      });

      if (error) throw error;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      toast.error('Please fill in all required fields');
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
        <main className="min-h-screen bg-stone-100 px-4 py-8 text-stone-950 sm:px-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex min-h-[calc(100vh-64px)] max-w-2xl flex-col justify-center"
          >
            <div className="rounded-[8px] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-stone-950 text-white">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">Order confirmed</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">Your bread is reserved.</h1>
              <p className="mt-4 leading-7 text-stone-500">
                Thanks, {name}. Your {totalQty === 1 ? 'loaf is' : 'loaves are'} booked for{' '}
                {selectedSlotObj?.formattedDate}. We will call {phone} before dispatch.
              </p>

              <dl className="mt-7 divide-y divide-stone-200 border-y border-stone-200">
                <div className="flex justify-between py-3 text-sm">
                  <dt className="text-stone-500">Delivery day</dt>
                  <dd className="font-semibold text-stone-950">{selectedSlotObj?.dayName}</dd>
                </div>
                <div className="flex justify-between py-3 text-sm">
                  <dt className="text-stone-500">Loaves</dt>
                  <dd className="font-semibold text-stone-950">{totalQty}</dd>
                </div>
                <div className="flex justify-between py-3 text-sm">
                  <dt className="text-stone-500">Paid</dt>
                  <dd className="font-semibold text-stone-950">GH₵{totalAmount.toFixed(2)}</dd>
                </div>
              </dl>

              <Button className="mt-7 h-12 rounded-full bg-stone-950 px-6 text-white hover:bg-stone-800" onClick={resetOrder}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Place another order
              </Button>
            </div>
          </motion.section>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-stone-100 px-4 py-6 text-stone-950 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[8px] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">Zoza Crumb</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">Order bread</h1>
              </div>
              <img src="/assets/bread/bread.png" alt="Sourdough loaf" className="hidden h-24 w-36 object-contain sm:block" />
            </div>

            <div className="space-y-8">
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
                    onDecrease={() => setQtyWhole(Math.max(0, qtyWhole - 1))}
                    onIncrease={() => setQtyWhole(qtyWhole + 1)}
                  />
                  <LoafRow
                    title="Sliced Loaf"
                    description="Ready for toast, sandwiches, and sharing."
                    image="/assets/bread/sliced.png"
                    price={SLICED_PRICE}
                    quantity={qtySliced}
                    totalQty={totalQty}
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
                    We are sold out for the upcoming weeks. Please check back later.
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
                        placeholder="John Doe"
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
                          placeholder="024 123 4567"
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
                          placeholder="john@example.com"
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

          <aside className="h-fit rounded-[8px] bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center">
              <img src="/assets/bread/order.png" alt="" className="h-14 w-14 object-contain bg-transparent" />
              <h2 className="text-base font-semibold">Order summary</h2>
            </div>

            <div className="mt-5 space-y-3 border-y border-stone-200 py-5 text-sm">
              {qtyWhole > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Whole Loaf x{qtyWhole}</span>
                  <span className="font-semibold text-stone-950">GH₵{(qtyWhole * BREAD_PRICE).toFixed(2)}</span>
                </div>
              )}
              {qtySliced > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-stone-500">Sliced Loaf x{qtySliced}</span>
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
