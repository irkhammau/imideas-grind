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
        order: 1,
        name: "Ir. Emmanuel Pinayungan",
        position: "Direktur Utama",
        image: "/logo.png"
      },
      {
        order: 2,
        name: "Ongko Leksono",
        position: "Direktur Keuangan",
        image: "/logo.png"
      },
      {
        order: 3,
        name: "Felix Erman Yudi",
        position: "Direktur Marketing dan Development",
        image: "/logo.png"
      },
      {
        order: 4,
        name: "Krisna Murtian Utama Jati",
        position: "Direktur Operasional dan Human Resource",
        image: "/logo.png"
      }
    ]
  });

  const event = await prisma.event.create({
    data: {
      eventName: "GRIND Sportainment Championship 2026",
      logo: "/logo.png",
      location: "Yogyakarta",
      date: new Date("2026-02-14T00:00:00.000Z")
    }
  });

  await prisma.eventGallery.createMany({
    data: [
      {
        eventId: event.id,
        imageUrl: "/logo.png",
        caption: "Pembukaan acara"
      },
      {
        eventId: event.id,
        imageUrl: "/logo.png",
        caption: "Atmosfer pertandingan"
      }
    ]
  });

  await prisma.globalGallery.createMany({
    data: [
      {
        imageUrl: "/logo.png",
        caption: "Tim produksi saat persiapan"
      },
      {
        imageUrl: "/logo.png",
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
