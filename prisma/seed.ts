import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.eventGallery.deleteMany();
  await prisma.event.deleteMany();
  await prisma.globalGallery.deleteMany();
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

  await prisma.service.createMany({
    data: [
      {
        title: "Sistem Pertandingan",
        description: "System pertandingan yang menarik dan terintegrasi."
      },
      {
        title: "E-Sertifikat",
        description: "Realtime e-sertifikat untuk setiap peserta."
      },
      {
        title: "Merchandise",
        description: "Free merchandise di setiap kejuaraan."
      },
      {
        title: "Website Kejuaraan",
        description: "Website kejuaraan seperti www.simpbti.id."
      }
    ]
  });

  await prisma.staff.createMany({
    data: [
      {
        name: "Ir. Emmanuel Pinayungan",
        position: "Direktur Utama",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80"
      },
      {
        name: "Ongko Leksono",
        position: "Direktur Keuangan",
        image: "https://images.unsplash.com/photo-1600275669439-14e40452d20b?auto=format&fit=crop&w=1200&q=80"
      },
      {
        name: "Felix Erman Yudi",
        position: "Direktur Marketing dan Development",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80"
      },
      {
        name: "Krisna Murtian Utama Jati",
        position: "Direktur Operasional dan Human Resource",
        image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  });

  const event = await prisma.event.create({
    data: {
      eventName: "GRIND Sportainment Championship 2026",
      logo: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
      location: "Yogyakarta",
      date: new Date("2026-02-14T00:00:00.000Z")
    }
  });

  await prisma.eventGallery.createMany({
    data: [
      {
        eventId: event.id,
        imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=80",
        caption: "Pembukaan acara"
      },
      {
        eventId: event.id,
        imageUrl: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1600&q=80",
        caption: "Atmosfer pertandingan"
      }
    ]
  });

  await prisma.globalGallery.createMany({
    data: [
      {
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
        caption: "Tim produksi saat persiapan"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=80",
        caption: "Dokumentasi sportainment"
      }
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
