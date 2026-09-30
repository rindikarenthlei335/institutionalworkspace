import { z } from 'zod';

export const NoticeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  body: z.string().min(5, 'Notice body must be at least 5 characters'),
  category: z.string().default('General'),
  attachmentUrl: z.string().optional(),
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  publishAt: z.string().optional(),
  expireAt: z.string().optional()
});

export const FacultySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name is required'),
  designation: z.string().min(2, 'Designation is required'),
  qualification: z.string().optional(),
  subjects: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  displayOrder: z.number().default(0),
  isPublished: z.boolean().default(true),
  contactVisible: z.boolean().default(false)
});

export const FacilitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, 'Facility title is required'),
  description: z.string().min(5, 'Description is required'),
  imageUrl: z.string().optional(),
  displayOrder: z.number().default(0),
  isPublished: z.boolean().default(true)
});

export const ActivitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, 'Title is required'),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  displayOrder: z.number().default(0),
  isPublished: z.boolean().default(true)
});

export const SlideSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, 'Slide title required'),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, 'Slide image required'),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  displayOrder: z.number().default(0),
  isPublished: z.boolean().default(true)
});

export const GalleryAlbumSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, 'Album title required'),
  coverImage: z.string().optional(),
  eventDate: z.string().optional(),
  displayOrder: z.number().default(0),
  isPublished: z.boolean().default(true)
});

export type NoticeInput = z.infer<typeof NoticeSchema>;
export type FacultyInput = z.infer<typeof FacultySchema>;
export type FacilityInput = z.infer<typeof FacilitySchema>;
export type ActivityInput = z.infer<typeof ActivitySchema>;
export type SlideInput = z.infer<typeof SlideSchema>;
export type GalleryAlbumInput = z.infer<typeof GalleryAlbumSchema>;
