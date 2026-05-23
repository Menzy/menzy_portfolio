import { useCallback, useEffect, useState } from 'react';
import { endOfWeek, format, isAfter, isWithinInterval, parseISO, startOfWeek, nextWednesday, nextSaturday } from 'date-fns';
import {
  CalendarDays,
  ChefHat,
  ChevronRight,
  CircleCheck,
  Clock,
  Loader2,
  Lock,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  TrendingUp,
  Truck,
  Users,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

type FulfillmentStatus = 'pending' | 'baked' | 'out_for_delivery' | 'fulfilled';
type OrderTab = 'this_week' | 'coming_up' | 'fulfilled' | 'manage_days';

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

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="h-9 gap-1 px-2 text-stone-600">
          Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[88vh] border-stone-200 bg-stone-50">
        <DrawerHeader className="px-5 pb-3 text-left">
          <DrawerTitle className="pr-8 text-xl text-stone-950">{order.customer_name}</DrawerTitle>
          <DrawerDescription>
            {format(parseISO(order.delivery_date), 'EEEE, MMM d, yyyy')} delivery
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-5 pb-6">
          {canUpdateStatus && (
            <div className="mb-4 rounded-md border border-stone-200 bg-white p-4">
              <Label className="mb-2 block text-xs uppercase text-stone-500">Fulfillment</Label>
              <FulfillmentSelect status={status} onChange={onStatusChange} className="w-full bg-white" />
            </div>
          )}

          <dl className="space-y-3">
            <div className="rounded-md border border-stone-200 bg-white p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-stone-500">
                <Phone className="h-4 w-4" />
                Phone
              </dt>
              <dd className="mt-2 text-base font-medium text-stone-950">{order.customer_phone}</dd>
            </div>
            <div className="rounded-md border border-stone-200 bg-white p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-stone-500">
                <MapPin className="h-4 w-4" />
                Address
              </dt>
              <dd className="mt-2 text-base leading-6 text-stone-950">{order.customer_address}</dd>
            </div>
            <div className="rounded-md border border-stone-200 bg-white p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-stone-500">
                <Package className="h-4 w-4" />
                Order
              </dt>
              <dd className="mt-2 space-y-1 text-base font-medium text-stone-950">
                {orderItems.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </dd>
            </div>
            <div className="rounded-md border border-stone-200 bg-white p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-stone-500">
                <ReceiptText className="h-4 w-4" />
                Payment
              </dt>
              <dd className="mt-2 space-y-2 text-sm text-stone-700">
                <div className="flex items-center justify-between gap-4">
                  <span>Amount</span>
                  <span className="font-semibold text-stone-950">GH₵{order.total_amount?.toFixed(2)}</span>
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
                  <span className="block text-stone-500">Reference</span>
                  <span className="mt-1 block break-all font-mono text-xs text-stone-700">
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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderTab>('this_week');
  const [password, setPassword] = useState(() => sessionStorage.getItem('zoza_admin_password') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const isUnlocked = password.length > 0;

  const fetchOrders = useCallback(async (adminPassword = password) => {
    if (!adminPassword) return;
    setLoading(true);
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
      setLoading(false);
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

  useEffect(() => {
    if (password) {
      fetchOrders(password);
      fetchAvailability(password);
    }
  }, [fetchOrders, fetchAvailability, password]);

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
        return [...current, { delivery_date: date, status, capacity, paid_quantity: 0 }].sort(
          (a, b) => new Date(b.delivery_date).getTime() - new Date(a.delivery_date).getTime()
        );
      });
      toast.success(`Availability for ${date} updated to ${status}`);
    } catch (err: unknown) {
      console.error('Error updating availability:', err);
      toast.error('Failed to update availability.');
    }
  };

  const today = new Date();
  const currentWeek = {
    start: startOfWeek(today, { weekStartsOn: 1 }),
    end: endOfWeek(today, { weekStartsOn: 1 }),
  };

  const paidOrders = orders.filter((order) => order.payment_status === 'success');
  const activeOrders = paidOrders.filter((order) => getFulfillmentStatus(order) !== 'fulfilled');
  const thisWeekOrders = activeOrders
    .filter((order) => isWithinInterval(parseISO(order.delivery_date), currentWeek))
    .sort(sortOrdersByDeliveryDate);
  const comingUpOrders = activeOrders
    .filter((order) => isAfter(parseISO(order.delivery_date), currentWeek.end))
    .sort(sortOrdersByDeliveryDate);
  const fulfilledOrders = paidOrders
    .filter((order) => getFulfillmentStatus(order) === 'fulfilled')
    .sort((a, b) => sortOrdersByDeliveryDate(b, a));

  const tabOrders: Record<Exclude<OrderTab, 'manage_days'>, BreadOrder[]> = {
    this_week: thisWeekOrders,
    coming_up: comingUpOrders,
    fulfilled: fulfilledOrders,
  };

  const filteredOrders = activeTab === 'manage_days' ? [] : tabOrders[activeTab as Exclude<OrderTab, 'manage_days'>];
  const groupedFilteredOrders = groupOrdersByDeliveryDate(filteredOrders);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalWhole = paidOrders.reduce((sum, o) => sum + (o.quantity_whole || 0), 0);
  const totalSliced = paidOrders.reduce((sum, o) => sum + (o.quantity_sliced || 0), 0);
  const totalLoaves = totalWhole + totalSliced;
  const totalCustomers = new Set(
    paidOrders.map((order) => order.customer_phone?.trim() || order.customer_name.trim())
  ).size;
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
                <CardTitle className="text-2xl font-semibold tracking-tight">Zoza Admin</CardTitle>
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
      <main className="min-h-screen bg-stone-50 px-4 py-5 text-stone-950 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-start justify-between gap-4 sm:mb-8 sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">Zoza Crumb Admin</h1>
              <p className="mt-1 max-w-[220px] text-sm leading-5 text-stone-500 sm:max-w-none">
                Manage bread orders and deliveries.
              </p>
            </div>
            <div className="shrink-0">
              <Button variant="outline" size="sm" onClick={handleLock} className="bg-white sm:h-10 sm:px-4">
                Lock
              </Button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 lg:mb-8 lg:grid-cols-3 lg:gap-4">
            <Card className="col-span-2 border-stone-200 shadow-sm lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase text-stone-500 sm:text-sm sm:normal-case">Revenue</p>
                    <div className="mt-2 text-[28px] font-bold leading-none text-stone-900 sm:text-2xl">
                      GH₵{totalRevenue.toFixed(2)}
                    </div>
                    <p className="mt-2 text-xs text-stone-500">All paid orders</p>
                  </div>
                  <TrendingUp className="mt-1 h-4 w-4 text-stone-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-stone-200 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase text-stone-500 sm:text-sm sm:normal-case">Loaves</p>
                    <div className="mt-2 text-3xl font-bold leading-none text-stone-900 sm:text-2xl">{totalLoaves}</div>
                    <p className="mt-2 text-xs leading-4 text-stone-500">
                      {totalWhole} whole, {totalSliced} sliced
                    </p>
                  </div>
                  <Package className="mt-1 h-4 w-4 text-stone-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-stone-200 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase text-stone-500 sm:text-sm sm:normal-case">Customers</p>
                    <div className="mt-2 text-3xl font-bold leading-none text-stone-900 sm:text-2xl">
                      {totalCustomers}
                    </div>
                    <p className="mt-2 text-xs leading-4 text-stone-500">Unique paid</p>
                  </div>
                  <Users className="mt-1 h-4 w-4 text-stone-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-4">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-950">Order Details</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
                  <CalendarDays className="h-4 w-4" />
                  This week: {weekRangeLabel}
                </p>
              </div>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderTab)}>
                <TabsList className="grid h-auto w-full grid-cols-4 rounded-md bg-stone-100 p-1">
                  <TabsTrigger
                    className="min-w-0 gap-1 rounded-sm px-2 py-2 text-xs sm:gap-2 sm:text-sm"
                    value="this_week"
                  >
                    This Week
                    <Badge variant="secondary" className="px-2 py-0 text-[11px] bg-white text-stone-600 hover:bg-white">
                      {thisWeekOrders.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    className="min-w-0 gap-1 rounded-sm px-2 py-2 text-xs sm:gap-2 sm:text-sm"
                    value="coming_up"
                  >
                    Coming Up
                    <Badge variant="secondary" className="px-2 py-0 text-[11px] bg-white text-stone-600 hover:bg-white">
                      {comingUpOrders.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    className="min-w-0 gap-1 rounded-sm px-2 py-2 text-xs sm:gap-2 sm:text-sm"
                    value="fulfilled"
                  >
                    Fulfilled
                    <Badge variant="secondary" className="px-2 py-0 text-[11px] bg-white text-stone-600 hover:bg-white">
                      {fulfilledOrders.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    className="min-w-0 gap-1 rounded-sm px-2 py-2 text-xs sm:gap-2 sm:text-sm"
                    value="manage_days"
                  >
                    Manage Days
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

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

            {activeTab === 'manage_days' && (
              <div className="space-y-6">
                <Card className="border-stone-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Manage Delivery Days</CardTitle>
                    <p className="text-sm text-stone-500">
                      Open or close specific dates and set their maximum order capacity.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 space-y-4 rounded-md border border-stone-200 bg-stone-50/50 p-4">
                      <h4 className="text-sm font-medium text-stone-900">Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
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
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Paid Orders</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availability.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="py-8 text-center text-stone-500">
                                No delivery days configured.
                              </TableCell>
                            </TableRow>
                          ) : (
                            availability.map((slot) => {
                              const isPast = new Date(slot.delivery_date) < startOfWeek(today);
                              
                              return (
                                <TableRow key={slot.delivery_date} className={isPast ? 'opacity-50' : ''}>
                                  <TableCell className="font-medium">
                                    {format(parseISO(slot.delivery_date), 'MMM d, yyyy')}
                                    <div className="text-xs text-stone-500">
                                      {format(parseISO(slot.delivery_date), 'EEEE')}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="secondary"
                                      className={cn(
                                        slot.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'
                                      )}
                                    >
                                      {slot.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => updateAvailability(slot.delivery_date, slot.status, Math.max(1, slot.capacity - 1))}
                                      >
                                        -
                                      </Button>
                                      <span className="w-4 text-center tabular-nums">{slot.capacity}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => updateAvailability(slot.delivery_date, slot.status, slot.capacity + 1)}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {slot.paid_quantity}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateAvailability(slot.delivery_date, slot.status === 'open' ? 'closed' : 'open', slot.capacity)}
                                    >
                                      {slot.status === 'open' ? 'Close slot' : 'Open slot'}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </section>
        </div>
      </main>
    </PageTransition>
  );
}
