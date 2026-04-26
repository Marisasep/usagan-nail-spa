import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/shared/utils/api";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsPage,
});

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  status: string;
  note: string | null;
  service_name: string;
  technician_id: string | null;
  technician_name: string | null;
}

interface Technician {
  id: string;
  display_name: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "รอยืนยัน", variant: "secondary" as const },
  { value: "confirmed", label: "ยืนยันแล้ว", variant: "default" as const },
  { value: "completed", label: "เสร็จสิ้น", variant: "outline" as const },
  { value: "cancelled", label: "ยกเลิก", variant: "destructive" as const },
];

function BookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => apiFetch<Booking[]>("/api/admin/bookings"),
  });

  const { data: technicians = [] } = useQuery({
    queryKey: ["admin", "technicians"],
    queryFn: () => apiFetch<Technician[]>("/api/admin/technicians"),
  });

  const assignMutation = useMutation({
    mutationFn: ({
      id,
      technicianId,
    }: {
      id: string;
      technicianId: string | null;
    }) =>
      apiFetch(`/api/admin/bookings/${id}/assign`, {
        method: "PUT",
        body: JSON.stringify({ technicianId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch(`/api/admin/bookings/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">จัดการนัดหมาย</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            ยังไม่มีการนัดหมาย
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">วันที่</th>
                    <th className="px-4 py-3 font-medium">เวลา</th>
                    <th className="px-4 py-3 font-medium">ลูกค้า</th>
                    <th className="px-4 py-3 font-medium">เบอร์โทร</th>
                    <th className="px-4 py-3 font-medium">บริการ</th>
                    <th className="px-4 py-3 font-medium min-w-[160px]">
                      ช่าง
                    </th>
                    <th className="px-4 py-3 font-medium min-w-[140px]">
                      สถานะ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    return (
                      <tr key={b.id} className="border-b last:border-0">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {b.booking_date}
                        </td>
                        <td className="px-4 py-3">{b.booking_time}</td>
                        <td className="px-4 py-3">{b.customer_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {b.customer_phone}
                        </td>
                        <td className="px-4 py-3">{b.service_name}</td>
                        <td className="px-4 py-3">
                          <Select
                            value={b.technician_id ?? ""}
                            onValueChange={(v) =>
                              assignMutation.mutate({
                                id: b.id,
                                technicianId: v || null,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="เลือกช่าง">
                                {(value: string | null) => {
                                  if (!value) return "เลือกช่าง";
                                  const t = technicians.find(
                                    (tech) => tech.id === value,
                                  );
                                  return t?.display_name ?? "เลือกช่าง";
                                }}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="p-1">
                              {technicians.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.display_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            value={b.status}
                            onValueChange={(v) =>
                              statusMutation.mutate({
                                id: b.id,
                                status: v as string,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue>
                                {(value: string | null) => {
                                  const s = STATUS_OPTIONS.find(
                                    (opt) => opt.value === value,
                                  );
                                  return s ? (
                                    <Badge
                                      variant={s.variant}
                                      className="text-xs"
                                    >
                                      {s.label}
                                    </Badge>
                                  ) : (
                                    value
                                  );
                                }}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="p-1">
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
