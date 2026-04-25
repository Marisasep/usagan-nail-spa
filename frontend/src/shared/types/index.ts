export interface Service {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  image: string;
}

export type ServiceCategory = 'nail' | 'eyelash' | 'spa' | 'package';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  date: string;
  time: string;
  status: BookingStatus;
  note?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: ServiceCategory;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ShopInfo {
  name: string;
  phone: string;
  lineUrl: string;
  mapUrl: string;
  address: string;
  openHours: string;
}
