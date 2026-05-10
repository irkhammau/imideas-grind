"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removePublicUpload, saveImageFromFormData } from "@/lib/upload";

async function assertAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/gallery");
  revalidatePath("/admin");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await assertAuth();

  const id = String(formData.get("id") ?? "");

  const companyName = String(formData.get("companyName") ?? "");
  const tagline = String(formData.get("tagline") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const address = String(formData.get("address") ?? "");
  const aboutText = String(formData.get("aboutText") ?? "");
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "");
  const instagramUrl = String(formData.get("instagramUrl") ?? "");

  if (!companyName || !tagline || !email || !phone || !address || !aboutText || !youtubeUrl || !instagramUrl) {
    throw new Error("Semua kolom wajib diisi");
  }

  if (id) {
    await prisma.siteSettings.update({
      where: { id },
      data: {
        companyName,
        tagline,
        contact: { email, phone, address },
        aboutText,
        youtubeUrl,
        instagramUrl
      }
    });
  } else {
    await prisma.siteSettings.create({
      data: {
        companyName,
        tagline,
        contact: { email, phone, address },
        aboutText,
        youtubeUrl,
        instagramUrl
      }
    });
  }

  revalidateAll();
}

export async function createStaffAction(formData: FormData) {
  await assertAuth();
  const image = await saveImageFromFormData(formData, "imageFile", true);
  const order = Number(formData.get("order") ?? 0);

  await prisma.staff.create({
    data: {
      order: Number.isNaN(order) ? 0 : order,
      name: String(formData.get("name") ?? ""),
      position: String(formData.get("position") ?? ""),
      image: image ?? ""
    }
  });

  revalidateAll();
}

export async function updateStaffAction(formData: FormData) {
  await assertAuth();
  const existingImage = String(formData.get("existingImage") ?? "");
  const uploadedImage = await saveImageFromFormData(formData, "imageFile");
  const image = uploadedImage ?? existingImage;
  const order = Number(formData.get("order") ?? 0);

  await prisma.staff.update({
    where: { id: String(formData.get("id")) },
    data: {
      order: Number.isNaN(order) ? 0 : order,
      name: String(formData.get("name") ?? ""),
      position: String(formData.get("position") ?? ""),
      image
    }
  });

  if (uploadedImage && existingImage && uploadedImage !== existingImage) {
    await removePublicUpload(existingImage);
  }

  revalidateAll();
}

export async function deleteStaffAction(formData: FormData) {
  await assertAuth();
  const deleted = await prisma.staff.delete({
    where: { id: String(formData.get("id")) }
  });
  await removePublicUpload(deleted.image);
  revalidateAll();
}

export async function createServiceAction(formData: FormData) {
  await assertAuth();

  await prisma.service.create({
    data: {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "")
    }
  });

  revalidateAll();
}

export async function updateServiceAction(formData: FormData) {
  await assertAuth();

  await prisma.service.update({
    where: { id: String(formData.get("id")) },
    data: {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "")
    }
  });

  revalidateAll();
}

export async function deleteServiceAction(formData: FormData) {
  await assertAuth();
  await prisma.service.delete({ where: { id: String(formData.get("id")) } });
  revalidateAll();
}

export async function createEventAction(formData: FormData) {
  await assertAuth();
  const logo = await saveImageFromFormData(formData, "logoFile", true);

  await prisma.event.create({
    data: {
      eventName: String(formData.get("eventName") ?? ""),
      logo: logo ?? "",
      location: String(formData.get("location") ?? ""),
      date: new Date(String(formData.get("date") ?? new Date().toISOString()))
    }
  });

  revalidateAll();
}

export async function updateEventAction(formData: FormData) {
  await assertAuth();
  const existingLogo = String(formData.get("existingLogo") ?? "");
  const uploadedLogo = await saveImageFromFormData(formData, "logoFile");
  const logo = uploadedLogo ?? existingLogo;

  await prisma.event.update({
    where: { id: String(formData.get("id")) },
    data: {
      eventName: String(formData.get("eventName") ?? ""),
      logo,
      location: String(formData.get("location") ?? ""),
      date: new Date(String(formData.get("date") ?? new Date().toISOString()))
    }
  });

  if (uploadedLogo && existingLogo && uploadedLogo !== existingLogo) {
    await removePublicUpload(existingLogo);
  }

  revalidateAll();
}

export async function deleteEventAction(formData: FormData) {
  await assertAuth();
  const id = String(formData.get("id"));
  const event = await prisma.event.findUnique({
    where: { id },
    include: { galleries: true }
  });

  if (event) {
    await prisma.event.delete({ where: { id } });
    await removePublicUpload(event.logo);
    await Promise.all(event.galleries.map((gallery) => removePublicUpload(gallery.imageUrl)));
  }

  revalidateAll();
}

export async function createEventGalleryAction(formData: FormData) {
  await assertAuth();
  const imageUrl = await saveImageFromFormData(formData, "imageFile", true);

  await prisma.eventGallery.create({
    data: {
      eventId: String(formData.get("eventId") ?? ""),
      imageUrl: imageUrl ?? "",
      caption: String(formData.get("caption") ?? "") || null
    }
  });

  revalidateAll();
}

export async function deleteEventGalleryAction(formData: FormData) {
  await assertAuth();
  const deleted = await prisma.eventGallery.delete({
    where: { id: String(formData.get("id")) }
  });
  await removePublicUpload(deleted.imageUrl);
  revalidateAll();
}

export async function createGlobalGalleryAction(formData: FormData) {
  await assertAuth();
  const imageUrl = await saveImageFromFormData(formData, "imageFile", true);

  await prisma.globalGallery.create({
    data: {
      imageUrl: imageUrl ?? "",
      caption: String(formData.get("caption") ?? "") || null
    }
  });

  revalidateAll();
}

export async function updateGlobalGalleryAction(formData: FormData) {
  await assertAuth();
  const existingImageUrl = String(formData.get("existingImageUrl") ?? "");
  const uploadedImageUrl = await saveImageFromFormData(formData, "imageFile");
  const imageUrl = uploadedImageUrl ?? existingImageUrl;

  await prisma.globalGallery.update({
    where: { id: String(formData.get("id")) },
    data: {
      imageUrl,
      caption: String(formData.get("caption") ?? "") || null
    }
  });

  if (uploadedImageUrl && existingImageUrl && uploadedImageUrl !== existingImageUrl) {
    await removePublicUpload(existingImageUrl);
  }

  revalidateAll();
}

export async function deleteGlobalGalleryAction(formData: FormData) {
  await assertAuth();
  const deleted = await prisma.globalGallery.delete({
    where: { id: String(formData.get("id")) }
  });
  await removePublicUpload(deleted.imageUrl);
  revalidateAll();
}

export async function createUserAction(formData: FormData) {
  await assertAuth();

  const password = String(formData.get("password") ?? "");
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username: String(formData.get("username") ?? ""),
      password: hashed,
      role: String(formData.get("role") ?? "SuperAdmin")
    }
  });

  revalidatePath("/admin/users");
}

export async function updateUserAction(formData: FormData) {
  await assertAuth();

  const id = String(formData.get("id") ?? "");
  const username = String(formData.get("username") ?? "");
  const role = String(formData.get("role") ?? "SuperAdmin");
  const nextPassword = String(formData.get("password") ?? "");

  const data: { username: string; role: string; password?: string } = {
    username,
    role
  };

  if (nextPassword) {
    data.password = await bcrypt.hash(nextPassword, 10);
  }

  await prisma.user.update({
    where: { id },
    data
  });

  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData) {
  await assertAuth();
  await prisma.user.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/users");
}
