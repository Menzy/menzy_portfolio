import { useCallback, useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Loader2, TrendingUp, Package, Users, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { PageTransition } from '@/components/PageTransition';
import { supabase } from '@/lib/supabase';
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
  fulfillment_status?: string;
}

export function BreadAdminPage() {
  const [orders, setOrders] = useState<BreadOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('all');
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

  useEffect(() => {
    if (password) {
      fetchOrders(password);
    }
  }, [fetchOrders, password]);

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
  };

  const updateFulfillmentStatus = async (id: string, newStatus: string) => {
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

      setOrders(orders.map((o) => (o.id === id ? { ...o, fulfillment_status: newStatus } : o)));
      toast.success(`Order marked as ${newStatus}`);
    } catch (err: unknown) {
      console.error('Error updating fulfillment:', err);
      toast.error('Failed to update fulfillment status.');
    }
  };

  // Get unique delivery dates for the filter
  const uniqueDates = Array.from(new Set(orders.map((o) => o.delivery_date))).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (dateFilter === 'all') return true;
    return order.delivery_date === dateFilter;
  });

  // Calculate stats (only for successful payments)
  const successfulOrders = filteredOrders.filter((o) => o.payment_status === 'success');
  const totalRevenue = successfulOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalWhole = successfulOrders.reduce((sum, o) => sum + (o.quantity_whole || 0), 0);
  const totalSliced = successfulOrders.reduce((sum, o) => sum + (o.quantity_sliced || 0), 0);
  const totalLoaves = totalWhole + totalSliced;

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
      <main className="min-h-screen bg-stone-50 px-4 py-8 text-stone-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Zoza Crumb Admin</h1>
              <p className="mt-1 text-sm text-stone-500">Manage your bread pre-orders and deliveries.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleLock}>
                Lock
              </Button>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  {uniqueDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {format(parseISO(date), 'MMM do, yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-stone-500">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-stone-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stone-900">GH₵{totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-stone-500">From successful orders</p>
              </CardContent>
            </Card>
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-stone-500">Loaves Sold</CardTitle>
                <Package className="h-4 w-4 text-stone-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stone-900">{totalLoaves}</div>
                <p className="text-xs text-stone-500">
                  {totalWhole} whole, {totalSliced} sliced
                </p>
              </CardContent>
            </Card>
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-stone-500">Customers</CardTitle>
                <Users className="h-4 w-4 text-stone-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stone-900">{successfulOrders.length}</div>
                <p className="text-xs text-stone-500">Total successful orders</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-stone-200 shadow-sm">
            <CardHeader className="border-b border-stone-100 bg-white pb-4 pt-5">
              <CardTitle className="text-lg font-medium">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-stone-500">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading orders...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-stone-500">
                  <Package className="mb-2 h-8 w-8 text-stone-300" />
                  <p>No orders found for this selection.</p>
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
                            <Select 
                              value={order.fulfillment_status || 'pending'} 
                              onValueChange={(val) => updateFulfillmentStatus(order.id, val)}
                            >
                              <SelectTrigger className="w-[110px] h-8 text-xs ml-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
}
