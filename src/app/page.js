'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import JADWAL_FALLBACK from '@/data/jadwal.json'
import MITRA from '@/data/mitra.json'
import MIMBAR_JUMAT from '@/data/mimbar-jumat.json'
import PENGURUS from '@/data/pengurus.json'
import BERITA_ALL from '@/data/berita.json'

const LAYANAN = [
  { icon: 'mosque', judul: 'Sholat Berjamaah',  desc: 'Lima waktu setiap hari, terbuka untuk seluruh jamaah.' },
  { icon: 'book', judul: 'Kajian & Pengajian', desc: 'Rutin setiap pekan, berbagai tema ilmu agama.' },
  { icon: 'child', judul: 'TPA / TPQ',          desc: 'Bimbingan Al-Qur\'an untuk anak-anak di lingkungan masjid.' },
  { icon: 'heart', judul: 'Sosial & Zakat',     desc: 'Pengelolaan zakat, infaq, sedekah, dan santunan dhuafa.' },
]

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/4qac5V8LgmyhVQk87'
const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps?q=-6.4231169,106.8405725&output=embed'
const JADWAL_SCENES = [
  { range: [0, 4], top: '#02020f', bottom: '#080820' },
  { range: [4, 5], top: '#120828', bottom: '#6b2060' },
  { range: [5, 5.5], top: '#2a1248', bottom: '#d45a2a' },
  { range: [5.5, 6.5], top: '#3a1a3a', bottom: '#e8803a' },
  { range: [6.5, 8], top: '#1a5a9a', bottom: '#f0c060' },
  { range: [8, 12], top: '#1060a8', bottom: '#70c0e8' },
  { range: [12, 15], top: '#0a5090', bottom: '#50aad0' },
  { range: [15, 17], top: '#1a6aa0', bottom: '#80c0e0' },
  { range: [17, 17.5], top: '#c04010', bottom: '#f07020' },
  { range: [17.5, 18], top: '#902030', bottom: '#e05020' },
  { range: [18, 19], top: '#300a50', bottom: '#a03020' },
  { range: [19, 24], top: '#02020f', bottom: '#080820' },
]
const JADWAL_STARS = Array.from({ length: 40 }, (_, index) => ({
  left: (index * 37) % 100,
  top: 5 + ((index * 23) % 58),
  size: index % 3 === 0 ? 2 : 1,
}))
const JADWAL_CLOUDS = [
  { left: '4%', top: '14%', width: 80, height: 22, duration: 9 },
  { left: '7%', top: '26%', width: 55, height: 15, duration: 10 },
  { left: '40%', top: '8%', width: 100, height: 25, duration: 11 },
  { left: '45%', top: '22%', width: 65, height: 17, duration: 12 },
  { left: '68%', top: '16%', width: 70, height: 20, duration: 10.5 },
]
const JADWAL_NAMES = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya']

function normalizeWaktu(waktu) {
  const match = String(waktu || '').match(/(\d{1,2})[:.](\d{2})/)
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : '--:--'
}

function FeatureIcon({ name, className = 'h-6 w-6' }) {
  const paths = {
    mosque: <><path d="M4 20h16M6 20v-7h12v7M4 13l8-7 8 7M9 20v-4h6v4M12 3v3" /><path d="M3 13h18" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 11h6" /></>,
    child: <><circle cx="12" cy="7" r="3" /><path d="M6 21v-3.5a6 6 0 0 1 12 0V21M8 14h8M4 21h16" /></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" /></>,
    newspaper: <><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" /><path d="M6 4v16" /></>,
    phone: <path d="M6.5 3.5 9 3l2 5-2.5 1.7a15 15 0 0 0 5.3 5.3l1.7-2.5 5 2-.5 2.5a2.5 2.5 0 0 1-2.7 2A16.5 16.5 0 0 1 4.5 6.2a2.5 2.5 0 0 1 2-2.7Z" />,
  }
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.mosque}</svg>
}

