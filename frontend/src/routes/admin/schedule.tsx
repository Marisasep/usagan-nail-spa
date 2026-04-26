import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiFetch } from '@/shared/utils/api';
import type { ScheduleBooking } from '@/shared/types';

export const Route = createFileRoute('/admin/schedule')({
  component: MonthlySchedulePage,
});

interface Technician {
  id: string;
  display_name: string;
}

const DAY_HEADERS = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];

const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 border-amber-300 text-amber-800',
  confirmed: 'bg-green-100 border-green-300 text-green-800',
  completed: 'bg-gray-100 border-gray-300 text-gray-600',
  cancelled: 'bg-red-100 border-red-300 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'รอยืนยัน',
  confirmed: 'ยืนยันแล้ว',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
};

function getMonthCalendarDates(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday = 0, Sunday = 6
  const startDow = (firstDay.getDay() + 6) % 7;

  const cells: (Date | null)[] = [];

  for (let i = 0; i < startDow; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    cells.push(new Date(year, month, d));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function MonthlySchedulePage() {
  const now = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedTech, setSelectedTech] = useState('');

  const viewYear = useMemo(() => {
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return d.getFullYear();
  }, [monthOffset]);

  const viewMonth = useMemo(() => {
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return d.getMonth();
  }, [monthOffset]);

  const calendarCells = useMemo(
    () => getMonthCalendarDates(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const startDate = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const endDate = formatDate(lastDay);
  const today = formatDate(new Date());

  const { data: technicians = [] } = useQuery({
    queryKey: ['admin', 'technicians'],
    queryFn: () => apiFetch<Technician[]>('/api/admin/technicians'),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['admin', 'schedule-month', startDate, endDate],
    queryFn: () =>
      apiFetch<ScheduleBooking[]>(
        `/api/admin/schedule/week?start=${startDate}&end=${endDate}`
      ),
  });

  const filteredBookings = selectedTech
    ? bookings.filter((b) => b.technician_id === selectedTech)
    : bookings;

  const bookingsByDate = useMemo(() => {
    const map: Record<string, ScheduleBooking[]> = {};
    for (const b of filteredBookings) {
      if (!map[b.booking_date]) map[b.booking_date] = [];
      map[b.booking_date].push(b);
    }
    return map;
  }, [filteredBookings]);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    weeks.push(calendarCells.slice(i, i + 7));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">ตารางนัดหมาย</h1>
        <div className="flex items-center gap-3">
          <Select
            value={selectedTech}
            onValueChange={(v) => setSelectedTech(v as string)}
          >
            <SelectTrigger className="h-9 w-48">
              <SelectValue placeholder="ช่างทั้งหมด">
                {(value: string | null) => {
                  if (!value) return 'ช่างทั้งหมด';
                  const t = technicians.find((tech) => tech.id === value);
                  return t?.display_name ?? 'ช่างทั้งหมด';
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {technicians.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonthOffset((v) => v - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => setMonthOffset(0)}>
              เดือนนี้
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonthOffset((v) => v + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Month / Year label */}
      <p className="text-center text-lg font-semibold">
        {MONTH_NAMES[viewMonth]} {viewYear + 543}
      </p>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {DAY_HEADERS.map((d) => (
                <th
                  key={d}
                  className="border border-border bg-muted/50 px-1 py-2 text-center text-xs font-semibold text-muted-foreground"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((date, di) => {
                  if (!date) {
                    return (
                      <td
                        key={`empty-${di}`}
                        className="border border-border bg-muted/20 p-1 align-top"
                        style={{ minWidth: 120, minHeight: 80 }}
                      />
                    );
                  }

                  const dateStr = formatDate(date);
                  const isToday = dateStr === today;
                  const dayBookings = bookingsByDate[dateStr] ?? [];

                  return (
                    <td
                      key={dateStr}
                      className={`border border-border p-1 align-top ${isToday ? 'bg-primary/5' : ''}`}
                      style={{ minWidth: 120, minHeight: 80 }}
                    >
                      <div className="mb-1 flex items-center justify-between px-0.5">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            isToday
                              ? 'bg-primary text-white'
                              : 'text-foreground'
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {dayBookings.length > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {dayBookings.length} คิว
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-0.5">
                        {dayBookings.map((b) => {
                          const colorClass =
                            STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;
                          return (
                            <div
                              key={b.id}
                              className={`flex items-center gap-1 truncate rounded border px-1 py-0.5 text-[10px] leading-none ${colorClass}`}
                              title={`${b.booking_time} ${b.customer_name} — ${b.service_name} (${b.technician_name ?? '-'})`}
                            >
                              <span className="font-semibold">{b.booking_time}</span>
                              <span className="truncate">{b.customer_name}</span>
                              {b.technician_name && (
                                <span className="ml-auto shrink-0 opacity-70">({b.technician_name})</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-3 w-3 rounded border ${STATUS_COLORS[key]}`}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
