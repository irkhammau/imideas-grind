const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const serviceData = [
  { title: "Sistem Pertandingan", description: "System pertandingan yang menarik dan terintegrasi." },
  { title: "E-Sertifikat", description: "Realtime e-sertifikat untuk setiap peserta." },
  { title: "Merchandise", description: "Free merchandise di setiap kejuaraan." },
  { title: "Website Kejuaraan", description: "Website kejuaraan yang lengkap dengan informasi dan registrasi." },
  { title: "Live Score", description: "Skor pertandingan real-time yang bisa dipantau semua peserta." },
  { title: "Manajemen Tiket", description: "Pengelolaan tiket digital untuk event skala kecil hingga besar." },
  { title: "Publikasi Media", description: "Distribusi konten event ke media sosial dan kanal partner." },
  { title: "Produksi Kreatif", description: "Produksi visual dan materi promosi untuk branding event." },
  { title: "Koordinasi Venue", description: "Koordinasi operasional venue agar event berjalan lancar." },
  { title: "Layanan Sponsorship", description: "Aktivasi sponsor dan integrasi brand selama rangkaian acara." }
];

const staffData = [
  { order: 1, name: "Ir. Emmanuel Pinayungan", position: "Direktur Utama", image: "/default.png" },
  { order: 2, name: "Ongko Leksono", position: "Direktur Keuangan", image: "/default.png" },
  { order: 3, name: "Felix Erman Yudi", position: "Direktur Marketing dan Development", image: "/default.png" },
  { order: 4, name: "Krisna Murtian Utama Jati", position: "Direktur Operasional dan Human Resource", image: "/default.png" },
  { order: 5, name: "Rafi Ananta", position: "Head of Event Strategy", image: "/default.png" },
  { order: 6, name: "Nabila Prameswari", position: "Head of Creative Production", image: "/default.png" },
  { order: 7, name: "Dimas Saputra", position: "Event Technology Manager", image: "/default.png" },
  { order: 8, name: "Alya Maharani", position: "Community Partnership Lead", image: "/default.png" },
  { order: 9, name: "Rizky Febrianto", position: "Tournament Operations Lead", image: "/default.png" },
  { order: 10, name: "Sinta Puspita", position: "Public Relations Manager", image: "/default.png" }
];

const partnerData = [
  { order: 1, name: "IMIdeas", logo: "/default.png", websiteUrl: "https://grind.co.id", description: "Strategic creative and digital solutions partner." },
  { order: 2, name: "GRIND Indonesia", logo: "/default.png", websiteUrl: "https://grind.co.id", description: "Sportainment execution and event operations partner." },
  { order: 3, name: "SportHub Nusantara", logo: "/default.png", websiteUrl: "https://example.com/sporthub", description: "Kolaborator aktivasi komunitas olahraga regional." },
  { order: 4, name: "ArenaConnect", logo: "/default.png", websiteUrl: "https://example.com/arenaconnect", description: "Partner integrasi venue dan manajemen lapangan." },
  { order: 5, name: "MediaSprint", logo: "/default.png", websiteUrl: "https://example.com/mediasprint", description: "Partner distribusi konten dan dokumentasi event." },
  { order: 6, name: "TicketFlow", logo: "/default.png", websiteUrl: "https://example.com/ticketflow", description: "Partner tiket digital dan validasi akses event." },
  { order: 7, name: "ScoreWave", logo: "/default.png", websiteUrl: "https://example.com/scorewave", description: "Partner sistem live score dan data pertandingan." },
  { order: 8, name: "BrandCatalyst", logo: "/default.png", websiteUrl: "https://example.com/brandcatalyst", description: "Partner aktivasi brand dan sponsorship campaign." },
  { order: 9, name: "MerchLab", logo: "/default.png", websiteUrl: "https://example.com/merchlab", description: "Partner produksi merchandise resmi event." },
  { order: 10, name: "UrbanFit Network", logo: "/default.png", websiteUrl: "https://example.com/urbanfit", description: "Partner jaringan komunitas sportainment perkotaan." }
];

const eventData = [
  { eventName: "GRIND Sportainment Championship 2026", location: "Yogyakarta", date: "2026-02-14" },
  { eventName: "GRIND Youth Arena Series", location: "Sleman", date: "2026-03-12" },
  { eventName: "GRIND Urban Clash Cup", location: "Bandung", date: "2026-04-09" },
  { eventName: "GRIND Community Masters", location: "Semarang", date: "2026-05-21" },
  { eventName: "GRIND National Showcase", location: "Jakarta", date: "2026-06-18" },
  { eventName: "GRIND Summer Tournament", location: "Surabaya", date: "2026-07-16" },
  { eventName: "GRIND Open Qualifier", location: "Malang", date: "2026-08-13" },
  { eventName: "GRIND Performance League", location: "Denpasar", date: "2026-09-17" },
  { eventName: "GRIND Elite Circuit", location: "Makassar", date: "2026-10-15" },
  { eventName: "GRIND Grand Finals", location: "Yogyakarta", date: "2026-11-19" }
];

async function main() {
  await prisma.eventGallery.deleteMany();
  await prisma.event.deleteMany();
  await prisma.globalGallery.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSettings.deleteMany();

  await prisma.siteSettings.create({
    data: {
      companyName: "PT GELORA ENERGI INDONESIA",
      tagline: "Discover Timeless Experience with Our Inovation",
      contact: {
        email: "info@grind.co.id",
        phone: "+62 822-2703-9899",
        address:
          "PERUM GRIYA PERWITA WISATA AMARILIS16, RT.006 TW.067 SUKOHARJO, NGAGLIK, SLEMAN, DIY., Desa/Kelurahan Sukoharjo, Kec. Ngaglik, Kab. Sleman, Provinsi Daerah Istimewa Yogyakarta"
      },
      aboutText:
        "GRIND focus ke Sportainment Event, menjadikan ajang olah raga menjadi produk entertainment yang bisa diterima berbagai kalangan. Dengan selalu mengedepankan kepuasan klien baik pada fase pra event dan pre event dalam bentuk website gratis terintegrasi, antrian pertandingan real time, serta hasil pertandingan yang cepat diakses. Kami juga menghadirkan merchandise eksklusif sebagai pengalaman berkesan bagi peserta.",
      youtubeUrl: "https://www.youtube.com/@GELORAENERGIINDONESIA",
      instagramUrl: "https://www.instagram.com/grind_indonesia/"
    }
  });

  await prisma.service.createMany({ data: serviceData });
  await prisma.staff.createMany({ data: staffData });
  await prisma.partner.createMany({ data: partnerData });

  for (const item of eventData) {
    const event = await prisma.event.create({
      data: {
        eventName: item.eventName,
        logo: "/default.png",
        location: item.location,
        date: new Date(`${item.date}T00:00:00.000Z`)
      }
    });

    await prisma.eventGallery.createMany({
      data: [
        {
          eventId: event.id,
          imageUrl: "/default.png",
          caption: `Pembukaan ${item.eventName}`
        },
        {
          eventId: event.id,
          imageUrl: "/default.png",
          caption: `Atmosfer ${item.eventName}`
        }
      ]
    });
  }

  await prisma.globalGallery.createMany({
    data: [
      { imageUrl: "/default.png", caption: "Tim produksi saat persiapan" },
      { imageUrl: "/default.png", caption: "Dokumentasi sportainment" }
    ]
  });

  const hashed = await bcrypt.hash("P@ssw0rd", 10);

  await prisma.user.create({
    data: {
      username: "admin",
      password: hashed,
      role: "SuperAdmin"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
