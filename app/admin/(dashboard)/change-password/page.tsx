import { changeMyPasswordAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export const dynamic = "force-dynamic";

export default function ChangePasswordPage() {
  return (
    <div className="max-w-xl rounded-2xl border border-grind-line bg-grind-surface p-6">
      <h1 className="font-heading text-2xl">Ganti Kata Sandi Admin</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Masukkan kata sandi saat ini, lalu tentukan kata sandi baru.
      </p>

      <form action={changeMyPasswordAction} className="mt-6 grid gap-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Kata Sandi Saat Ini</label>
          <input name="currentPassword" type="password" required placeholder="••••••••" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Kata Sandi Baru</label>
          <input name="newPassword" type="password" required minLength={8} placeholder="Minimal 8 karakter" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Konfirmasi Kata Sandi Baru</label>
          <input name="confirmPassword" type="password" required minLength={8} placeholder="Ulangi kata sandi baru" />
        </div>
        <SubmitButton>Simpan Kata Sandi Baru</SubmitButton>
      </form>
    </div>
  );
}
