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

export const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(8)
});

export const eventSchema = z.object({
  eventName: z.string().min(2),
  logo: z.string().min(1),
  location: z.string().min(2),
  date: z.coerce.date()
});

export const eventGallerySchema = z.object({
  eventId: z.string().uuid(),
  imageUrl: z.string().min(1),
  caption: z.string().optional()
});

export const globalGallerySchema = z.object({
  imageUrl: z.string().min(1),
  caption: z.string().optional()
});

export const partnerSchema = z.object({
  order: z.coerce.number().int().min(0),
  name: z.string().min(2),
  logo: z.string().min(1),
  websiteUrl: z.string().url(),
  description: z.string().optional()
});

export const userSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8),
  role: z.string().default("SuperAdmin")
});
