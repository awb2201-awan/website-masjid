import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'berita',
  title: 'Berita',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'judul',
      title: 'Judul',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Berita', value: 'BERITA'},
          {title: 'Kegiatan', value: 'KEGIATAN'},
          {title: 'Pengumuman', value: 'PENGUMUMAN'},
          {title: 'Sosial', value: 'SOSIAL'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tanggal',
      title: 'Tanggal terbit',
      type: 'date',
      options: {dateFormat: 'DD MMMM YYYY'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gambar',
      title: 'Gambar utama',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Teks alternatif', type: 'string'})],
    }),
    defineField({
      name: 'ringkasan',
      title: 'Ringkasan',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'isi',
      title: 'Isi berita',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {title: 'judul', subtitle: 'kategori', media: 'gambar'},
  },
})