import { z } from "zod";

export const siteSettingsSchema = z.object({
  companyName: z.string().min(2),
  tagline: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(10),
  aboutText: z.string().min(30),
  youtubeUrl: z.string().url(),
  instagramUrl: z.string().url()
});

export const staffSchema = z.object({
  name: z.string().min(2),
  position: z.string().min(2),
  image: z.string().url()
});

export const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(8)
});

export const eventSchema = z.object({
  eventName: z.string().min(2),
  logo: z.string().url(),
  location: z.string().min(2),
  date: z.coerce.date()
});

export const eventGallerySchema = z.object({
  eventId: z.string().uuid(),
  imageUrl: z.string().url(),
  caption: z.string().optional()
});

export const globalGallerySchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().optional()
});

export const userSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8),
  role: z.string().default("SuperAdmin")
});
