import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SHOP_INFO } from "@/shared/utils/constants";
import { useServices } from "@/shared/hooks/useServices";
import { apiFetch } from "@/shared/utils/api";
import { CalendarDays, CheckCircle, Loader2 } from "lucide-react";

interface BookingFormProps {
  preselectedService?: string;
}

const timeSlots = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "20:00",
];

export function BookingForm({ preselectedService }: BookingFormProps) {
  const { data: services = [] } = useServices();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: preselectedService ?? "",
    date: "",
    time: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          serviceId: form.service,
          date: form.date,
          time: form.time,
          note: form.note || undefined,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardContent className="pt-8 pb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="mt-4 text-xl font-bold">จองคิวสำเร็จ!</h3>
          <p className="mt-2 text-muted-foreground">
            เราจะติดต่อกลับเพื่อยืนยันการจองของคุณ
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            หรือติดต่อเราโดยตรงที่{" "}
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="font-semibold text-primary"
            >
              {SHOP_INFO.phone}
            </a>
          </p>
          <Button className="mt-6" onClick={() => setSubmitted(false)}>
            จองคิวเพิ่ม
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          จองคิวออนไลน์
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ-นามสกุล</Label>
            <Input
              id="name"
              placeholder="กรอกชื่อของคุณ"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0xx-xxx-xxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>เลือกบริการ</Label>
            <Select
              value={form.service}
              onValueChange={(v) => setForm({ ...form, service: v ?? "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกบริการที่ต้องการ">
                  {(value: string | null) => {
                    if (!value) return 'เลือกบริการที่ต้องการ';
                    const found = services.find((svc) => svc.id === value);
                    return found ? `${found.name} — ฿${found.price.toLocaleString()}` : 'เลือกบริการที่ต้องการ';
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="p-1">
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — ฿{s.price.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">วันที่</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>เวลา</Label>
              <Select
                value={form.time}
                onValueChange={(v) => setForm({ ...form, time: v ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเวลา" />
                </SelectTrigger>
                <SelectContent className="p-1">
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">หมายเหตุ (ถ้ามี)</Label>
            <Textarea
              id="note"
              placeholder="แจ้งรายละเอียดเพิ่มเติม..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังจอง...
              </>
            ) : (
              'จองคิวเลย'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
