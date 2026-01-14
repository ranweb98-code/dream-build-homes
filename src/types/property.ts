export interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  area: string;
  rooms: number;
  baths: number;
  size: number;
  description: string;
  status: 'for_sale' | 'sold';
  images: string[];
  featured: boolean;
}

export interface PropertyFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  preferredContact: 'phone' | 'email' | 'either';
  propertyId?: string;
  propertyTitle?: string;
}
