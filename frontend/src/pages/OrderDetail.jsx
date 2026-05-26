import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Truck, 
  Calendar, 
  FileText,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { useStore } from '../store/useStore';
import CustomTable from '../components/CustomTable';
import StatusBadge from '../components/StatusBadge';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useStore();

  const [statusFilter, setStatusFilter] = useState('all');

  // Gather all orders from all users to show under Order History list
  const allOrders = users.reduce((acc, user) => {
    if (user.orders && user.orders.length > 0) {
      const userOrders = user.orders.map((o) => ({
        ...o,
        userName: user.name,
        userId: user.id
      }));
      return acc.concat(userOrders);
    }
    return acc;
  }, []);

  // Filter orders
  const filteredOrders = allOrders.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Render Order List View (if no order ID provided in URL)
  if (!id) {
    const listCols = [
      { 
        key: 'id', 
        header: 'Order ID',
        render: (row) => <span className="font-semibold text-gray-800">{row.id}</span>
      },
      { 
        key: 'userName', 
        header: 'Patient Name',
        render: (row) => (
          <Link to={`/users/${row.userId}`} className="font-semibold text-emerald-600 hover:text-emerald-700">
            {row.userName}
          </Link>
        )
      },
      { key: 'date', header: 'Order Date' },
      { 
        key: 'items', 
        header: 'Items purchased',
        render: (row) => (
          <span className="truncate max-w-[250px] block" title={row.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}>
            {row.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
          </span>
        )
      },
      { 
        key: 'amount', 
        header: 'Amount',
        render: (row) => <span className="font-semibold text-gray-800">₹{row.amount.toFixed(2)}</span>
      },
      { 
        key: 'status', 
        header: 'Status',
        render: (row) => <StatusBadge status={row.status} />
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <button
            onClick={() => navigate(`/orders/${row.id}`)}
            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
        )
      }
    ];

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 font-sans">Medicine Orders</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Monitor, process, and inspect medicine sales and shipping states.</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm w-full sm:w-auto overflow-x-auto">
          {['all', 'delivered', 'processing', 'shipped', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer whitespace-nowrap ${
                statusFilter === filter 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* History Table */}
        <CustomTable 
          columns={listCols} 
          data={filteredOrders} 
          emptyMessage="No medicine orders found matching the filter selection." 
        />
      </div>
    );
  }

  // Find specific order
  const order = allOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Order Not Found</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">The order reference you requested does not exist.</p>
        <Link to="/orders" className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700">
          <ArrowLeft className="w-4 h-4" /> Back to Medicine Orders
        </Link>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      {/* Main Order Details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Timeline and items purchased */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline container */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 border-b border-gray-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Delivery Progress
            </h3>

            {/* Steps timeline tracker */}
            <div className="grid grid-cols-4 relative text-center">
              {/* Progress Line bar */}
              <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-gray-100 dark:bg-slate-800 z-0">
                <div className={`h-full bg-emerald-500 rounded-full transition-all duration-300 ${
                  order.status === 'Delivered' ? 'w-full' :
                  order.status === 'Shipped' ? 'w-2/3' :
                  order.status === 'Processing' ? 'w-1/3' : 'w-0'
                }`} />
              </div>

              {/* Step 1: Placed */}
              <div className="z-10 flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20 bg-white dark:bg-slate-900" />
                <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 mt-2 block">Order Placed</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{order.date}</span>
              </div>

              {/* Step 2: Processing */}
              <div className="z-10 flex flex-col items-center">
                {order.status !== 'Pending' ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20 bg-white dark:bg-slate-900" />
                ) : (
                  <Clock className="w-8 h-8 text-gray-300 dark:text-slate-600 bg-white dark:bg-slate-900" />
                )}
                <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 mt-2 block">Processing</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{order.status !== 'Pending' ? order.date : 'Pending'}</span>
              </div>

              {/* Step 3: Shipped */}
              <div className="z-10 flex flex-col items-center">
                {order.status === 'Shipped' || order.status === 'Delivered' ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20 bg-white dark:bg-slate-900" />
                ) : (
                  <Clock className="w-8 h-8 text-gray-300 dark:text-slate-600 bg-white dark:bg-slate-900" />
                )}
                <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 mt-2 block">Shipped</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{(order.status === 'Shipped' || order.status === 'Delivered') ? order.date : 'Pending'}</span>
              </div>

              {/* Step 4: Delivered */}
              <div className="z-10 flex flex-col items-center">
                {order.status === 'Delivered' ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20 bg-white dark:bg-slate-900" />
                ) : (
                  <Clock className="w-8 h-8 text-gray-300 dark:text-slate-600 bg-white dark:bg-slate-900" />
                )}
                <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 mt-2 block">Delivered</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{order.status === 'Delivered' ? order.date : 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Items Purchased card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Order Items
              </h3>
              <StatusBadge status={order.status} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">Item Name</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 text-center">Quantity</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 text-right">Price</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-slate-200">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400 text-right">₹{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-slate-200 text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Footer */}
            <div className="bg-gray-50/50 dark:bg-slate-950/40 p-6 space-y-2 text-sm border-t border-gray-100 dark:border-slate-800 flex flex-col items-end">
              <div className="flex justify-between w-64 text-gray-500 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-medium text-gray-700 dark:text-slate-300">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64 text-gray-500 dark:text-slate-400">
                <span>Shipping:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between w-64 text-base font-bold text-gray-800 dark:text-slate-100 border-t border-gray-200 dark:border-slate-800 pt-2 mt-2">
                <span>Total Amount:</span>
                <span>₹{order.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata (Address, Payments, Delivery logs) */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 border-b border-gray-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              Shipping Destination
            </h3>
            <div className="text-sm">
              <span className="font-semibold text-gray-800 dark:text-slate-200 block">Recipient:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">{order.userName}</span>
              <p className="text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                {order.shippingAddress}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 border-b border-gray-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <CreditCard className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              Payment Information
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-500">Method:</span>
                <span className="font-semibold text-gray-700 dark:text-slate-300">{order.paymentInfo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-slate-500">Status:</span>
                <StatusBadge status="Success" />
              </div>
              <div className="flex justify-between border-t border-gray-50 dark:border-slate-800 pt-2">
                <span className="text-gray-400 dark:text-slate-500">Transaction ID:</span>
                <span className="font-mono text-xs font-semibold text-gray-600 dark:text-slate-400">{order.id.replace('ORD', 'TXN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery log */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 border-b border-gray-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              Delivery Log
            </h3>
            <div className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed bg-gray-50 dark:bg-slate-950/40 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
              <p className="font-semibold text-gray-700 dark:text-slate-300">Audit timeline:</p>
              <ul className="mt-2 space-y-1.5 list-disc list-inside">
                <li>Ordered processed: {order.date}</li>
                <li>Packed at warehouse: {order.date}</li>
                <li>Handed to local courier: {order.date}</li>
                <li>{order.deliveryStatus}</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
