export interface Service {
  id: string;
  name: string;
  description: string;
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

export type UserRole = 'owner' | 'admin' | 'technician';

export interface User {
  id: string;
  username: string;
  display_name: string;
  role: UserRole;
  is_active: number;
  created_at: string;
}

export interface DashboardStats {
  totalBookings: number;
  bookingsToday: number;
  bookingsPending: number;
  totalServices: number;
  totalUsers: number;
  recentBookings: {
    id: string;
    customer_name: string;
    booking_date: string;
    booking_time: string;
    status: BookingStatus;
    service_name: string;
    technician_name: string | null;
  }[];
}

export interface ScheduleBooking {
  id: string;
  customer_name: string;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  service_name: string;
  duration: number;
  technician_id: string | null;
  technician_name: string | null;
}

export interface MyScheduleBooking {
  id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  note: string | null;
  service_name: string;
  duration: number;
}
