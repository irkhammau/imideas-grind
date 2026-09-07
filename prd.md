Berikut adalah **Product Requirements Document (PRD)** komprehensif untuk website perusahaan PT GELORA ENERGI INDONESIA (GRIND) yang dilengkapi dengan sistem *Content Management System* (CMS) penuh. Dokumen ini dirancang dengan arsitektur teknis yang matang agar agen AI Anda dapat langsung mengeksekusinya.

---

# **Product Requirements Document (PRD): Sistem Web Profil & CMS GRIND**

## **1. Ringkasan Proyek**

Membangun *company profile* dinamis untuk PT GELORA ENERGI INDONESIA (GRIND), sebuah perusahaan Event Organizer (EO) dan *Sportainment*. Website ini bersifat *data-driven*, di mana teks, logo, layanan, mitra, dan galeri *event* disimpan di *database* dan dapat diubah melalui *dashboard* Admin (CMS).

## **2. Estetika & Panduan Visual (UI/UX)**

* **Skema Warna (Berdasarkan Logo GRIND):**
* **Primary Background:** *Solid Black* (`#111111` atau `#000000`) untuk memberikan kesan elegan, tegas, dan menonjolkan elemen *sportainment*.
* **Primary Text & Shapes:** *Pure White* (`#FFFFFF`) untuk kontras dan keterbacaan maksimal.
* **Accent Color 1:** *Vibrant Red* (Merah pada logo) untuk tombol *Call to Action* (CTA) utama atau *highlight* teks penting.
* **Accent Color 2:** *Cyan / Light Blue* (Biru muda pada logo) untuk *hover state*, ikon, atau elemen dekoratif sekunder.


* **Animasi:** Menggunakan Framer Motion dengan gaya *subtle* dan profesional. Transisi halaman menggunakan *fade-in*, teks muncul dengan *staggered slide-up*, dan *card event* memiliki efek *hover scale* ringan. Hindari animasi berputar atau memantul yang berlebihan agar identitas korporat tetap terjaga.
* **Panduan Komposisi Gambar:** Modul unggah foto pada CMS harus dilengkapi dengan panduan atau fitur *auto-crop* untuk mengisolasi subjek utama dan melakukan *zoom* secara proporsional. Pada antarmuka publik, pastikan desain *overlay* teks atau elemen dekoratif tidak menutupi subjek utama pada foto *event* maupun galeri.

## **3. Arsitektur & Tech Stack**

* **Frontend (Public & Admin UI):** Next.js (App Router) + Tailwind CSS.
* **Backend API:** Node.js dengan **Express.js** untuk menangani logika bisnis, autentikasi, dan operasi CRUD yang cepat dan terukur.
* **Database:** PostgreSQL atau MySQL.
* **ORM:** Prisma atau Sequelize untuk memudahkan manipulasi skema *database*.
* **Authentication:** JSON Web Token (JWT) dikombinasikan dengan *bcrypt* untuk mengamankan akses panel admin.
* **Storage:** Cloudflare R2 melalui API S3-compatible dengan custom domain/CDN publik untuk menyimpan aset gambar logo dan galeri.
* **Deployment:** Infrastruktur dan basis data disiapkan dalam *container* (Docker) atau menggunakan PM2, di-*deploy* langsung pada **VPS** produksi.

## **4. Fitur Utama**

### **A. Public Facing Website**

* Merender informasi secara dinamis dari *database*.
* **Halaman/Seksi Utama:** Hero (Slogan & Latar Belakang), About (Visi & Fokus), Services (Sistem, Sertifikat, Merchandise), Partners, dan Contact.
* **Fitur Baru - Event Portfolio:** Menampilkan daftar acara yang pernah bekerjasama. Berisi logo *event*, informasi singkat (lokasi, tanggal), dan *carousel* galeri foto spesifik untuk *event* tersebut.

### **B. Admin Dashboard (CMS)**

