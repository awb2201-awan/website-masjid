import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mitra',
  title: 'Mitra & Kolaborasi',
  type: 'document',
  fields: [
    defineField({name: 'nama', title: 'Nama mitra', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'inisial', title: 'Inisial', type: 'string', validation: (rule) => rule.required().max(5)}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Teks alternatif', type: 'string'})]}),
  ],
  preview: {select: {title: 'nama', subtitle: 'inisial', media: 'logo'}},
})