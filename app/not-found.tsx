import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section-container flex min-h-[70vh] items-center justify-center py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-grind-line bg-grind-surface px-8 py-12 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-grind-cyan">404</p>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl">Halaman Tidak Ditemukan</h1>
        <p className="mt-4 text-zinc-300">
          URL yang Anda buka tidak tersedia atau sudah dipindahkan. Silakan kembali ke beranda untuk melanjutkan.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-grind-red px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
