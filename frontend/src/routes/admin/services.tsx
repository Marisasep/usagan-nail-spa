import { useState, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, Eye, EyeOff, Upload, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { apiFetch } from '@/shared/utils/api';

export const Route = createFileRoute('/admin/services')({
  component: ServicesPage,
});

interface AdminService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string;
  image: string | null;
  is_active: number;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  nail: 'เล็บ',
  eyelash: 'ขนตา',
  spa: 'สปา',
  package: 'แพ็คเกจ',
};

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = (await res.json()) as { url: string };
  return data.url;
}

function ServicesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AdminService | null>(null);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: () => apiFetch<AdminService[]>('/api/admin/services'),
  });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch('/api/admin/services', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...body }: Record<string, unknown> & { id: string }) =>
      apiFetch(`/api/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/services/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiFetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    },
  });

  function openCreate() {
    setEditing(null);
    setImagePreview(null);
    setOpen(true);
  }

  function openEdit(service: AdminService) {
    setEditing(service);
    setImagePreview(service.image);
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setEditing(null);
    setImagePreview(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  function clearImage() {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    let image: string | undefined;
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      image = await uploadImage(file);
    } else if (imagePreview) {
      image = imagePreview;
    }

    const payload = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      price: Number(fd.get('price')),
      duration: Number(fd.get('duration')),
      category: fd.get('category') as string,
      image,
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">จัดการบริการ</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          เพิ่มบริการ
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'แก้ไขบริการ' : 'เพิ่มบริการใหม่'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} id="service-form" className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="name">ชื่อบริการ</Label>
              <Input id="name" name="name" required defaultValue={editing?.name ?? ''} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="description">รายละเอียด</Label>
              <Textarea id="description" name="description" rows={2} defaultValue={editing?.description ?? ''} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">ราคา (บาท)</Label>
              <Input id="price" name="price" type="number" required defaultValue={editing?.price ?? ''} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duration">ระยะเวลา (นาที)</Label>
              <Input id="duration" name="duration" type="number" required defaultValue={editing?.duration ?? ''} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">หมวดหมู่</Label>
              <select
                id="category"
                name="category"
                required
                defaultValue={editing?.category ?? 'nail'}
                className="h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="nail">เล็บ</option>
                <option value="eyelash">ขนตา</option>
                <option value="spa">สปา</option>
                <option value="package">แพ็คเกจ</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>รูปภาพ</Label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <Upload className="h-4 w-4" />
                เลือกรูป
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {imagePreview && (
              <div className="relative sm:col-span-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full rounded-lg border object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              ยกเลิก
            </Button>
            <Button type="submit" form="service-form" disabled={isPending}>
              {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="p-5 text-sm text-muted-foreground">กำลังโหลด...</p>
          ) : services.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">ยังไม่มีบริการ</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-5 py-3 font-medium">รูป</th>
                    <th className="px-5 py-3 font-medium">ชื่อบริการ</th>
                    <th className="px-5 py-3 font-medium">หมวดหมู่</th>
                    <th className="px-5 py-3 font-medium">ราคา</th>
                    <th className="px-5 py-3 font-medium">เวลา</th>
                    <th className="px-5 py-3 font-medium">สถานะ</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="px-5 py-3">
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="h-10 w-10 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-lg">
                            {s.category === 'nail' && '💅'}
                            {s.category === 'eyelash' && '👁️'}
                            {s.category === 'spa' && '🧖‍♀️'}
                            {s.category === 'package' && '✨'}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium">{s.name}</td>
                      <td className="px-5 py-3">
                        <Badge variant="secondary">{categoryLabels[s.category] ?? s.category}</Badge>
                      </td>
                      <td className="px-5 py-3">฿{s.price.toLocaleString()}</td>
                      <td className="px-5 py-3">{s.duration} นาที</td>
                      <td className="px-5 py-3">
                        <Badge variant={s.is_active ? 'default' : 'destructive'}>
                          {s.is_active ? 'เปิด' : 'ปิด'}
                        </Badge>
                      </td>
                      <td className="flex gap-1 px-5 py-3">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toggleMutation.mutate({ id: s.id, isActive: !s.is_active })}
                          title={s.is_active ? 'ปิดบริการ' : 'เปิดบริการ'}
                        >
                          {s.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(s)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            if (confirm('ต้องการลบบริการนี้?')) {
                              deleteMutation.mutate(s.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
