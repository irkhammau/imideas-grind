"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeStoredImage, saveImageFromFormData } from "@/lib/upload";

async function assertAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/gallery");
  revalidatePath("/admin");
}

function getRefererPath(fallbackPath: string) {
  const referer = headers().get("referer");
  if (!referer) return fallbackPath;

  try {
    const url = new URL(referer);
    return `${url.pathname}${url.search}`;
  } catch {
    return fallbackPath;
  }
}

function getActionErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

function redirectWithActionToast(type: "success" | "error", message: string, fallbackPath: string): never {
  const refererPath = getRefererPath(fallbackPath);
  const [pathname, query = ""] = refererPath.split("?");
  const params = new URLSearchParams(query);
  params.set("toast", type);
  params.set("toastMessage", message);

  redirect(`${pathname}?${params.toString()}`);
}

async function runMutationWithToast({
  fallbackPath,
  successMessage,
  mutation
}: {
  fallbackPath: string;
  successMessage: string;
  mutation: () => Promise<void>;
}) {
  try {
    await mutation();
  } catch (error) {
    redirectWithActionToast("error", getActionErrorMessage(error), fallbackPath);
  }

  redirectWithActionToast("success", successMessage, fallbackPath);
}

export async function updateSiteSettingsAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/site-settings",
    successMessage: "Pengaturan situs berhasil disimpan.",
    mutation: async () => {
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
  });
}

export async function createServiceAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/services",
    successMessage: "Layanan berhasil ditambahkan.",
    mutation: async () => {
      await prisma.service.create({
        data: {
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? "")
        }
      });

      revalidateAll();
    }
  });
}

export async function updateServiceAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/services",
    successMessage: "Layanan berhasil diperbarui.",
    mutation: async () => {
      await prisma.service.update({
        where: { id: String(formData.get("id")) },
        data: {
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? "")
        }
      });

      revalidateAll();
    }
  });
}

export async function deleteServiceAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/services",
    successMessage: "Layanan berhasil dihapus.",
    mutation: async () => {
      await prisma.service.delete({ where: { id: String(formData.get("id")) } });
      revalidateAll();
    }
  });
}

export async function createEventAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/events",
    successMessage: "Acara berhasil ditambahkan.",
    mutation: async () => {
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
  });
}

export async function updateEventAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/events",
    successMessage: "Acara berhasil diperbarui.",
    mutation: async () => {
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
        await removeStoredImage(existingLogo);
      }

      revalidateAll();
    }
  });
}

export async function deleteEventAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/events",
    successMessage: "Acara berhasil dihapus.",
    mutation: async () => {
      const id = String(formData.get("id"));
      const event = await prisma.event.findUnique({
        where: { id },
        include: { galleries: true }
      });

      if (event) {
        await prisma.event.delete({ where: { id } });
        await removeStoredImage(event.logo);
        await Promise.all(event.galleries.map((gallery) => removeStoredImage(gallery.imageUrl)));
      }

      revalidateAll();
    }
  });
}

export async function createEventGalleryAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/events",
    successMessage: "Galeri acara berhasil ditambahkan.",
    mutation: async () => {
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
  });
}

export async function deleteEventGalleryAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/events",
    successMessage: "Galeri acara berhasil dihapus.",
    mutation: async () => {
      const deleted = await prisma.eventGallery.delete({
        where: { id: String(formData.get("id")) }
      });
      await removeStoredImage(deleted.imageUrl);
      revalidateAll();
    }
  });
}

export async function createGlobalGalleryAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/global-galleries",
    successMessage: "Galeri perusahaan berhasil ditambahkan.",
    mutation: async () => {
      const imageUrl = await saveImageFromFormData(formData, "imageFile", true);

      await prisma.globalGallery.create({
        data: {
          imageUrl: imageUrl ?? "",
          caption: String(formData.get("caption") ?? "") || null
        }
      });

      revalidateAll();
    }
  });
}

