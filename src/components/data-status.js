export default function DataStatus({isLoading, hasError}) {
  if (!isLoading && !hasError) return null

  return (
    <p role="status" className="mt-3 text-sm text-gray-400">
      {isLoading
        ? 'Memuat data terbaru...'
        : 'Data terbaru belum tersedia. Menampilkan informasi terakhir yang tersimpan.'}
    </p>
  )
}
