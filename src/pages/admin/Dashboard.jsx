import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import * as api from '../../services/api';
import {
  Badge, Card, Cell, Empty, ErrorNote, Loading, Row, Stat, Table, formatDate, money, statusTone,
} from './ui';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.admin.stats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!stats) return <Loading />;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide font-light">Dashboard</h1>
        <p className="text-[11px] text-[#8A726A] mt-0.5">Everything at a glance.</p>
      </header>

      {stats.maintenanceMode && (
        <div className="flex items-start gap-2.5 bg-[#FBEBDD] border border-[#EFC9A4] rounded-xl px-4 py-3">
          <AlertTriangle size={15} className="text-[#8A4A08] shrink-0 mt-px" />
          <div className="text-[11.5px] text-[#8A4A08]">
            <strong>Maintenance mode is ON.</strong> Shoppers currently see the construction page.{' '}
            <Link to="/admin/settings" className="underline font-semibold">Turn it off</Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Revenue" value={money(stats.revenue)} hint={`${stats.orders} orders`} />
        <Stat label="Average order" value={money(stats.averageOrderValue)} />
        <Stat
          label="Orders to action"
          value={stats.pendingOrders}
          tone={stats.pendingOrders > 0 ? 'warn' : 'good'}
          hint="pending / confirmed / processing"
        />
        <Stat label="Customers" value={stats.customers} hint={`${stats.users} with accounts`} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Live products" value={stats.products} />
        <Stat
          label="Unavailable"
          value={stats.unavailable}
          tone={stats.unavailable > 0 ? 'warn' : 'default'}
          hint="switched off"
        />
        <Stat
          label="Out of stock"
          value={stats.outOfStock}
          tone={stats.outOfStock > 0 ? 'bad' : 'good'}
          hint={`${stats.lowStock} running low`}
        />
        <Stat label="Newsletter" value={stats.subscribers} hint="subscribers" />
      </div>

      {(stats.newEnquiries > 0 || stats.newCustomRequests > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.newEnquiries > 0 && (
            <Link to="/admin/marketing" className="block">
              <Stat label="New enquiries" value={stats.newEnquiries} tone="warn" hint="awaiting a reply →" />
            </Link>
          )}
          {stats.newCustomRequests > 0 && (
            <Link to="/admin/bespoke" className="block">
              <Stat label="New custom orders" value={stats.newCustomRequests} tone="warn" hint="awaiting a quote →" />
            </Link>
          )}
        </div>
      )}

      <Card
        title="Recent orders"
        action={
          <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7B3F42] hover:underline">
            View all
          </Link>
        }
      >
        {stats.recentOrders?.length ? (
          <Table head={['Order', 'Customer', 'Placed', 'Status', 'Total']}>
            {stats.recentOrders.map((order) => (
              <Row key={order._id}>
                <Cell className="font-semibold tracking-wide whitespace-nowrap">{order.orderNumber}</Cell>
                <Cell>{order.shippingAddress?.fullName || '—'}</Cell>
                <Cell className="whitespace-nowrap">{formatDate(order.createdAt)}</Cell>
                <Cell><Badge tone={statusTone(order.status)}>{order.status}</Badge></Cell>
                <Cell className="font-semibold whitespace-nowrap">{money(order.total)}</Cell>
              </Row>
            ))}
          </Table>
        ) : (
          <Empty>No orders yet.</Empty>
        )}
      </Card>

      {stats.statusBreakdown && Object.keys(stats.statusBreakdown).length > 0 && (
        <Card title="Orders by status">
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 bg-[#FAF6F0] border border-[#E3D9CE] rounded-lg px-3 py-2">
                <Badge tone={statusTone(status)}>{status}</Badge>
                <span className="text-sm font-semibold text-[#2E2B2B]">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
