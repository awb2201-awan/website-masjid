import {createReadStream, existsSync, readFileSync} from 'node:fs'
import {basename, dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const client = getCliClient({apiVersion: '2026-09-17'})
const dryRun = process.env.MIGRATION_DRY_RUN === '1'

const beritaSource = JSON.parse(readFileSync(resolve(rootDir, 'src/data/berita.json'), 'utf8'))
const pengurusSource = JSON.parse(readFileSync(resolve(rootDir, 'src/data/pengurus.json'), 'utf8'))
const mimbarSource = JSON.parse(readFileSync(resolve(rootDir, 'src/data/mimbar-jumat.json'), 'utf8'))
const mitraSource = JSON.parse(readFileSync(resolve(rootDir, 'src/data/mitra.json'), 'utf8'))

const gallerySource = [
  {id: 'hero', judul: 'Masjid Lathifah', file: 'hero-bg.jpg'},
  {id: 'masjid-2', judul: 'Kegiatan Masjid Lathifah', file: 'masjid-2.jpg'},
  {id: 'masjid-3', judul: 'Dokumentasi Masjid Lathifah', file: 'masjid-3.jpg'},
]

const monthNames = {
  Januari: 1,
  Februari: 2,
  Maret: 3,
  April: 4,
  Mei: 5,
  Juni: 6,
  Juli: 7,
  Agustus: 8,
  September: 9,
  Oktober: 10,
  November: 11,
  Desember: 12,
}

function toDate(value) {
  const [day, monthName, year] = value.split(' ')
  const month = monthNames[monthName]
  if (!month) throw new Error(`Tanggal tidak dikenali: ${value}`)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function toPortableText(value) {
  return (value || '').split('\n\n').filter(Boolean).map((text, index) => ({
    _type: 'block',
    _key: `paragraph-${index + 1}`,
    style: 'normal',
    markDefs: [],
    children: [{
      _type: 'span',
      _key: `span-${index + 1}`,
      text,
      marks: [],
    }],
  }))
}

async function imageField(documentId, relativePath) {
  const filePath = resolve(rootDir, 'public', relativePath.replace(/^\//, ''))
  if (!existsSync(filePath)) {
    console.warn(`Gambar tidak ditemukan, dilewati: ${relativePath}`)
    return undefined
  }

  const existing = await client.fetch('*[_id == $id][0]{gambar{asset->{_ref}}}', {id: documentId})
  if (existing?.gambar?.asset?._ref) {
    return existing.gambar
  }

  if (dryRun) {
    return {_type: 'image', _sanityAsset: `image@file://${filePath.replaceAll('\\', '/')}`}
  }

  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: basename(filePath),
  })
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function migrateBerita() {
  for (const item of beritaSource) {
    const id = `berita-${item.id}`
    const document = {
      _id: id,
      _type: 'berita',
      judul: item.judul,
      kategori: item.kategori,
      tanggal: toDate(item.tanggal),
      ringkasan: item.ringkasan,
      isi: toPortableText(item.isi || item.ringkasan),
    }
    const gambar = await imageField(id, item.img)
    if (gambar) document.gambar = gambar
    if (dryRun) console.log('[dry-run] berita', id)
    else await client.createOrReplace(document)
  }
}

async function migratePengurus() {
  for (const [index, item] of pengurusSource.entries()) {
    const id = `pengurus-${item.inisial.toLowerCase()}`
    const document = {
      _id: id,
      _type: 'pengurus',
      nama: item.nama,
      jabatan: item.jabatan,
      inisial: item.inisial,
      urutan: index + 1,
    }
    if (dryRun) console.log('[dry-run] pengurus', id)
    else await client.createOrReplace(document)
  }
}

async function migrateGaleri() {
  for (const item of gallerySource) {
    const id = `galeri-${item.id}`
    const document = {
      _id: id,
      _type: 'galeri',
      judul: item.judul,
      deskripsi: 'Dokumentasi Masjid Lathifah.',
    }
    const gambar = await imageField(id, `/${item.file}`)
    if (gambar) document.gambar = gambar
    if (dryRun) console.log('[dry-run] galeri', id)
    else await client.createOrReplace(document)
  }
}

async function migrateMimbar() {
  for (const [index, item] of mimbarSource.entries()) {
    const id = `mimbar-jumat-${index + 1}`
    const document = {
      _id: id,
      _type: 'mimbarJumat',
      tanggal: toDate(item.tanggal),
      khatib: item.khatib,
      judul: item.judul,
      ringkasan: item.ringkasan,
    }
    if (dryRun) console.log('[dry-run] mimbar', id)
    else await client.createOrReplace(document)
  }
}

async function migrateMitra() {
  for (const item of mitraSource) {
    const id = `mitra-${item.inisial.toLowerCase()}`
    const document = {
      _id: id,
      _type: 'mitra',
      nama: item.nama,
      inisial: item.inisial,
    }
    if (dryRun) console.log('[dry-run] mitra', id)
    else await client.createOrReplace(document)
  }
}

await migrateBerita()
await migratePengurus()
await migrateGaleri()
await migrateMimbar()
await migrateMitra()
console.log(dryRun ? 'Dry-run selesai.' : 'Migrasi selesai.')
