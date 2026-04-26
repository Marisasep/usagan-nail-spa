import { useQuery } from '@tanstack/react-query';
import type { Service } from '@/shared/types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

interface ApiService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string;
  image: string | null;
}

function mapService(s: ApiService): Service {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? '',
    price: s.price,
    duration: s.duration,
    category: s.category as Service['category'],
    image: s.image ?? '',
  };
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/services`);
      const data = (await res.json()) as ApiService[];
      return data.map(mapService);
    },
  });
}
