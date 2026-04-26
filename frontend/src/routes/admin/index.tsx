import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch, getUser } from '@/shared/utils/api';
import type { DashboardStats } from '@/shared/types';

export const Route = createFileRoute('/admin/')({
  component: DashboardPage,
});

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'รอยืนยัน', variant: 'secondary' },
  confirmed: { label: 'ยืนยันแล้ว', variant: 'default' },
  completed: { label: 'เสร็จสิ้น', variant: 'outline' },
  cancelled: { label: 'ยกเลิก', variant: 'destructive' },
};

function DashboardPage() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (user?.role === 'technician') {
      navigate({ to: '/admin/schedule' });
    }
  }, [user?.role, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiFetch<DashboardStats>('/api/admin/stats'),
    enabled: user?.role !== 'technician',
  });

  if (isLoading) {
    return <p className="text-muted-foreground">กำลังโหลด...</p>;
  }

  if (!data) return null;

  const stats = [
    { label: 'จองทั้งหมด', value: data.totalBookings, icon: CalendarDays, color: 'text-blue-600' },
    { label: 'จองวันนี้', value: data.bookingsToday, icon: Clock, color: 'text-green-600' },
    { label: 'รอยืนยัน', value: data.bookingsPending, icon: AlertCircle, color: 'text-orange-600' },
    { label: 'บริการ', value: data.totalServices, icon: TrendingUp, color: 'text-purple-600' },
    { label: 'ผู้ใช้', value: data.totalUsers, icon: Users, color: 'text-pink-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">แดชบอร์ด</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">การจองล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">ยังไม่มีการจอง</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">ลูกค้า</th>
                    <th className="pb-2 font-medium">บริการ</th>
                    <th className="pb-2 font-medium">ช่าง</th>
                    <th className="pb-2 font-medium">วันที่</th>
                    <th className="pb-2 font-medium">เวลา</th>
                    <th className="pb-2 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentBookings.map((b) => {
                    const status = statusMap[b.status] ?? statusMap.pending;
                    return (
                      <tr key={b.id} className="border-b last:border-0">
                        <td className="py-2.5">{b.customer_name}</td>
                        <td className="py-2.5">{b.service_name}</td>
                        <td className="py-2.5 text-muted-foreground">{b.technician_name ?? '-'}</td>
                        <td className="py-2.5">{b.booking_date}</td>
                        <td className="py-2.5">{b.booking_time}</td>
                        <td className="py-2.5">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
