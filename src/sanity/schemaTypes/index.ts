import { type SchemaTypeDefinition } from 'sanity'
import berita from './berita'
import galeri from './galeri'
import pengurus from './pengurus'
import mimbarJumat from './mimbarJumat'
import mitra from './mitra'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [berita, galeri, pengurus, mimbarJumat, mitra],
}
