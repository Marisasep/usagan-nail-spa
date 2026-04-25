import type { ShopInfo, Service, Testimonial, GalleryItem } from '../types';

export const SHOP_INFO: ShopInfo = {
  name: 'Usagan Nail Spa',
  phone: '063-475-8908',
  lineUrl: 'https://lin.ee/dJVljUc',
  mapUrl: 'https://maps.app.goo.gl/Ry9rEZx2dc2U6jw66',
  address: 'Usagan Nail Spa สาขา สุขุมวิท 26',
  openHours: '10:00 - 20:00',
};

export const SERVICES: Service[] = [
  {
    id: 'spa-hand-foot',
    name: 'Premium Hand & Foot Spa',
    nameTh: 'สปามือและเท้าพรีเมียม 8 ขั้นตอน',
    description: 'Intensive 8-step spa treatment for hands and feet',
    descriptionTh: 'ปรนนิบัติมือและเท้า ด้วยสปาเข้มข้น 8 ขั้นตอน',
    price: 799,
    duration: 90,
    category: 'spa',
    image: '/images/spa-hand-foot.jpg',
  },
  {
    id: 'gel-nail',
    name: 'Gel Nail Art',
    nameTh: 'ทำเล็บเจล',
    description: 'Beautiful gel nail art with premium materials',
    descriptionTh: 'ทำเล็บเจลสวยด้วยวัสดุพรีเมียม',
    price: 590,
    duration: 60,
    category: 'nail',
    image: '/images/gel-nail.jpg',
  },
  {
    id: 'nail-extension',
    name: 'Nail Extension',
    nameTh: 'ต่อเล็บ',
    description: 'Professional nail extension service',
    descriptionTh: 'บริการต่อเล็บโดยช่างมืออาชีพ',
    price: 990,
    duration: 120,
    category: 'nail',
    image: '/images/nail-extension.jpg',
  },
  {
    id: 'eyelash-extension',
    name: 'Eyelash Extension',
    nameTh: 'ต่อขนตา',
    description: 'Natural-looking eyelash extensions',
    descriptionTh: 'ต่อขนตาธรรมชาติสวยงาม',
    price: 890,
    duration: 90,
    category: 'eyelash',
    image: '/images/eyelash.jpg',
  },
  {
    id: 'mani-pedi',
    name: 'Manicure & Pedicure',
    nameTh: 'ทำเล็บมือและเท้า',
    description: 'Classic manicure and pedicure combo',
    descriptionTh: 'ทำเล็บมือและเท้าแบบคลาสสิก',
    price: 450,
    duration: 60,
    category: 'nail',
    image: '/images/mani-pedi.jpg',
  },
  {
    id: 'nail-spa-package',
    name: 'Nail + Spa Package',
    nameTh: 'แพ็คเกจเล็บ + สปา',
    description: 'Complete nail art with premium spa treatment',
    descriptionTh: 'แพ็คเกจทำเล็บพร้อมสปาครบวงจร',
    price: 1290,
    duration: 150,
    category: 'package',
    image: '/images/package.jpg',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'คุณแอน',
    rating: 5,
    comment: 'ร้านสวยมาก ช่างฝีมือดี ทำเล็บสวยทุกครั้ง ประทับใจค่ะ',
    date: '2026-03-15',
  },
  {
    id: '2',
    name: 'คุณมิ้นท์',
    rating: 5,
    comment: 'สปามือเท้าฟินมากก เหมือนได้พักผ่อนจริงๆ ราคาคุ้มค่า',
    date: '2026-03-20',
  },
  {
    id: '3',
    name: 'คุณเบล',
    rating: 5,
    comment: 'ต่อขนตาสวยธรรมชาติมากค่ะ ชอบที่ช่างใส่ใจรายละเอียด',
    date: '2026-04-01',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', imageUrl: '/images/gallery/nail-1.jpg', title: 'เล็บเจลลายดอกไม้', category: 'nail' },
  { id: '2', imageUrl: '/images/gallery/nail-2.jpg', title: 'เล็บเจลสีพาสเทล', category: 'nail' },
  { id: '3', imageUrl: '/images/gallery/nail-3.jpg', title: 'ต่อเล็บฝรั่งเศส', category: 'nail' },
  { id: '4', imageUrl: '/images/gallery/eyelash-1.jpg', title: 'ต่อขนตาธรรมชาติ', category: 'eyelash' },
  { id: '5', imageUrl: '/images/gallery/spa-1.jpg', title: 'สปามือเท้าพรีเมียม', category: 'spa' },
  { id: '6', imageUrl: '/images/gallery/nail-4.jpg', title: 'เล็บเจลกลิตเตอร์', category: 'nail' },
];

export const SPA_STEPS = [
  'แช่น้ำอุ่นผสมเกลือสมุนไพร',
  'สครับผิวเนียนนุ่ม',
  'ตัดหนัง',
  'ตัดเล็บ',
  'ขัดส้นเท้า',
  'พอกบำรุงล้ำลึก',
  'นวดคลายเมื่อยผ่อนคลายสุดๆ',
  'ทาออยและโลชั่นบำรุง',
];