* **Secure Login:** Hanya dapat diakses melalui rute `/admin` dengan kredensial yang valid.
* **Global Settings Management:** Mengubah nama perusahaan, *motto/tagline*, logo utama situs, favicon, dan pengaturan SEO.
* **Content Management:** Editor teks (menggunakan *Rich Text Editor* seperti TipTap atau Quill) untuk mengubah isi profil perusahaan, visi, dan deskripsi layanan.
* **Event Management (CRUD):**
* Membuat entri *event* baru.
* Mengunggah logo *event*.
* Mengisi deksripsi, lokasi, dan tanggal *event*.
* Mengelola galeri foto untuk setiap entri *event*.

* **Framework (Frontend & Backend):** **Next.js (App Router)**. Menggunakan *Server Components* untuk performa UI maksimal, dan **Route Handlers** (`app/api/...`) serta **Server Actions** untuk menangani logika *backend* (CRUD ke *database*).
* **Database:** PostgreSQL atau MySQL.
* **ORM:** Prisma atau Drizzle ORM (sangat direkomendasikan karena integrasinya yang mulus dengan Next.js dan *type-safety* yang ketat).
* **Authentication:** **NextAuth.js (Auth.js)** atau implementasi JWT menggunakan *library* `jose` untuk menangani sesi *login* Admin secara aman di dalam ekosistem Next.js.
* **Storage:** Cloudflare R2 melalui API S3-compatible untuk menyimpan logo dan galeri. URL yang disimpan di database menggunakan domain publik CDN R2.
* **Deployment:** VPS (menggunakan Docker atau PM2), cukup menjalankan perintah `npm run build` dan `npm run start` untuk satu aplikasi utuh.

* **Contact & Footer Management:** Memperbarui alamat, email, nomor WhatsApp, dan tautan sosial media.

* **Public Facing Website (Antarmuka Publik):**
* **Global Gallery Section:** Sebuah halaman atau seksi khusus yang menampilkan dokumentasi foto perusahaan secara umum (di luar galeri spesifik *event*). Menampilkan *grid* foto yang responsif dengan fitur *lightbox* saat foto diklik.
* **Social Media Integration:** Ikon YouTube dan Instagram yang mengarah ke tautan resmi perusahaan akan diletakkan pada bagian *Header* (opsional) dan *Footer* secara permanen.
* **Panduan Komposisi Galeri Global:** Saat menampilkan foto-foto pada galeri ini, sistem harus mengatur tata letak agar mengisolasi subjek utama dan melakukan *zoom* proporsional agar tidak terlihat terlalu jauh. Elemen UI tambahan seperti tombol panah navigasi *lightbox* atau teks *caption* harus diletakkan dengan rapi di area latar belakang atau di luar fokus gambar, dan sama sekali tidak menutupi subjek utama dari foto tersebut.


* **Admin Dashboard (CMS):**
* **Global Gallery Management (CRUD):** Modul untuk mengunggah, menghapus, dan menambahkan *caption* pada foto-foto dokumentasi umum perusahaan.
* **Social Media Settings:** Kolom input pada menu *Global Settings* untuk memperbarui URL YouTube dan Instagram agar fleksibel di masa depan.

## **5. Database Schema & Seed Data**

Agar agen AI Anda dapat langsung membangun dan mengisi *database*, berikut adalah struktur skema utama dan *Seed Data* awal yang harus dimasukkan ke dalam *migration/seeder*:

**Tabel `SiteSettings**`

