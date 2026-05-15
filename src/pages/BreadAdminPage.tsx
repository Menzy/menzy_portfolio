import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Loader2, ArrowLeft, Download, TrendingUp, Package, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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
}

export function BreadAdminPage() {
  const [orders, setOrders] = useState<BreadOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bread_orders')
        .select('*')
        .order('delivery_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: unknown) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
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

  return (
    <PageTransition>
      <main className="min-h-screen bg-stone-50 px-4 py-8 text-stone-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                to="/zoza-order"
                className="mb-2 inline-flex items-center text-sm text-stone-500 hover:text-stone-900 transition-colors"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Pre-order
              </Link>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Zoza Crumb Admin</h1>
              <p className="mt-1 text-sm text-stone-500">Manage your bread pre-orders and deliveries.</p>
            </div>
            <div className="flex items-center gap-4">
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
                        <TableHead className="font-semibold text-stone-600 text-right">Status</TableHead>
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
