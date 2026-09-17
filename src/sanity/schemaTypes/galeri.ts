import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galeri',
  title: 'Galeri',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'judul',
      title: 'Judul foto',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gambar',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
      fields: [defineField({name: 'alt', title: 'Teks alternatif', type: 'string'})],
    }),
    defineField({
      name: 'deskripsi',
      title: 'Deskripsi',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'judul', media: 'gambar'},
  },
})