export interface Notice {
  id: string;
  tenantId: string;
  title: string;
  body: string;
  category: string;
  attachmentUrl?: string;
  isPinned: boolean;
  isPublished: boolean;
  publishAt: string;
  expireAt?: string;
  createdAt: string;
}

export interface FacultyMember {
  id: string;
  tenantId: string;
  name: string;
  designation: string;
  qualification?: string;
  subjects?: string;
  experience?: string;
  bio?: string;
  photoUrl?: string;
  displayOrder: number;
  isPublished: boolean;
  contactVisible: boolean;
}

export interface Facility {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface Activity {
  id: string;
  tenantId: string;
  title: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface HomeSlide {
  id: string;
  tenantId: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface GalleryAlbum {
  id: string;
  tenantId: string;
  title: string;
  coverImage?: string;
  eventDate?: string;
  displayOrder: number;
  isPublished: boolean;
  images?: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  albumId: string;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}
