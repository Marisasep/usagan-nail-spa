import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GALLERY_ITEMS } from '@/shared/utils/constants';
import type { GalleryItem, ServiceCategory } from '@/shared/types';

const categories = [
  { key: 'all' as const, label: 'ทั้งหมด' },
  { key: 'nail' as const, label: 'เล็บ' },
  { key: 'eyelash' as const, label: 'ขนตา' },
  { key: 'spa' as const, label: 'สปา' },
];

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={activeCategory === cat.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <div className="flex h-full items-center justify-center text-6xl transition-transform group-hover:scale-110">
              {item.category === 'nail' && '💅'}
              {item.category === 'eyelash' && '👁️'}
              {item.category === 'spa' && '🧖‍♀️'}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-sm font-medium text-white">{item.title}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg">
          {selectedItem && (
            <div className="text-center">
              <div className="mx-auto flex aspect-square max-w-sm items-center justify-center rounded-lg bg-muted text-8xl">
                {selectedItem.category === 'nail' && '💅'}
                {selectedItem.category === 'eyelash' && '👁️'}
                {selectedItem.category === 'spa' && '🧖‍♀️'}
              </div>
              <p className="mt-4 text-lg font-semibold">{selectedItem.title}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
