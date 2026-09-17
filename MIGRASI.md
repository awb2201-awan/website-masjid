# Migrasi Data ke Sanity

Script migrasi membaca data lama dari:

- `src/data/berita.json`
- `src/data/pengurus.json`
- Foto di `public/`

Data akan dibuat sebagai dokumen Sanity dengan ID stabil:

- `berita-1`, `berita-2`, dan seterusnya
- `pengurus-se`, `pengurus-bw`, dan seterusnya
- `galeri-hero`, `galeri-masjid-2`, dan `galeri-masjid-3`

Script memakai `createOrReplace`, sehingga aman dijalankan ulang dan tidak menggandakan dokumen. Isi berita diubah menjadi Portable Text dan gambar lokal di-upload sebagai asset Sanity.

## Dry-run

Untuk melihat dokumen yang akan dibuat tanpa menulis ke Sanity:

```powershell
$env:MIGRATION_DRY_RUN="1"
npm run migrate:data
Remove-Item Env:MIGRATION_DRY_RUN
```

## Jalankan Migrasi

Pastikan sudah login ke Sanity CLI, lalu jalankan:

```powershell
npx sanity login
npm run migrate:data
```

Setelah selesai, buka kembali:

```text
http://localhost:3000/studio/structure
http://localhost:3000/berita
```

## Catatan

- Schema harus sudah terdaftar sebelum migrasi dijalankan.
- Galeri tidak berasal dari JSON karena project belum memiliki `galeri.json`; script menggunakan tiga foto yang sudah ada di `public/`.
- Jika foto berita tidak ditemukan, dokumen tetap dibuat tanpa gambar.
