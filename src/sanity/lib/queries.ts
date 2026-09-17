export const beritaQuery = `*[_type == "berita"] | order(tanggal desc) {
  _id,
  judul,
  kategori,
  tanggal,
  gambar {
    asset->{url}
  },
  ringkasan,
  isi
}`

export const beritaByIdQuery = `*[_type == "berita" && _id == $id][0] {
  _id,
  judul,
  kategori,
  tanggal,
  gambar {
    asset->{url}
  },
  ringkasan,
  isi
}`

export const galeriQuery = `*[_type == "galeri"] | order(_createdAt desc) {
  _id,
  judul,
  deskripsi,
  gambar { asset->{url} }
}`

export const pengurusQuery = `*[_type == "pengurus"] | order(urutan asc, _createdAt asc) {
  _id,
  nama,
  jabatan,
  inisial,
  foto { asset->{url} }
}`

export const mimbarJumatQuery = `*[_type == "mimbarJumat"] | order(tanggal desc) {
  _id, tanggal, khatib, judul, ringkasan
}`

export const mitraQuery = `*[_type == "mitra"] | order(_createdAt asc) {
  _id, nama, inisial, logo { asset->{url} }
}`