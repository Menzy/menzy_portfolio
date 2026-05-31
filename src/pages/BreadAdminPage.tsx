import { useCallback, useEffect, useRef, useState } from 'react';
import { endOfWeek, format, isWithinInterval, parseISO, startOfWeek, nextWednesday, nextSaturday, startOfDay } from 'date-fns';
import {
  CalendarDays,
  ChefHat,
  ChevronRight,
  CircleCheck,
  Clock,
  Copy,
  Loader2,
  Lock,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

import { PageTransition } from '@/components/PageTransition';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

type FulfillmentStatus = 'pending' | 'baked' | 'out_for_delivery' | 'fulfilled';
type OrderTab = 'this_week' | 'fulfilled';

interface BreadOrder {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_date: string;
  delivery_day: string;
  is_sliced: boolean;
  quantity_whole: number;
  quantity_sliced: number;
  total_amount: number;
  payment_status: string;
  paystack_reference?: string;
  fulfillment_status?: FulfillmentStatus | string;
}

interface AvailabilitySlot {
  delivery_date: string;
  status: 'open' | 'closed';
  capacity: number;
  paid_quantity: number;
  reserved_quantity: number;
  remaining_quantity: number;
}

const FULFILLMENT_STATUSES: Array<{
  value: FulfillmentStatus;
  label: string;
  className: string;
  Icon: LucideIcon;
}> = [
  {
    value: 'pending',
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    Icon: Clock,
  },
  {
    value: 'baked',
    label: 'Baked',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    Icon: ChefHat,
  },
  {
    value: 'out_for_delivery',
    label: 'Out for delivery',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    Icon: Truck,
  },
  {
    value: 'fulfilled',
    label: 'Fulfilled',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
    Icon: CircleCheck,
  },
];

const DEFAULT_STATUS = FULFILLMENT_STATUSES[0];

function getFulfillmentStatus(order: BreadOrder): FulfillmentStatus {
  const status = FULFILLMENT_STATUSES.find((item) => item.value === order.fulfillment_status);
  return status?.value || 'pending';
}

function getFulfillmentConfig(status: string | undefined) {
  return FULFILLMENT_STATUSES.find((item) => item.value === status) || DEFAULT_STATUS;
}

function sortOrdersByDeliveryDate(a: BreadOrder, b: BreadOrder) {
  const dateDiff = new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime();

  if (dateDiff !== 0) return dateDiff;

  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

function formatOrderItems(order: BreadOrder) {
  return [
    order.quantity_whole > 0 ? `${order.quantity_whole}x Whole` : null,
    order.quantity_sliced > 0 ? `${order.quantity_sliced}x Sliced` : null,
  ].filter((item): item is string => Boolean(item));
}

function groupOrdersByDeliveryDate(orders: BreadOrder[]) {
  return orders.reduce<Array<{ deliveryDate: string; orders: BreadOrder[] }>>((groups, order) => {
    const currentGroup = groups.find((group) => group.deliveryDate === order.delivery_date);

    if (currentGroup) {
      currentGroup.orders.push(order);
      return groups;
    }

    groups.push({
      deliveryDate: order.delivery_date,
      orders: [order],
    });
    return groups;
  }, []);
}

interface FulfillmentSelectProps {
  status: FulfillmentStatus;
  onChange: (status: FulfillmentStatus) => void;
  className?: string;
}

function FulfillmentSelect({ status, onChange, className }: FulfillmentSelectProps) {
  return (
    <Select value={status} onValueChange={(val) => onChange(val as FulfillmentStatus)}>
      <SelectTrigger aria-label="Update fulfillment status" className={cn('h-9 text-xs', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {FULFILLMENT_STATUSES.map((statusOption) => (
          <SelectItem key={statusOption.value} value={statusOption.value}>
            <span className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', statusOption.className)} />
              {statusOption.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface FulfillmentIconControlsProps {
  status: FulfillmentStatus;
  onChange: (status: FulfillmentStatus) => void;
}

function FulfillmentIconControls({ status, onChange }: FulfillmentIconControlsProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="Update fulfillment status">
      {FULFILLMENT_STATUSES.map((statusOption) => {
        const isActive = statusOption.value === status;
        const Icon = statusOption.Icon;

        return (
          <button
            key={statusOption.value}
            type="button"
            aria-label={`Mark as ${statusOption.label}`}
            title={statusOption.label}
            onClick={() => {
              if (!isActive) {
                onChange(statusOption.value);
              }
            }}
            className={cn(
              'grid h-8 place-items-center rounded-md border text-stone-500 transition',
              'hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400',
              isActive ? cn('border-transparent', statusOption.className) : 'border-stone-200 bg-white'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}

interface OrderDetailDrawerProps {
  order: BreadOrder;
  canUpdateStatus?: boolean;
  onStatusChange: (status: FulfillmentStatus) => void;
}

function OrderDetailDrawer({ order, canUpdateStatus = true, onStatusChange }: OrderDetailDrawerProps) {
  const status = getFulfillmentStatus(order);
  const orderItems = formatOrderItems(order);
  const copyDetail = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}`);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="h-9 gap-1 px-2 text-stone-600">
          Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[88vh] border-[#34332f] bg-[#101010] text-[#f7f7f5]">
        <DrawerHeader className="px-5 pb-3 text-left">
          <DrawerTitle className="pr-8 text-xl text-[#f7f7f5]">{order.customer_name}</DrawerTitle>
          <DrawerDescription className="text-[#9d9994]">
            {format(parseISO(order.delivery_date), 'EEEE, MMM d, yyyy')} delivery
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-5 pb-6">
          {canUpdateStatus && (
            <div className="mb-4 rounded-md border border-[#34332f] bg-[#151513] p-4">
              <Label className="mb-2 block text-xs uppercase text-[#9d9994]">Fulfillment</Label>
              <FulfillmentSelect
                status={status}
                onChange={onStatusChange}
                className="w-full border-[#34332f] bg-[#101010] text-[#f7f7f5]"
              />
            </div>
          )}

          <dl className="space-y-3">
            <div className="rounded-md border border-[#34332f] bg-[#151513] p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-[#9d9994]">
                <Phone className="h-4 w-4" />
                Phone
              </dt>
              <dd className="mt-2 flex items-center gap-3 text-base font-medium text-[#f7f7f5]">
                <span className="min-w-0 flex-1 break-words">{order.customer_phone}</span>
                <button
                  type="button"
                  onClick={() => copyDetail('Phone', order.customer_phone)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#34332f] bg-[#101010] text-[#f7f7f5] transition hover:border-[#555049] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a5636]"
                  aria-label="Copy phone number"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </dd>
            </div>
            <div className="rounded-md border border-[#34332f] bg-[#151513] p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-[#9d9994]">
                <MapPin className="h-4 w-4" />
                Address
              </dt>
              <dd className="mt-2 flex items-start gap-3 text-base leading-6 text-[#f7f7f5]">
                <span className="min-w-0 flex-1 break-words">{order.customer_address}</span>
                <button
                  type="button"
                  onClick={() => copyDetail('Address', order.customer_address)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#34332f] bg-[#101010] text-[#f7f7f5] transition hover:border-[#555049] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a5636]"
                  aria-label="Copy address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </dd>
            </div>
            <div className="rounded-md border border-[#34332f] bg-[#151513] p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-[#9d9994]">
                <Package className="h-4 w-4" />
                Order
              </dt>
              <dd className="mt-2 space-y-1 text-base font-medium text-[#f7f7f5]">
                {orderItems.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </dd>
            </div>
            <div className="rounded-md border border-[#34332f] bg-[#151513] p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-[#9d9994]">
                <ReceiptText className="h-4 w-4" />
                Payment
              </dt>
              <dd className="mt-2 space-y-2 text-sm text-[#c7c3bd]">
                <div className="flex items-center justify-between gap-4">
                  <span>Amount</span>
                  <span className="font-semibold text-[#f7f7f5]">GH₵{order.total_amount?.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Status</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      order.payment_status === 'success' && 'bg-green-100 text-green-700 hover:bg-green-100',
                      order.payment_status === 'pending' && 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
                      order.payment_status === 'failed' && 'bg-red-100 text-red-700 hover:bg-red-100'
                    )}
                  >
                    {order.payment_status}
                  </Badge>
                </div>
                <div>
                  <span className="block text-[#9d9994]">Reference</span>
                  <span className="mt-1 block break-all font-mono text-xs text-[#c7c3bd]">
                    {order.paystack_reference || '-'}
                  </span>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function BreadAdminPage() {
  const [orders, setOrders] = useState<BreadOrder[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [slicedAvailable, setSlicedAvailable] = useState(false);
  const [updatingSliced, setUpdatingSliced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topLevelTab, setTopLevelTab] = useState<'orders' | 'manage_days'>('orders');
  const [activeTab, setActiveTab] = useState<OrderTab>('this_week');
  const [password, setPassword] = useState(() => sessionStorage.getItem('zoza_admin_password') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const realtimeRefreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUnlocked = password.length > 0;

  const fetchOrders = useCallback(async (adminPassword = password, showLoading = true) => {
    if (!adminPassword) return;
    if (showLoading) setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bread-admin', {
        body: {
          action: 'list',
          password: adminPassword,
        },
      });

      if (error) throw error;

      if (!data?.ok) {
        throw new Error(data?.error || 'Failed to load orders.');
      }

      setOrders(data.orders || []);
    } catch (err: unknown) {
      console.error('Error fetching orders:', err);
      sessionStorage.removeItem('zoza_admin_password');
      setPassword('');
      toast.error('Failed to load orders.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [password]);

  const fetchAvailability = useCallback(async (adminPassword = password) => {
    if (!adminPassword) return;
    try {
      const { data, error } = await supabase.functions.invoke('bread-admin', {
        body: {
          action: 'list_availability',
          password: adminPassword,
        },
      });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || 'Failed to load availability.');

      setAvailability(data.availability || []);
    } catch (err: unknown) {
      console.error('Error fetching availability:', err);
      toast.error('Failed to load availability.');
    }
  }, [password]);

  const fetchProductAvailability = useCallback(async (adminPassword = password) => {
    if (!adminPassword) return;

    try {
      const { data, error } = await supabase.functions.invoke('bread-admin', {
        body: {
          action: 'list_product_availability',
          password: adminPassword,
        },
      });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || 'Failed to load loaf options.');

      const sliced = data.product_availability?.find((item: { product_key: string }) => item.product_key === 'sliced');
      setSlicedAvailable(Boolean(sliced?.available));
    } catch (err: unknown) {
      console.error('Error fetching loaf options:', err);
      toast.error('Failed to load loaf options.');
    }
  }, [password]);

  const refreshAdminData = useCallback(async (adminPassword = password, showLoading = false) => {
    if (!adminPassword) return;

    await Promise.all([
      fetchOrders(adminPassword, showLoading),
      fetchAvailability(adminPassword),
      fetchProductAvailability(adminPassword),
    ]);
  }, [fetchAvailability, fetchOrders, fetchProductAvailability, password]);

  useEffect(() => {
    if (password) {
      refreshAdminData(password, true);
    }
  }, [password, refreshAdminData]);

  useEffect(() => {
    if (!password) return;

    const channel = supabase
      .channel('bread-admin-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bread_admin_events' },
        () => {
          if (realtimeRefreshTimeout.current) {
            clearTimeout(realtimeRefreshTimeout.current);
          }

          realtimeRefreshTimeout.current = setTimeout(() => {
            refreshAdminData(password, false);
            realtimeRefreshTimeout.current = null;
          }, 350);
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Bread admin realtime subscription failed.');
        }
      });
    const interval = window.setInterval(() => {
      refreshAdminData(password, false);
    }, 60000);

    return () => {
      if (realtimeRefreshTimeout.current) {
        clearTimeout(realtimeRefreshTimeout.current);
        realtimeRefreshTimeout.current = null;
      }
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [password, refreshAdminData]);


  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPassword = passwordInput.trim();

    if (!trimmedPassword) {
      toast.error('Enter the admin password.');
      return;
    }

    sessionStorage.setItem('zoza_admin_password', trimmedPassword);
    setPassword(trimmedPassword);
    setPasswordInput('');
  };

  const handleLock = () => {
    sessionStorage.removeItem('zoza_admin_password');
    setPassword('');
    setOrders([]);
    setAvailability([]);
    setSlicedAvailable(false);
  };

  const updateFulfillmentStatus = async (id: string, newStatus: FulfillmentStatus) => {
    try {
      const { data, error } = await supabase.functions.invoke('bread-admin', {
        body: {
          action: 'update_fulfillment',
          password,
          order_id: id,
          fulfillment_status: newStatus,
        },
      });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || 'Failed to update fulfillment status.');

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === id ? { ...order, fulfillment_status: newStatus } : order))
      );
      toast.success(`Order marked as ${getFulfillmentConfig(newStatus).label}`);
    } catch (err: unknown) {
      console.error('Error updating fulfillment:', err);
      toast.error('Failed to update fulfillment status.');
    }
  };

  const updateAvailability = async (date: string, status: 'open' | 'closed', capacity: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('bread-admin', {
        body: {
          action: 'update_availability',
          password,
          delivery_date: date,
          status,
          capacity,
        },
      });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || 'Failed to update availability.');

      setAvailability((current) => {
        const existing = current.find((a) => a.delivery_date === date);
        if (existing) {
          return current.map((a) => (a.delivery_date === date ? { ...a, status, capacity } : a));
        }
        return [...current, { delivery_date: date, status, capacity, paid_quantity: 0, reserved_quantity: 0, remaining_quantity: capacity }].sort(
          (a, b) => new Date(b.delivery_date).getTime() - new Date(a.delivery_date).getTime()
        );
      });
      toast.success(`Availability for ${date} updated to ${status}`);
    } catch (err: unknown) {
      console.error('Error updating availability:', err);
      toast.error('Failed to update availability.');
    }
  };

  const updateSlicedAvailability = async (available: boolean) => {
    setUpdatingSliced(true);
    try {
      const { data, error } = await supabase.functions.invoke('bread-admin', {
        body: {
          action: 'update_product_availability',
          password,
          product_key: 'sliced',
          available,
        },
      });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || 'Failed to update sliced loaf.');

      setSlicedAvailable(available);
      toast.success(`Sliced loaf ${available ? 'enabled' : 'paused'}`);
    } catch (err: unknown) {
      console.error('Error updating sliced loaf:', err);
      toast.error('Failed to update sliced loaf.');
    } finally {
      setUpdatingSliced(false);
    }
  };

  const today = new Date();
  const adminWeekOptions = { weekStartsOn: 0 as const };
  const currentWeek = {
    start: startOfWeek(today, adminWeekOptions),
    end: endOfWeek(today, adminWeekOptions),
  };

  const paidOrders = orders.filter((order) => order.payment_status === 'success');
  const paymentIssueOrders = orders.filter((order) => order.payment_status === 'payment_conflict');
  const activeOrders = paidOrders.filter((order) => getFulfillmentStatus(order) !== 'fulfilled');
  const thisWeekOrders = activeOrders
    .filter((order) => isWithinInterval(parseISO(order.delivery_date), currentWeek))
    .sort(sortOrdersByDeliveryDate);
  const fulfilledOrders = paidOrders
    .filter((order) => getFulfillmentStatus(order) === 'fulfilled')
    .sort((a, b) => sortOrdersByDeliveryDate(b, a));

  const tabOrders: Record<OrderTab, BreadOrder[]> = {
    this_week: thisWeekOrders,
    fulfilled: fulfilledOrders,
  };

  const filteredOrders = topLevelTab === 'manage_days' ? [] : tabOrders[activeTab];
  const groupedFilteredOrders = groupOrdersByDeliveryDate(filteredOrders);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalWhole = paidOrders.reduce((sum, o) => sum + (o.quantity_whole || 0), 0);
  const totalSliced = paidOrders.reduce((sum, o) => sum + (o.quantity_sliced || 0), 0);
  const totalLoaves = totalWhole + totalSliced;
  const totalCustomers = new Set(
    paidOrders.map((order) => order.customer_phone?.trim() || order.customer_name.trim())
  ).size;
  const bookingWeekRevenue = paidOrders
    .filter((order) => isWithinInterval(parseISO(order.delivery_date), currentWeek))
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const weekRangeLabel = `${format(currentWeek.start, 'MMM d')} - ${format(currentWeek.end, 'MMM d')}`;

  if (!isUnlocked) {
    return (
      <PageTransition>
        <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8 text-stone-950">
          <Card className="w-full max-w-md border-stone-200 shadow-sm">
            <CardHeader className="space-y-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-stone-950 text-white">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold tracking-tight">Zoza Crumb</CardTitle>
                <p className="mt-1 text-sm text-stone-500">Enter the admin password to view bread orders.</p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    placeholder="Enter password"
                    className="h-11 bg-white"
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="h-11 w-full bg-[#AB6D40] text-white hover:bg-[#965E38]">
                  Unlock Admin
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="zoza-bread-dark min-h-screen bg-stone-50 text-stone-950">

        {/* ── Desktop left sidebar ────────────────────────────────── */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-20 w-[180px] flex-col border-r border-stone-200 bg-white">
          <div className="px-5 pt-7 pb-5 border-b border-stone-100">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Zoza Crumb</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-0.5">
            <button
              onClick={() => setTopLevelTab('orders')}
              className={cn(
                'w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                topLevelTab === 'orders'
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              )}
            >
              <Package className="h-4 w-4 shrink-0" />
              Orders
              {activeOrders.length > 0 && (
                <span className={cn(
                  'ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
                  topLevelTab === 'orders' ? 'bg-stone-200 text-stone-700' : 'bg-stone-100 text-stone-500'
                )}>{activeOrders.length}</span>
              )}
            </button>
            <button
              onClick={() => setTopLevelTab('manage_days')}
              className={cn(
                'w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                topLevelTab === 'manage_days'
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              )}
            >
              <CalendarDays className="h-4 w-4 shrink-0" />
              Manage Days
            </button>
          </nav>
          <div className="px-3 py-4 border-t border-stone-100">
            <Button variant="outline" size="sm" onClick={handleLock} className="w-full bg-white">
              Lock
            </Button>
          </div>
        </aside>

        {/* ── Main content (offset on desktop) ───────────────────── */}
        <main className="lg:ml-[180px] px-4 py-5 pb-28 text-stone-950 sm:px-6 sm:py-8 sm:pb-32 lg:pb-10 lg:px-8">
          <div className="mx-auto max-w-5xl">
          {/* Mobile header (desktop shows sidebar label instead) */}
          <div className="mb-5 flex items-start justify-between gap-4 sm:mb-8 sm:items-center lg:hidden">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">Zoza Crumb</h1>
            </div>
            <div className="shrink-0">
              <Button variant="outline" size="sm" onClick={handleLock} className="bg-white sm:h-10 sm:px-4">
                Lock
              </Button>
            </div>
          </div>
          {/* Desktop header */}
          <div className="mb-5 hidden sm:mb-8 lg:block">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">Zoza Crumb</h1>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-2 lg:mb-8 lg:grid-cols-4 lg:gap-3">
            <Card className="border-stone-200 shadow-sm lg:col-span-2">
              <CardContent className="p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase text-stone-500 sm:text-sm">This Week</p>
                    <div className="mt-2 text-xl font-bold leading-none text-stone-900 sm:text-2xl">
                      GH₵{bookingWeekRevenue.toFixed(2)}
                    </div>
                  </div>
                  <div className="min-w-0 border-l border-stone-200 pl-3 text-right sm:pl-4">
                    <p className="text-xs font-medium uppercase text-stone-500 sm:text-sm">Total Revenue</p>
                    <p className="mt-2 text-xl font-bold leading-none text-stone-900 sm:text-2xl">GH₵{totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-stone-200 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-medium uppercase text-stone-500 sm:text-sm">Total Loaves Ordered</p>
                  <p className="text-xl font-bold leading-none text-stone-900 sm:text-2xl">{totalLoaves}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-stone-200 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-medium uppercase text-stone-500 sm:text-sm">Unique Customers</p>
                  <p className="text-xl font-bold leading-none text-stone-900 sm:text-2xl">{totalCustomers}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {paymentIssueOrders.length > 0 && (
            <Card className="mb-6 border-red-900/40 bg-red-950/20 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-red-100">Payment needs attention</h2>
                    <p className="mt-1 text-sm leading-5 text-red-200/70">
                      A payment came in after its reserved slot expired and capacity was already filled.
                    </p>
                  </div>
                  <Badge variant="secondary" className="w-fit bg-red-100 text-red-800 hover:bg-red-100">
                    {paymentIssueOrders.length} {paymentIssueOrders.length === 1 ? 'order' : 'orders'}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-2">
                  {paymentIssueOrders.map((order) => (
                    <div
                      key={order.id}
                      className="grid gap-1 rounded-md border border-red-900/40 bg-black/20 p-3 text-sm sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <p className="font-medium text-red-50">{order.customer_name}</p>
                        <p className="mt-1 text-red-100/60">
                          {order.customer_phone} · {format(parseISO(order.delivery_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="font-mono text-xs text-red-100/60">{order.paystack_reference || '-'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">

            {topLevelTab === 'orders' && (
              <section className="space-y-4">
                {/* ── Pill chip filters ───────────────────────────── */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {(
                    [
                      { tab: 'this_week' as OrderTab, label: 'This Week', count: thisWeekOrders.length },
                      { tab: 'fulfilled' as OrderTab, label: 'Fulfilled', count: fulfilledOrders.length },
                    ]
                  ).map(({ tab, label, count }) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400',
                          isActive
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                        )}
                      >
                        {label}
                        <span
                          className={cn(
                            'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-semibold',
                            isActive ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-500'
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="flex items-center gap-1.5 text-sm text-stone-500">
                  <CalendarDays className="h-4 w-4" />
                  This week: {weekRangeLabel}
                </p>
                
                <div className="lg:hidden">
              {loading ? (
                <div className="flex items-center justify-center rounded-md border border-stone-200 bg-white py-12 text-stone-500">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading orders...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-stone-200 bg-white px-4 py-12 text-center text-stone-500">
                  <Package className="mb-2 h-8 w-8 text-stone-300" />
                  <p>No orders found for this tab.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {groupedFilteredOrders.map((group) => {
                    const firstOrder = group.orders[0];

                    return (
                      <section key={group.deliveryDate} className="space-y-3">
                        <div className="flex items-end justify-between gap-3 px-1">
                          <div className="flex min-w-0 items-baseline gap-2">
                            <h3 className="shrink-0 text-base font-semibold text-stone-950">
                              {format(parseISO(group.deliveryDate), 'MMM d')}
                            </h3>
                            <p className="truncate text-sm text-stone-500">{firstOrder.delivery_day}</p>
                          </div>
                          <Badge variant="secondary" className="bg-white text-stone-600 hover:bg-white">
                            {group.orders.length} {group.orders.length === 1 ? 'order' : 'orders'}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          {group.orders.map((order) => {
                            const status = getFulfillmentStatus(order);
                            const orderItems = formatOrderItems(order);

                            if (activeTab === 'fulfilled') {
                              return (
                                <div
                                  key={order.id}
                                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-stone-200 bg-white px-4 py-3 shadow-sm"
                                >
                                  <div className="min-w-0">
                                    <h4 className="truncate text-base font-semibold text-stone-950">
                                      {order.customer_name}
                                    </h4>
                                    <p className="mt-0.5 truncate text-sm text-stone-500">{orderItems.join(', ')}</p>
                                  </div>
                                  <OrderDetailDrawer
                                    order={order}
                                    onStatusChange={(newStatus) => updateFulfillmentStatus(order.id, newStatus)}
                                  />
                                </div>
                              );
                            }

                            return (
                              <div
                                key={order.id}
                                className="rounded-md border border-stone-200 bg-white px-4 py-3 shadow-sm"
                              >
                                <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                                  <div className="min-w-0">
                                    <h4 className="truncate text-base font-semibold text-stone-950">
                                      {order.customer_name}
                                    </h4>
                                    <p className="mt-2 text-sm font-medium text-stone-950">{orderItems.join(', ')}</p>
                                  </div>
                                  <div className="text-right text-sm font-semibold text-stone-950">
                                    GH₵{order.total_amount?.toFixed(2)}
                                  </div>
                                </div>

                                <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
                                  {activeTab === 'this_week' ? (
                                    <FulfillmentIconControls
                                      status={status}
                                      onChange={(newStatus) => updateFulfillmentStatus(order.id, newStatus)}
                                    />
                                  ) : (
                                    <div />
                                  )}
                                  <OrderDetailDrawer
                                    order={order}
                                    canUpdateStatus={activeTab === 'this_week'}
                                    onStatusChange={(newStatus) => updateFulfillmentStatus(order.id, newStatus)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>

            <Card className="hidden border-stone-200 shadow-sm lg:block">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-stone-500">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading orders...
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-stone-500">
                    <Package className="mb-2 h-8 w-8 text-stone-300" />
                    <p>No orders found for this tab.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-stone-50">
                        <TableRow>
                          <TableHead className="font-semibold text-stone-600">Delivery Date</TableHead>
                          <TableHead className="font-semibold text-stone-600">Customer</TableHead>
                          <TableHead className="font-semibold text-stone-600">Address</TableHead>
                          <TableHead className="font-semibold text-stone-600">Order</TableHead>
                          <TableHead className="font-semibold text-stone-600">Amount</TableHead>
                          <TableHead className="font-semibold text-stone-600">Reference</TableHead>
                          <TableHead className="font-semibold text-stone-600 text-right">Payment</TableHead>
                          <TableHead className="font-semibold text-stone-600 text-right">Fulfillment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-stone-50/50">
                          <TableCell className="align-top">
                            <div className="font-medium text-stone-900">
                              {format(parseISO(order.delivery_date), 'MMM d, yyyy')}
                            </div>
                            <div className="text-xs text-stone-500">{order.delivery_day}</div>
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="font-medium text-stone-900">{order.customer_name}</div>
                            <div className="text-xs text-stone-500">{order.customer_phone}</div>
                          </TableCell>
                          <TableCell className="align-top max-w-[200px]">
                            <p className="truncate text-sm text-stone-700" title={order.customer_address}>
                              {order.customer_address}
                            </p>
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="flex flex-col gap-1 text-sm text-stone-700">
                              {order.quantity_whole > 0 && <span>{order.quantity_whole}x Whole</span>}
                              {order.quantity_sliced > 0 && <span>{order.quantity_sliced}x Sliced</span>}
                            </div>
                          </TableCell>
                          <TableCell className="align-top font-medium text-stone-900">
                            GH₵{order.total_amount?.toFixed(2)}
                          </TableCell>
                          <TableCell className="align-top font-mono text-xs text-stone-500">
                            {order.paystack_reference || '-'}
                          </TableCell>
                          <TableCell className="align-top text-right">
                            <Badge
                              variant="secondary"
                              className={`
                                ${order.payment_status === 'success' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                                ${order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' : ''}
                                ${order.payment_status === 'failed' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                              `}
                            >
                              {order.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="align-top text-right">
                            {(() => {
                              const currentStatus = getFulfillmentStatus(order);

                              return (
                                <FulfillmentSelect
                                  status={currentStatus}
                                  onChange={(newStatus) => updateFulfillmentStatus(order.id, newStatus)}
                                  className="ml-auto w-[150px]"
                                />
                              );
                            })()}
                          </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
              </section>
            )}

            {topLevelTab === 'manage_days' && (
              <div className="space-y-5">
                <div className="rounded-lg border border-stone-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900">Sliced Loaf</h3>
                    </div>
                    <button
                      type="button"
                      disabled={updatingSliced}
                      onClick={() => updateSlicedAvailability(!slicedAvailable)}
                      className={cn(
                        'inline-flex h-8 w-[68px] shrink-0 items-center rounded-full border p-1 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:cursor-not-allowed disabled:opacity-60',
                        slicedAvailable
                          ? 'justify-end border-[#AB6D40] bg-[#AB6D40] text-white'
                          : 'justify-start border-stone-500 bg-stone-800 text-stone-100'
                      )}
                      aria-pressed={slicedAvailable}
                      aria-label="Toggle sliced loaf availability"
                    >
                      <span className="grid h-6 min-w-[30px] place-items-center rounded-full bg-white px-2 text-stone-950 shadow-sm">
                        {slicedAvailable ? 'On' : 'Off'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-w-0 flex-1 bg-white px-2 text-xs sm:text-sm"
                    onClick={() => {
                      const date = format(nextWednesday(today), 'yyyy-MM-dd');
                      const slot = availability.find(a => a.delivery_date === date);
                      if (!slot || slot.status !== 'open') {
                        updateAvailability(date, 'open', slot ? slot.capacity : 4);
                      }
                    }}
                  >
                    Open Next Wednesday
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-w-0 flex-1 bg-white px-2 text-xs sm:text-sm"
                    onClick={() => {
                      const date = format(nextSaturday(today), 'yyyy-MM-dd');
                      const slot = availability.find(a => a.delivery_date === date);
                      if (!slot || slot.status !== 'open') {
                        updateAvailability(date, 'open', slot ? slot.capacity : 4);
                      }
                    }}
                  >
                    Open Next Saturday
                  </Button>
                </div>

                {/* ── Day cards grid ─────────────────────────────── */}
                {availability.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-16 text-center text-stone-500">
                    <CalendarDays className="mb-2 h-8 w-8 text-stone-300" />
                    <p>No delivery days configured yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {availability.map((slot) => {
                      const isPast = new Date(slot.delivery_date) < startOfDay(today);
                      const reservedQuantity = slot.reserved_quantity || 0;
                      const heldQuantity = slot.paid_quantity + reservedQuantity;
                      const isFull = heldQuantity >= slot.capacity && slot.capacity > 0;
                      const paidPct = slot.capacity > 0
                        ? Math.min(100, Math.round((slot.paid_quantity / slot.capacity) * 100))
                        : 0;
                      const reservedPct = slot.capacity > 0
                        ? Math.min(100 - paidPct, Math.round((reservedQuantity / slot.capacity) * 100))
                        : 0;

                      if (isPast) {
                        return (
                          <div
                            key={slot.delivery_date}
                            className="rounded-lg border border-stone-200 bg-white p-4 text-stone-500 shadow-sm opacity-60"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs text-stone-400">
                                  {format(parseISO(slot.delivery_date), 'EEEE')}
                                </p>
                                <p className="mt-1 text-base font-semibold text-stone-900">
                                  {format(parseISO(slot.delivery_date), 'MMM d, yyyy')}
                                </p>
                              </div>
                              <Badge variant="secondary" className="shrink-0 bg-stone-100 text-stone-400 hover:bg-stone-100">
                                Past
                              </Badge>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-stone-200 pt-3 text-sm">
                              <div>
                                <span className="block text-xs text-stone-400">Paid</span>
                                <span className="font-medium tabular-nums text-stone-600">{slot.paid_quantity}</span>
                              </div>
                              <div>
                                <span className="block text-xs text-stone-400">Reserved</span>
                                <span className="font-medium tabular-nums text-stone-600">{reservedQuantity}</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-xs text-stone-400">Capacity</span>
                                <span className="font-medium tabular-nums text-stone-600">{slot.capacity}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={slot.delivery_date}
                          className="rounded-lg border bg-white p-4 shadow-sm"
                        >
                          {/* Date + status toggle */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs text-stone-400">
                                {format(parseISO(slot.delivery_date), 'EEEE')}
                              </p>
                              <p className="text-base font-semibold text-stone-900">
                                {format(parseISO(slot.delivery_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                updateAvailability(
                                  slot.delivery_date,
                                  slot.status === 'open' ? 'closed' : 'open',
                                  slot.capacity
                                )
                              }
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400',
                                slot.status === 'open'
                                  ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                              )}
                            >
                              <span
                                className={cn(
                                  'h-1.5 w-1.5 rounded-full',
                                  slot.status === 'open' ? 'bg-green-500' : 'bg-stone-400'
                                )}
                              />
                              {slot.status === 'open' ? 'Open' : 'Closed'}
                            </button>
                          </div>

                          {/* Capacity progress */}
                          <div className="mt-4">
                            <div className="mb-1.5 flex items-center justify-between">
                              <span className="text-xs text-stone-400">Held</span>
                              <span className="text-xs font-medium text-stone-600">
                                {heldQuantity} / {slot.capacity}
                              </span>
                            </div>
                            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all',
                                  isFull ? 'bg-red-400' : 'bg-[#AB6D40]'
                                )}
                                style={{ width: `${paidPct}%` }}
                              />
                              <div
                                className="h-full bg-amber-500 transition-all"
                                style={{ width: `${reservedPct}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm">
                            <div>
                              <span className="block text-[11px] uppercase text-stone-400">Paid</span>
                              <span className="font-semibold tabular-nums text-stone-900">{slot.paid_quantity}</span>
                            </div>
                            <div>
                              <span className="block text-[11px] uppercase text-stone-400">Reserved</span>
                              <span className="font-semibold tabular-nums text-stone-900">{reservedQuantity}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[11px] uppercase text-stone-400">Open</span>
                              <span className="font-semibold tabular-nums text-stone-900">{Math.max(slot.capacity - heldQuantity, 0)}</span>
                            </div>
                          </div>

                          {/* Capacity stepper */}
                          <div className="mt-4 flex items-center gap-2">
                            <span className="mr-auto text-sm font-medium text-stone-700">Capacity</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 shrink-0 bg-white text-base"
                              disabled={slot.capacity <= 1}
                              onClick={() =>
                                updateAvailability(
                                  slot.delivery_date,
                                  slot.status,
                                  Math.max(1, slot.capacity - 1)
                                )
                              }
                            >
                              −
                            </Button>
                            <span className="w-7 text-center text-sm font-semibold tabular-nums text-stone-900">
                              {slot.capacity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 shrink-0 bg-white text-base"
                              onClick={() =>
                                updateAvailability(
                                  slot.delivery_date,
                                  slot.status,
                                  slot.capacity + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        </main>

        {/* ── Mobile bottom nav bar ───────────────────────────────── */}
        <nav className="fixed bottom-0 inset-x-0 z-20 flex h-16 items-stretch border-t border-stone-200 bg-white lg:hidden">
          <button
            onClick={() => setTopLevelTab('orders')}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
              topLevelTab === 'orders' ? 'text-stone-900' : 'text-stone-400'
            )}
          >
            <div className="relative">
              <Package className="h-5 w-5" />
              {activeOrders.length > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#AB6D40] px-1 text-[10px] font-bold text-white">
                  {activeOrders.length}
                </span>
              )}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium',
                topLevelTab === 'orders' ? 'text-stone-900' : 'text-stone-400'
              )}
            >
              Orders
            </span>
          </button>
          <button
            onClick={() => setTopLevelTab('manage_days')}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
              topLevelTab === 'manage_days' ? 'text-stone-900' : 'text-stone-400'
            )}
          >
            <CalendarDays className="h-5 w-5" />
            <span
              className={cn(
                'text-[10px] font-medium',
                topLevelTab === 'manage_days' ? 'text-stone-900' : 'text-stone-400'
              )}
            >
              Manage Days
            </span>
          </button>
        </nav>

      </div>
    </PageTransition>
  );
}