* `companyName`: "PT GELORA ENERGI INDONESIA"
* `brandName`: "GRIND"
* `tagline`: "Discover Timeless Experience with Our Inovation"
* `ctaText`: "Transform Your Event with our exquisite range of experience"
* `email`: "info@grind.co.id"
* `phone`: "+62 822-2703-9899"
* `address`: "PERUM GRIYA PERWITA WISATA AMARILIS16, RT.006 TW.067 SUKOHARJO, NGAGLIK, SLEMAN, DIY., Desa/Kelurahan Sukoharjo, Kec. Ngaglik, Kab. Sleman, Provinsi Daerah Istimewa Yogyakarta"
* `aboutVision`: "Menjadi perusahaan event organizer, promotor, layanan produksi kreatif, penyedia sistem serta konsultan manajemen terbaik dan terdepan di Indonesia yang berfokus pada kualitas, kepuasaan dan kesuksesan bagi pelanggan dan stakeholder."
* `aboutDescription`: "GRIND focus ke Sportainment Event, menjadikan ajang olah raga menjadi produk entertainment yang bisa diterima berbagai kalangan. Dengan selalu mengedepankan kepuasan klien ( Peserta Kejuaraan ) baik memberikan service pra event dan pre event yaitu dalam bentuk website gratis yang terintegrasi setiap event GRIND serta fitur-fitur seperti antrian pertandingan real time yang dapat diakses secara online dan hasil pertandingan yang dengan cepat dapat diakses oleh peserta yang juga menjadi syarat penting untuk kurasi Puspresnas..."
* `aboutMerchandise`: "Dan yang menjadi khas dari event GRIND adalah setiap event selalu membuat berbagai bentuk merchandise exclusife dan special yang bisa di dapatkan secara free maupun berbayar, sehingga para peserta event GRIND pasti akan mendapatkan gift yang berkesan dan membuat peserta akan mengikuti event selanjutnya."

**Tabel `Services**`

* [1] `title`: "Sistem Pertandingan", `description`: "System Pertandingan yang menarik dan terintegrasi"
* [2] `title`: "E-Sertifikat", `description`: "Realtime E-Sertifikat"
* [3] `title`: "Merchandise", `description`: "Free Merchandise di setiap Kejuaraan"
* [4] `title`: "Website Kejuaraan", `description`: "website Kejuaraan www.simpbti.id"

**Tabel `Events` (Contoh Struktur)**

* `id`: UUID
* `eventName`: String
* `eventLogo`: String (URL)
* `location`: String
* `date`: DateTime
* `description`: Text

**Tabel `EventGalleries` (Relasi One-to-Many dari Events)**

* `eventId`: UUID
* `imageUrl`: String

**Tabel `SiteSettings` (Pembaruan)**

* `youtubeUrl`: "[https://www.youtube.com/@GELORAENERGIINDONESIA](https://www.youtube.com/@GELORAENERGIINDONESIA)"
* `instagramUrl`: "[https://www.instagram.com/grind_indonesia/]()"

**Tabel `Users` / `Admins` (Baru)**

* `username`: "admin"
* `password`: "P@ssw0rd" *(Catatan Teknis: Saat seeder berjalan, password ini wajib di-hash menggunakan bcrypt terlebih dahulu sebelum disimpan ke database).*
* `role`: "SuperAdmin"

**Tabel `GlobalGalleries` (Baru)**

* `id`: UUID
* `imageUrl`: String (URL dari *storage*)
* `caption`: String (Opsional)
* `uploadedAt`: DateTime

---

**Instruksi untuk AI Agent:**

> *"Tolong buatkan aplikasi fullstack. Gunakan Next.js App Router dengan Tailwind CSS untuk frontend dan admin panel. Buat database MySQL dengan Prisma ORM. Implementasikan NextAuth untuk login admin. Buat tabel dan API endpoints untuk SiteSettings, Services, Partners, Events, EventGalleries, dan GlobalGallery. Gunakan Cloudflare R2 sebagai image storage dan simpan URL CDN publik di database. Desain frontend menggunakan background warna hitam (dark theme), teks putih, dengan aksen warna merah dan biru muda sesuai logo GRIND. Buatkan animasi Framer Motion yang profesional dan tidak berlebihan. Gunakan data JSON dari PRD ini sebagai seeder database. Siapkan juga environment variables dan script Docker/PM2 untuk deployment ke VPS."*
