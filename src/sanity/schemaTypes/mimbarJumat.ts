import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mimbarJumat',
  title: 'Mimbar Jumat',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'tanggal', title: 'Tanggal', type: 'date', options: {dateFormat: 'DD MMMM YYYY'}, validation: (rule) => rule.required()}),
    defineField({name: 'judul', title: 'Judul khutbah', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'khatib', title: 'Khatib', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'ringkasan', title: 'Ringkasan', type: 'text', rows: 4, validation: (rule) => rule.required()}),
  ],
  orderings: [{title: 'Tanggal terbaru', name: 'tanggalDesc', by: [{field: 'tanggal', direction: 'desc'}]}],
  preview: {select: {title: 'judul', subtitle: 'tanggal'}},
})