# Website Masjid Lathifah

Website publik Masjid Lathifah untuk informasi ibadah, kegiatan, berita, galeri, pengurus, mitra, dan lokasi masjid.

## Arsitektur

- **Website publik:** Next.js App Router di repository ini.
- **CMS:** Sanity sebagai sumber data read-only.
- **Admin:** Sanity Studio berada di repository terpisah [`website-masjid-admin`](../website-masjid-admin).
- **Keamanan:** Website publik tidak memiliki Sanity write token dan tidak menyediakan route untuk membuat, mengubah, atau menghapus konten.

## Menjalankan lokal

Persyaratan:

- Node.js dan npm
- Environment variable Sanity publik

Buat `.env.local` di root project:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=o1zkx52x
NEXT_PUBLIC_SANITY_DATASET=production
```

Install dan jalankan:

```powershell
npm install
npm run dev
```

Buka `http://localhost:3000`.

Perintah yang tersedia:

```powershell
npm run lint
npm run build
npm run start
```

## Data dan fallback

Konten utama dibaca melalui route API berikut:

- `/api/berita`
- `/api/galeri`
- `/api/mimbar-jumat`
- `/api/mitra`
- `/api/pengurus`

Jika Sanity tidak tersedia, halaman tetap menggunakan data lokal dari `src/data`. UI menampilkan status ketika data terbaru sedang dimuat atau gagal disinkronkan.

## Route publik

- `/` — beranda
- `/berita` — daftar berita dan filter kategori
- `/berita/[id]` — detail berita
- `/galeri` — galeri foto
- `/robots.txt` — aturan crawler
- `/sitemap.xml` — sitemap publik

Route `/studio` tidak tersedia di website publik. Semua pengelolaan konten dilakukan melalui project admin terpisah.

## Deployment Vercel

Import repository ini sebagai project Next.js dengan root directory `.`. Set environment variable berikut pada Vercel:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=o1zkx52x
NEXT_PUBLIC_SANITY_DATASET=production
```

Jangan menambahkan Sanity write token ke website publik. Setelah deployment, verifikasi:

- halaman utama dan halaman berita dapat dibuka;
- `/robots.txt` dan `/sitemap.xml` merespons;
- `/studio` merespons `404`;
- API publik hanya menerima operasi baca.

## Optimasi gambar

Gambar lokal dan gambar dari `cdn.sanity.io` dirender dengan `next/image`. Host Sanity sudah dibatasi di `next.config.mjs`, sehingga Next.js dapat mengoptimalkan ukuran dan format gambar sesuai viewport.

## Struktur penting

```text
src/app/              Route dan halaman Next.js
src/app/api/          API read-only untuk data Sanity
src/data/              Data fallback lokal
src/hooks/             Hook sinkronisasi data client
src/components/       Komponen UI bersama
src/sanity/            Client, query, dan environment Sanity
public/               Asset lokal website
```

## Admin dan perubahan konten

Gunakan project [`website-masjid-admin`](../website-masjid-admin) untuk login ke Sanity Studio, mengedit dokumen, mengunggah gambar, dan mempublikasikan konten. Atur role Sanity dengan prinsip least privilege dan jangan menyimpan credential admin di repository publik.
