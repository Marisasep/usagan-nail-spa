import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/shared/utils/api';
import type { User } from '@/shared/types';

export const Route = createFileRoute('/admin/users')({
  component: UsersPage,
});

function UsersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => apiFetch<User[]>('/api/admin/users'),
  });

  const createMutation = useMutation({
    mutationFn: (body: { username: string; password: string; displayName: string; role: string }) =>
      apiFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      username: fd.get('username') as string,
      password: fd.get('password') as string,
      displayName: fd.get('displayName') as string,
      role: fd.get('role') as string,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">จัดการผู้ใช้</h1>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-1.5 h-4 w-4" />
          เพิ่มผู้ใช้
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">เพิ่มผู้ใช้ใหม่</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <Input id="username" name="username" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="displayName">ชื่อแสดง</Label>
                <Input id="displayName" name="displayName" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role">บทบาท</Label>
                <select
                  id="role"
                  name="role"
                  defaultValue="technician"
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="technician">ช่าง</option>
                  <option value="admin">แอดมิน</option>
                  <option value="owner">เจ้าของธุรกิจ</option>
                </select>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  ยกเลิก
                </Button>
              </div>
              {createMutation.isError && (
                <p className="text-sm text-destructive sm:col-span-2">
                  {createMutation.error.message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="p-5 text-sm text-muted-foreground">กำลังโหลด...</p>
          ) : users.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">ยังไม่มีผู้ใช้</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-5 py-3 font-medium">ชื่อแสดง</th>
                    <th className="px-5 py-3 font-medium">ชื่อผู้ใช้</th>
                    <th className="px-5 py-3 font-medium">บทบาท</th>
                    <th className="px-5 py-3 font-medium">สถานะ</th>
                    <th className="px-5 py-3 font-medium">สร้างเมื่อ</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="px-5 py-3">{user.display_name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{user.username}</td>
                      <td className="px-5 py-3">
                        <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                          {user.role === 'owner' ? 'เจ้าของธุรกิจ' : user.role === 'admin' ? 'แอดมิน' : 'ช่าง'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={user.is_active ? 'outline' : 'destructive'}>
                          {user.is_active ? 'ใช้งาน' : 'ปิดใช้งาน'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-5 py-3">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            if (confirm('ต้องการลบผู้ใช้นี้?')) {
                              deleteMutation.mutate(user.id);
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
