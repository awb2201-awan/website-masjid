import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pengurus',
  title: 'Pengurus DKM',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'nama',
      title: 'Nama lengkap',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jabatan',
      title: 'Jabatan',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'inisial',
      title: 'Inisial',
      type: 'string',
      description: 'Dipakai sebagai fallback jika foto tidak diisi.',
      validation: (rule) => rule.required().max(3),
    }),
    defineField({
      name: 'foto',
      title: 'Foto pengurus',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Teks alternatif', type: 'string'})],
    }),
    defineField({
      name: 'urutan',
      title: 'Urutan tampil',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [{title: 'Urutan tampil', name: 'urutanAsc', by: [{field: 'urutan', direction: 'asc'}]}],
  preview: {
    select: {title: 'nama', subtitle: 'jabatan', media: 'foto'},
  },
})