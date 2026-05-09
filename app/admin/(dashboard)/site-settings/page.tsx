import { SubmitButton } from "@/components/ui/submit-button";
import { prisma } from "@/lib/prisma";
import { updateSiteSettingsAction } from "@/app/admin/actions";

export default async function SiteSettingsPage() {
  const settings = await prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" } });
  const contact = (settings?.contact as { email?: string; phone?: string; address?: string } | null) ?? {};

  return (
    <div className="rounded-2xl border border-grind-line bg-grind-surface p-6">
      <h1 className="font-heading text-2xl">Site Settings</h1>
      <p className="mt-1 text-sm text-zinc-400">Kelola identitas brand, profil, dan sosial media.</p>

      <form action={updateSiteSettingsAction} className="mt-6 grid gap-4">
        <input type="hidden" name="id" defaultValue={settings?.id ?? ""} />
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Company Name</label>
          <input name="companyName" required defaultValue={settings?.companyName ?? ""} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Tagline</label>
          <input name="tagline" required defaultValue={settings?.tagline ?? ""} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Email</label>
          <input name="email" type="email" required defaultValue={contact.email ?? ""} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Phone</label>
          <input name="phone" required defaultValue={contact.phone ?? ""} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Address</label>
          <textarea name="address" required rows={3} defaultValue={contact.address ?? ""} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">About Text</label>
          <textarea name="aboutText" required rows={6} defaultValue={settings?.aboutText ?? ""} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">YouTube URL</label>
          <input name="youtubeUrl" type="url" required defaultValue={settings?.youtubeUrl ?? ""} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Instagram URL</label>
          <input name="instagramUrl" type="url" required defaultValue={settings?.instagramUrl ?? ""} />
        </div>
        <SubmitButton>Simpan Perubahan</SubmitButton>
      </form>
    </div>
  );
}