/* ── HELPER: animasi muncul pas discroll ── */
function Reveal({ children, delay = 0 }) {
  const elRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (elRef.current) obs.observe(elRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={elRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  )
}

/* ── HELPER: pattern dekoratif islami ── */
function IslamicPattern({ className = '' }) {
  return (
    <svg className={`absolute pointer-events-none ${className}`} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamic-star" width="60" height="60" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M30 5 L38 22 L55 22 L41 33 L47 50 L30 39 L13 50 L19 33 L5 22 L22 22 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-star)" />
    </svg>
  )
}

function Navbar({ onDonasi }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const MENU = ['Beranda','Jadwal','Tentang','Layanan','Berita','Galeri','Lokasi']

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'bg-[#0d3d2b]/95 backdrop-blur shadow-lg' : 'bg-[#0d3d2b]/40 backdrop-blur-md'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Masjid Lathifah" width={44} height={44} loading="eager" className="rounded-full" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Masjid Lathifah</p>
            <p className="text-[#c9a84c] text-xs">DKM Lathifah</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {MENU.map(m => (
            <a key={m} href={`#${m.toLowerCase()}`}
               className="text-white/100 hover:text-[#c9a84c] text-lg font-medium transition-colors">
              {m}
            </a>
          ))}
          <button onClick={onDonasi}
            className="bg-[#c9a84c] hover:bg-[#b8963e] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg shadow-[#c9a84c]/20 hover:shadow-xl hover:shadow-[#c9a84c]/30 hover:scale-105 transition-all duration-300">
            Donasi
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Buka menu"
        >
          {menuOpen ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[calc(100vh-5rem)] overflow-y-auto' : 'max-h-0'}`}>
        <div className="px-6 pb-4 flex flex-col gap-1">
          {MENU.map(m => (
            <a key={m} href={`#${m.toLowerCase()}`}
               onClick={() => setMenuOpen(false)}
               className="text-white/90 hover:text-[#c9a84c] text-base font-medium py-2.5 border-b border-white/10 transition-colors">
              {m}
            </a>
          ))}
          <button onClick={() => { onDonasi(); setMenuOpen(false) }}
            className="bg-[#c9a84c] hover:bg-[#b8963e] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors mt-3">
            Donasi
          </button>
        </div>
      </div>
    </nav>
  )
}

function SectionJadwal() {
  const [now, setNow] = useState(null)
  const [timings, setTimings] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('fallback')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const today = new Date()
          const date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`
          const response = await fetch(
            `https://api.aladhan.com/v1/timings/${date}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=20`
          )
          if (!response.ok) throw new Error(`Aladhan returned ${response.status}`)
          const json = await response.json()
          const apiTimings = json.data?.timings
          const nextTimings = {
            Subuh: normalizeWaktu(apiTimings?.Fajr),
            Dzuhur: normalizeWaktu(apiTimings?.Dhuhr),
            Ashar: normalizeWaktu(apiTimings?.Asr),
            Maghrib: normalizeWaktu(apiTimings?.Maghrib),
            Isya: normalizeWaktu(apiTimings?.Isha),
          }
          if (Object.values(nextTimings).some((waktu) => waktu === '--:--')) throw new Error('Invalid prayer time response')
          setTimings(nextTimings)
          setStatus('online')
        } catch (error) {
          console.error('Failed to load prayer times', error)
          setStatus('fallback')
        }
      },
      () => setStatus('fallback'),
      { timeout: 8000 }
    )
  }, [])

  const currentNow = now || new Date(2000, 0, 1)
  const jamDesimal = currentNow.getHours() + currentNow.getMinutes() / 60 + currentNow.getSeconds() / 3600
  const nowMenit = currentNow.getHours() * 60 + currentNow.getMinutes()
  const scene = JADWAL_SCENES.find(({ range }) => jamDesimal >= range[0] && jamDesimal < range[1]) || JADWAL_SCENES[0]
  const malam = jamDesimal < 5.5 || jamDesimal >= 19
  const dramatis = (jamDesimal >= 5 && jamDesimal < 6.5) || (jamDesimal >= 17 && jamDesimal < 19)
  const starsOpacity = jamDesimal < 5.5 || jamDesimal >= 18.5 ? 1 : jamDesimal < 6.5 || jamDesimal >= 18 ? 0.3 : 0
  const cloudsOpacity = jamDesimal >= 7 && jamDesimal < 16.5 ? 0.85 : jamDesimal >= 6 && jamDesimal < 17 ? 0.35 : 0
  const sunLeft = (jamDesimal / 24) * 100
  const sunTop = 10 + 60 * (1 - Math.abs(Math.sin((jamDesimal / 24) * Math.PI * 2 + Math.PI / 2)) * 0.9)
  const waktuSholat = JADWAL_NAMES.map((nama) => ({
    nama,
    waktu: timings?.[nama] || normalizeWaktu(JADWAL_FALLBACK.find((item) => item.nama === nama)?.waktu),
  }))
  let nextIndex = waktuSholat.findIndex(({ waktu }) => {
    const [hour, minute] = waktu.split(':').map(Number)
    return hour * 60 + minute > nowMenit
  })
  if (nextIndex === -1) nextIndex = 0
  const berikutnya = waktuSholat[nextIndex]
  const [nextHour, nextMinute] = berikutnya.waktu.split(':').map(Number)
  const currentSeconds = currentNow.getHours() * 3600 + currentNow.getMinutes() * 60 + currentNow.getSeconds()
  let targetSeconds = nextHour * 3600 + nextMinute * 60
  if (targetSeconds <= currentSeconds) targetSeconds += 24 * 60 * 60
  const selisih = targetSeconds - currentSeconds
  const countdown = [
    Math.floor(selisih / 3600),
    Math.floor((selisih % 3600) / 60),
    selisih % 60,
  ].map((value) => String(value).padStart(2, '0')).join(':')
  const celestialStyle = malam
    ? { width: 20, height: 20, background: 'radial-gradient(circle,#f0f0ff 20%,#c0c0ee 60%,transparent)', boxShadow: '0 0 8px 3px rgba(180,180,255,.4)' }
    : dramatis
      ? { width: 28, height: 28, background: 'radial-gradient(circle,#ffe0a0 20%,#ff9040 60%,transparent)', boxShadow: '0 0 22px 10px rgba(255,150,50,.5)' }
      : { width: 28, height: 28, background: 'radial-gradient(circle,#fffde0 30%,#ffe060 70%,transparent)', boxShadow: '0 0 16px 8px rgba(255,220,50,.35)' }

  return (
    <section id="jadwal" className="relative overflow-hidden bg-white px-6 py-16 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,.12),transparent_42%)]" />
      <div className="relative mx-auto grid max-w-[480px] overflow-hidden rounded-[20px] border border-black/10 shadow-[0_16px_50px_rgba(13,61,43,.2)] lg:max-w-6xl lg:grid-cols-[1.35fr_.85fr] lg:rounded-[28px]">
        <div className="relative h-[clamp(220px,52vw,300px)] overflow-hidden lg:h-[460px]">
          <div className="absolute inset-0 transition-[background] duration-[6000ms]" style={{ background: `linear-gradient(to bottom, ${scene.top}, ${scene.bottom})` }} />
          <div className="absolute inset-0 transition-opacity duration-[4000ms]" style={{ opacity: starsOpacity }}>
            {JADWAL_STARS.map((star, index) => (
              <span key={index} className="absolute rounded-full bg-white animate-[twinkle_2.5s_ease-in-out_infinite]" style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${index % 7}s` }} />
            ))}
          </div>
          <div className="absolute inset-0 transition-opacity duration-[4000ms]" style={{ opacity: cloudsOpacity }}>
            {JADWAL_CLOUDS.map((cloud, index) => (
              <span key={index} className="absolute rounded-full bg-white/70 blur-[1px] animate-[drift_10s_ease-in-out_infinite_alternate]" style={{ left: cloud.left, top: cloud.top, width: cloud.width, height: cloud.height, animationDuration: `${cloud.duration}s`, animationDelay: `${index}s` }} />
            ))}
          </div>
          <div className="absolute bottom-14 left-0 right-0 h-16" style={{ background: dramatis ? 'linear-gradient(to top, rgba(240,100,30,.7), transparent)' : 'linear-gradient(to top, rgba(10,10,40,.2), transparent)' }} />
          <div className="absolute rounded-full transition-[left,top] duration-[6000ms]" style={{ left: `${sunLeft}%`, top: `${sunTop}%`, transform: 'translate(-50%, -50%)', ...celestialStyle }} />
          <svg className="absolute bottom-0 left-0 h-[45%] w-full" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <rect x="0" y="270" width="1200" height="30" fill="rgba(0,0,0,.75)" />
            <path d="M0 270 Q100 220 200 240 Q300 255 400 235 Q500 215 600 230 Q700 245 800 225 Q900 205 1000 230 Q1100 250 1200 235 L1200 300 L0 300Z" fill="rgba(0,0,0,.75)" />
            <rect x="160" y="160" width="12" height="115" fill="rgba(0,0,0,.75)" /><polygon points="166,145 158,162 174,162" fill="rgba(0,0,0,.75)" /><circle cx="166" cy="141" r="4" fill="#c9a84c" />
            <rect x="1028" y="160" width="12" height="115" fill="rgba(0,0,0,.75)" /><polygon points="1034,145 1026,162 1042,162" fill="rgba(0,0,0,.75)" /><circle cx="1034" cy="141" r="4" fill="#c9a84c" />
            <rect x="340" y="200" width="520" height="105" fill="rgba(0,0,0,.75)" />
            <rect x="355" y="130" width="22" height="175" fill="rgba(0,0,0,.75)" /><polygon points="366,112 353,132 379,132" fill="rgba(0,0,0,.75)" /><circle cx="366" cy="107" r="6" fill="#c9a84c" />
            <rect x="823" y="130" width="22" height="175" fill="rgba(0,0,0,.75)" /><polygon points="834,112 821,132 847,132" fill="rgba(0,0,0,.75)" /><circle cx="834" cy="107" r="6" fill="#c9a84c" />
            <ellipse cx="460" cy="200" rx="65" ry="44" fill="rgba(0,0,0,.75)" /><ellipse cx="740" cy="200" rx="65" ry="44" fill="rgba(0,0,0,.75)" /><ellipse cx="600" cy="175" rx="100" ry="70" fill="rgba(0,0,0,.75)" />
            <path d="M594 112a16 16 0 1 1 12 0" stroke="#c9a84c" strokeWidth="3" fill="none" /><circle cx="608" cy="107" r="3" fill="#c9a84c" />
          </svg>
        </div>
        <div className="bg-[#0d3d2b] p-[clamp(14px,4vw,22px)] lg:flex lg:flex-col lg:justify-center lg:p-10">
          <div className="mb-4 flex items-start justify-between gap-3 lg:mb-8 lg:gap-6">
            <div>
              <p className="text-[clamp(28px,7vw,38px)] font-medium leading-none tracking-[-1px] text-white tabular-nums lg:text-5xl">{now ? now.toLocaleTimeString('id-ID') : '--:--:--'}</p>
              <p className="mt-1 text-[clamp(10px,2.5vw,12px)] text-white/50 lg:text-sm">{now ? now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Memuat waktu...'}</p>
              <p className="mt-0.5 text-[clamp(9px,2.2vw,11px)] text-[#c9a84c]/75 lg:mt-2 lg:text-xs">Jadwal sholat hari ini</p>
            </div>
            <div className="rounded-xl border border-[#c9a84c]/20 bg-white/5 px-3 py-2 text-right lg:min-w-[150px] lg:px-4 lg:py-3">
              <p className="mb-1 text-[clamp(8px,2vw,9px)] uppercase tracking-[.12em] text-white/35">Berikutnya</p>
              <p className="text-[clamp(14px,3.8vw,18px)] font-semibold leading-none text-white">{berikutnya.nama}</p>
              <p className="mt-1 text-[clamp(20px,5.5vw,28px)] font-bold leading-none tracking-[-1px] text-[#c9a84c] tabular-nums [text-shadow:0_0_16px_rgba(201,168,76,.6)]">{countdown}</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5 lg:gap-2">
            {waktuSholat.map((sholat, index) => {
              const [hour, minute] = sholat.waktu.split(':').map(Number)
              const isNext = index === nextIndex
              const isDone = hour * 60 + minute < nowMenit && !isNext
              return (
                <div key={sholat.nama} className={`flex flex-col items-center gap-1 rounded-[10px] px-0.5 py-2 lg:gap-2 lg:rounded-xl lg:px-2 lg:py-3 ${isNext ? 'border border-[#c9a84c]/35 bg-[#c9a84c]/12' : isDone ? 'border border-white/5 bg-white/[.03]' : 'border border-white/[.06] bg-white/[.05]'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isNext ? 'bg-[#c9a84c] shadow-[0_0_6px_rgba(201,168,76,.7)]' : isDone ? 'bg-white/20' : 'bg-white/15'}`} />
                  <p className={`text-center text-[clamp(9px,2.2vw,11px)] uppercase tracking-[.05em] ${isNext ? 'font-semibold text-white' : isDone ? 'text-white/30' : 'text-white/60'}`}>{sholat.nama}</p>
                  <p className={`text-center text-[clamp(10px,2.5vw,12px)] tabular-nums ${isNext ? 'font-semibold text-[#c9a84c]' : isDone ? 'text-white/20' : 'text-white/45'}`}>{sholat.waktu}</p>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-center text-[10px] text-white/40">
            {status === 'online' ? 'Jadwal berdasarkan lokasi Anda' : status === 'loading' ? 'Memuat jadwal berdasarkan lokasi...' : 'Menampilkan jadwal default masjid'}
          </p>
        </div>
      </div>
    </section>
  )
}

function DonasiOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
           onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-[#0d3d2b] flex items-center justify-center mx-auto mb-4">
          <FeatureIcon name="mosque" className="h-6 w-6 text-[#c9a84c]" />
        </div>
        <h3 className="text-[#0d3d2b] font-bold text-xl mb-1">Infaq & Sedekah</h3>
        <p className="text-gray-500 text-sm mb-5">Scan QRIS di bawah untuk berdonasi</p>
        <div className="bg-gray-100 rounded-2xl h-52 flex items-center justify-center mb-5">
          <div className="text-center">
            <FeatureIcon name="phone" className="mx-auto mb-2 h-10 w-10 text-gray-400" />
            <p className="text-gray-400 text-sm">Gambar QRIS</p>
            <p className="text-gray-300 text-xs">Taruh file qris.png di /public</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4">Jazakumullah khairan atas kebaikan Bapak/Ibu</p>
        <button onClick={onClose}
          className="w-full bg-[#0d3d2b] hover:bg-[#0a2e21] text-white font-semibold py-3 rounded-xl transition-colors">
          Tutup
        </button>
      </div>
    </div>
  )
}

function SectionMimbarJumat() {
  const [mimbar, setMimbar] = useState(MIMBAR_JUMAT)

  useEffect(() => {
    fetch('/api/mimbar-jumat')
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (items.length > 0) setMimbar(items)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="mimbar-jumat" className="relative bg-white py-20 px-6 overflow-hidden">
      <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.025]" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Khutbah Jumat</p>
          <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Mimbar Jumat</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mimbar.map((m, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                  i === 0
                    ? 'bg-[#0d3d2b] border-[#0d3d2b] text-white shadow-xl shadow-[#0d3d2b]/20'
                    : 'bg-gray-50 border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-lg'
                }`}>
                {i === 0 && (
                  <span className="inline-block bg-[#c9a84c] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3">
                    JUMAT TERDEKAT
                  </span>
                )}
                <p className={`text-xs mb-2 ${i === 0 ? 'text-white/50' : 'text-gray-400'}`}>{m.tanggal}</p>
                <h3 className={`font-bold text-base leading-snug mb-2 ${i === 0 ? 'text-white' : 'text-[#0d3d2b]'}`}>
                  {m.judul}
                </h3>
                <p className={`text-sm leading-relaxed mb-4 ${i === 0 ? 'text-white/70' : 'text-gray-500'}`}>
                  {m.ringkasan}
                </p>
                <div className={`pt-3 border-t ${i === 0 ? 'border-white/10' : 'border-gray-100'}`}>
                  <p className="text-xs uppercase tracking-widest mb-0.5 text-[#c9a84c]">Khatib</p>
                  <p className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-[#0d3d2b]'}`}>{m.khatib}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionPengurus() {
  const [pengurus, setPengurus] = useState(PENGURUS)

  useEffect(() => {
    fetch('/api/pengurus')
      .then((response) => response.ok ? response.json() : [])
      .then((pengurusSanity) => {
        if (pengurusSanity.length > 0) setPengurus(pengurusSanity)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="pengurus" className="relative bg-gray-50 py-20 px-6 overflow-hidden">
      <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.03]" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Struktur Organisasi</p>
          <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Pengurus DKM Lathifah</h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {pengurus.map((p, i) => (
            <Reveal key={p.nama} delay={i * 80}>
              <div className="text-center group">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-[#0d3d2b] flex items-center justify-center mb-4 border-4 border-white shadow-md group-hover:shadow-xl group-hover:border-[#c9a84c]/40 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {p.foto ? (
                    <Image src={p.foto} alt={p.nama} fill unoptimized className="object-cover" />
                  ) : (
                    <span className="text-[#c9a84c] font-extrabold text-xl">{p.inisial}</span>
                  )}
                </div>
                <p className="font-bold text-[#0d3d2b] text-sm leading-snug">{p.nama}</p>
                <p className="text-gray-400 text-xs mt-1">{p.jabatan}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionBerita() {
  const [semuaBerita, setSemuaBerita] = useState(BERITA_ALL)

  useEffect(() => {
    fetch('/api/berita')
      .then((response) => response.ok ? response.json() : [])
      .then((beritaSanity) => {
        if (beritaSanity.length > 0) setSemuaBerita(beritaSanity)
      })
      .catch(() => {})
  }, [])

  const featured = semuaBerita[0]
  const smalls   = semuaBerita.slice(1, 4)
  return (
    <section id="berita" className="relative bg-white py-20 px-6 overflow-hidden">
      <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.025]" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Informasi</p>
              <h2 className="text-[#0d3d2b] text-3xl font-bold">Berita Terbaru</h2>
            </div>
            <Link href="/berita" className="text-[#0d3d2b] text-sm font-semibold hover:text-[#c9a84c] transition-colors">
              Semua Berita →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featured && (
            <Reveal>
              <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-80 group cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-300">
                <Image src={featured.img} alt={featured.judul} fill sizes="(min-width: 1024px) 66vw, 100vw" unoptimized={featured.img.startsWith('http')} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                    {featured.kategori}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-snug mb-2">{featured.judul}</h3>
                  <p className="text-white/70 text-sm line-clamp-2">{featured.ringkasan}</p>
                </div>
              </div>
            </Reveal>
          )}

          <div className="flex flex-col gap-4">
            {smalls.map((b, i) => (
              <Reveal key={b.id} delay={i * 100}>
                <div className="relative rounded-2xl overflow-hidden h-[calc((320px-16px)/3)] group cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <Image src={b.img} alt={b.judul} fill sizes="(min-width: 1024px) 33vw, 100vw" unoptimized={b.img.startsWith('http')} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="bg-[#c9a84c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block">
                      {b.kategori}
                    </span>
                    <p className="text-white font-semibold text-sm line-clamp-2 leading-snug">{b.judul}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionMitra() {
  const [mitra, setMitra] = useState(MITRA)

  useEffect(() => {
    fetch('/api/mitra')
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (items.length > 0) setMitra(items)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-gray-50 py-12 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-6 text-center">
        <p className="text-[#0d3d2b]/40 text-xs uppercase tracking-widest font-bold">Mitra & Kolaborasi</p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />
        <div className="flex gap-6 animate-[marquee_20s_linear_infinite] w-max">
          {[...mitra, ...mitra].map((m, i) => (
            <div key={i}
              className="flex-shrink-0 w-32 h-16 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c9a84c]/30 transition-all flex flex-col items-center justify-center gap-1 px-3">
              <span className="text-[#0d3d2b] font-extrabold text-sm">{m.inisial}</span>
              <span className="text-gray-400 text-[10px] text-center leading-tight">{m.nama}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [showDonasi, setShowDonasi] = useState(false)
  const [galeri, setGaleri] = useState([
    {id: 'hero', judul: 'Masjid Lathifah', img: '/hero-bg.jpg'},
    {id: 'masjid-2', judul: 'Masjid Lathifah', img: '/masjid-2.jpg'},
    {id: 'masjid-3', judul: 'Masjid Lathifah', img: '/masjid-3.jpg'},
  ])

  useEffect(() => {
    fetch('/api/galeri')
      .then((response) => response.ok ? response.json() : [])
      .then((galeriSanity) => {
        if (galeriSanity.length > 0) setGaleri(galeriSanity)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <Navbar onDonasi={() => setShowDonasi(true)} />
      {showDonasi && <DonasiOverlay onClose={() => setShowDonasi(false)} />}

      {/* ── HERO ── */}
      <section id="beranda" className="relative min-h-screen flex items-center">
        <Image src="/hero-bg.jpg" alt="Masjid Lathifah" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d2b]/95 via-[#0d3d2b]/70 to-[#0d3d2b]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d3d2b]/90 via-transparent to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-24 pb-16">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-3">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
              <p className="text-white/60 text-sm tracking-widest uppercase mb-4">Selamat Datang di</p>
              <h1 className="text-white text-5xl lg:text-7xl font-extrabold leading-tight mb-2">Masjid</h1>
              <h1 className="text-[#c9a84c] text-5xl lg:text-7xl font-extrabold leading-tight mb-6">Lathifah</h1>
              <p className="text-white/70 text-base max-w-md leading-relaxed mb-8">
                Ruang digital untuk mengenal masjid, melihat jadwal ibadah, serta mengikuti
                informasi dan kegiatan Masjid Lathifah.
              </p>
              <div className="flex gap-4">
                <a href="#tentang" className="bg-[#c9a84c] hover:bg-[#b8963e] text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-[#c9a84c]/30 hover:shadow-xl hover:shadow-[#c9a84c]/40 hover:scale-105 transition-all duration-300">
                  Kenal Masjid
                </a>
                <a href="#jadwal" className="border border-white/40 hover:border-white hover:bg-white/10 text-white font-semibold px-5 sm:px-6 py-3 rounded-full backdrop-blur-sm hover:scale-105 transition-all duration-300 text-center">
                  Jadwal Sholat
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'mosque', judul: 'Tentang Masjid', sub: 'Profil & informasi', href: '#tentang' },
            { icon: 'calendar', judul: 'Kegiatan',        sub: 'Agenda & program',   href: '#layanan' },
            { icon: 'newspaper', judul: 'Berita',           sub: 'Info terkini',       href: '#berita' },
          ].map((item, i) => (
            <Reveal key={item.judul} delay={i * 100}>
              <a href={item.href}
                 className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-[#c9a84c]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[#0d3d2b]/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#c9a84c]/20 transition-colors">
                  <FeatureIcon name={item.icon} className="h-5 w-5 text-[#0d3d2b]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#0d3d2b] text-sm">{item.judul}</p>
                  <p className="text-gray-400 text-xs">{item.sub}</p>
                </div>
                <span className="text-gray-300 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section id="tentang" className="relative bg-gray-50 py-20 px-6 overflow-hidden">
        <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.03]" />
        <div className="max-w-6xl mx-auto relative">
          <Reveal>
            <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Tentang Kami</p>
            <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Masjid Lathifah</h2>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Masjid Lathifah adalah masjid yang berlokasi di lingkungan perumahan, menjadi
                  pusat kegiatan ibadah dan sosial masyarakat setempat. Dikelola oleh Dewan
                  Kemakmuran Masjid (DKM) Lathifah, masjid ini terbuka untuk seluruh jamaah.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Dengan fasilitas yang terus dikembangkan, Masjid Lathifah hadir untuk melayani
                  kebutuhan ibadah dan kegiatan keagamaan warga sekitar setiap harinya.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <Image src="/masjid-2.jpg" alt="Masjid Lathifah" fill className="object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── LAYANAN ── */}
      <section id="layanan" className="relative bg-white py-20 px-6 overflow-hidden">
        <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.03]" />
        <div className="max-w-6xl mx-auto relative">
          <Reveal>
            <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Layanan Kami</p>
            <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Kegiatan & Fasilitas</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAYANAN.map((l, i) => (
              <Reveal key={l.judul} delay={i * 100}>
                <div className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-[#c9a84c]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="mb-4 text-[#0d3d2b]"><FeatureIcon name={l.icon} className="h-8 w-8" /></div>
                  <h3 className="font-bold text-[#0d3d2b] mb-2">{l.judul}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{l.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MIMBAR JUMAT ── */}
      <SectionMimbarJumat />

      {/* ── BERITA ── */}
      <SectionBerita />

      {/* ── GALERI ── */}
      <section id="galeri" className="relative bg-gray-50 py-20 px-6 overflow-hidden">
        <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.03]" />
        <div className="max-w-6xl mx-auto relative">
          <Reveal>
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Galeri</p>
                <h2 className="text-[#0d3d2b] text-3xl font-bold">Dokumentasi Masjid</h2>
              </div>
              <Link href="/galeri" className="text-[#0d3d2b] text-sm font-semibold hover:text-[#c9a84c] transition-colors whitespace-nowrap">
                Lihat Semua →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galeri.slice(0, 3).map((item, i) => (
              <Reveal key={item.id} delay={i * 100}>
                <div className="relative h-56 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <Image src={item.img} alt={item.judul || `Foto masjid ${i+1}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" unoptimized={item.img.startsWith('http')} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── JADWAL SHOLAT ── */}
      <SectionJadwal />

      {/* ── PENGURUS DKM ── */}
      <SectionPengurus />

      {/* ── MITRA ── */}
      <SectionMitra />

      {/* ── LOKASI ── */}
      <section id="lokasi" className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Lokasi</p>
            <h2 className="text-[#0d3d2b] text-3xl font-bold">Temukan Masjid Lathifah</h2>
            <p className="text-gray-500 text-sm mt-2">Masjid Jami&apos; Lathifah GSA</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg">
            <iframe
              title="Lokasi Masjid Jami' Lathifah GSA"
              src={GOOGLE_MAPS_EMBED_URL}
              className="w-full h-[320px] md:h-[420px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-5 bg-[#0d3d2b] hover:bg-[#0a2e21] text-white font-semibold px-5 py-3 rounded-full transition-colors"
          >
            Buka navigasi Google Maps <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0d3d2b] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-full" />
              <p className="font-bold">Masjid Lathifah</p>
            </div>
            <p className="text-white/50 text-sm max-w-xs">Pusat ibadah dan kegiatan keagamaan masyarakat.</p>
          </div>
          <div>
            <p className="font-semibold mb-3 text-[#c9a84c]">Kontak</p>
            <p className="text-white/60 text-sm">Masjid Jami&apos; Lathifah GSA</p>
            <p className="text-white/60 text-sm">Gunung Sindur, Jawa Barat</p>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-[#c9a84c] hover:text-white text-sm font-semibold transition-colors"
            >
              Lihat lokasi di Google Maps <span aria-hidden="true">→</span>
            </a>
          </div>
          <div>
            <p className="font-semibold mb-3 text-[#c9a84c]">Menu</p>
            {['Beranda','Tentang','Layanan','Berita','Galeri','Lokasi'].map(m => (
              <a key={m} href={`#${m.toLowerCase()}`}
                 className="block text-white/60 hover:text-white text-sm mb-1 transition-colors">{m}</a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-8 pt-6 text-center text-white/30 text-xs">
          © 2026 DKM Masjid Lathifah. Semua hak dilindungi.
        </div>
      </footer>
    </>
  )
}