export async function updateGlobalGalleryAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/global-galleries",
    successMessage: "Galeri perusahaan berhasil diperbarui.",
    mutation: async () => {
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
        await removeStoredImage(existingImageUrl);
      }

      revalidateAll();
    }
  });
}

export async function deleteGlobalGalleryAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/global-galleries",
    successMessage: "Galeri perusahaan berhasil dihapus.",
    mutation: async () => {
      const deleted = await prisma.globalGallery.delete({
        where: { id: String(formData.get("id")) }
      });
      await removeStoredImage(deleted.imageUrl);
      revalidateAll();
    }
  });
}

export async function createPartnerAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/partners",
    successMessage: "Mitra berhasil ditambahkan.",
    mutation: async () => {
      const logo = await saveImageFromFormData(formData, "logoFile", true);
      const order = Number(formData.get("order") ?? 0);

      await prisma.partner.create({
        data: {
          order: Number.isNaN(order) ? 0 : order,
          name: String(formData.get("name") ?? ""),
          logo: logo ?? "",
          websiteUrl: String(formData.get("websiteUrl") ?? ""),
          description: String(formData.get("description") ?? "") || null
        }
      });

      revalidateAll();
    }
  });
}

export async function updatePartnerAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/partners",
    successMessage: "Mitra berhasil diperbarui.",
    mutation: async () => {
      const existingLogo = String(formData.get("existingLogo") ?? "");
      const uploadedLogo = await saveImageFromFormData(formData, "logoFile");
      const logo = uploadedLogo ?? existingLogo;
      const order = Number(formData.get("order") ?? 0);

      await prisma.partner.update({
        where: { id: String(formData.get("id")) },
        data: {
          order: Number.isNaN(order) ? 0 : order,
          name: String(formData.get("name") ?? ""),
          logo,
          websiteUrl: String(formData.get("websiteUrl") ?? ""),
          description: String(formData.get("description") ?? "") || null
        }
      });

      if (uploadedLogo && existingLogo && uploadedLogo !== existingLogo) {
        await removeStoredImage(existingLogo);
      }

      revalidateAll();
    }
  });
}

export async function deletePartnerAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/partners",
    successMessage: "Mitra berhasil dihapus.",
    mutation: async () => {
      const deleted = await prisma.partner.delete({
        where: { id: String(formData.get("id")) }
      });
      await removeStoredImage(deleted.logo);
      revalidateAll();
    }
  });
}

export async function createUserAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/users",
    successMessage: "Pengguna berhasil ditambahkan.",
    mutation: async () => {
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
  });
}

export async function updateUserAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/users",
    successMessage: "Pengguna berhasil diperbarui.",
    mutation: async () => {
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
  });
}

export async function deleteUserAction(formData: FormData) {
  await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/users",
    successMessage: "Pengguna berhasil dihapus.",
    mutation: async () => {
      await prisma.user.delete({ where: { id: String(formData.get("id")) } });
      revalidatePath("/admin/users");
    }
  });
}

export async function changeMyPasswordAction(formData: FormData) {
  const session = await assertAuth();
  await runMutationWithToast({
    fallbackPath: "/admin/change-password",
    successMessage: "Kata sandi berhasil diperbarui.",
    mutation: async () => {
      const currentPassword = String(formData.get("currentPassword") ?? "");
      const newPassword = String(formData.get("newPassword") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");

      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Semua kolom wajib diisi.");
      }

      if (newPassword.length < 8) {
        throw new Error("Kata sandi baru minimal 8 karakter.");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Konfirmasi kata sandi tidak cocok.");
      }

      if (newPassword === currentPassword) {
        throw new Error("Kata sandi baru harus berbeda dari kata sandi saat ini.");
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });

      if (!user) {
        throw new Error("Pengguna tidak ditemukan.");
      }

      const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidCurrentPassword) {
        throw new Error("Kata sandi saat ini salah.");
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed }
      });

      revalidatePath("/admin/change-password");
    }
  });
}
