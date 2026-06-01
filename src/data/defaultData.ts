/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, Material, Badge } from '../types';

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'aplikasi-skrining',
    name: 'Aplikasi Skrining',
    icon: 'Search',
    color: 'emerald',
    description: 'Metodologi dan aplikasi uji tapis penapisan penyakit secara cepat dan andal pada populasi sehat.',
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'survei-cepat-epi',
    name: 'Survei Cepat Epidemiologi',
    icon: 'Zap',
    color: 'sky',
    description: 'Metode pengumpulan data lapangan dengan teknik klaster 30x7 secara taktis, cepat, dan ekonomis.',
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'p-surveilans-epi',
    name: 'Praktikum Surveilans Epidemiologi',
    icon: 'Activity',
    color: 'indigo',
    description: 'Pengamatan sistematis terus-menerus terhadap distribusi penyakit melalui instrumen SKDR puskesmas.',
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'manajemen-analisis-data',
    name: 'Manajemen dan Analisis Data Epidemiologi',
    icon: 'Database',
    color: 'purple',
    description: 'Prinsip pengolahan data murni kesehatan, pembersihan variabel, regresi linear, dan estimasi Odd Ratio / RR.',
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'telaah-ilmiah',
    name: 'Telaah Ilmiah Epidemiologi',
    icon: 'BookOpen',
    color: 'pink',
    description: 'Kritik akademis jurnal ilmiah kesehatan, mendeteksi bias riset, dan menyusun sintesis PICO.',
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'epi-penyakit-tropis',
    name: 'Epidemiologi Penyakit Tropis',
    icon: 'Shield',
    color: 'amber',
    description: 'Studi persebaran, pencegahan, dan pola inang-vektor dari penyakit khas tropis seperti DBD, Malaria, dan TB.',
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'praktik-investigasi-wabah',
    name: 'Praktik Investigasi Wabah',
    icon: 'Flame',
    color: 'rose',
    description: 'Langkah taktis penyelidikan kejadian luar biasa (KLB), melacak kurva epidemi, dan klasterisasi kasus.',
    createdAt: '2026-06-01T00:00:00Z',
  }
];

export const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'm1',
    subjectId: 'aplikasi-skrining',
    title: 'Validitas Alat Uji Tapis Skrining',
    content: 'Uji skrining dirancang untuk mendeteksi dini penyakit pada individu asimtomatik (tanpa gejala klinis). Instrumen skrining dinilai berdasarkan validitas (Sensitivitas & Spesifisitas) serta keandalan (Reliabilitas).',
    points: [
      'Sensitivitas: Proporsi orang sakit sesungguhnya yang tes skriningnya positif.',
      'Spesifisitas: Proporsi orang sehat sesungguhnya yang tes skriningnya menunjukkan hasil negatif.',
      'False Positive: Hasil tes menunjukkan positif padahal aslinya individu sehat.'
    ],
    formulas: [
      'Sensitivitas = True Positive / (True Positive + False Negative)',
      'Spesifisitas = True Negative / (True Negative + False Positive)',
      'Nilai Prediktif Positif = True Positive / (True Positive + False Positive)'
    ],
    flashcards: [
      {
        id: 'fc-m1-1',
        question: 'Apa perbedaan mendasar antara Skrining dengan Diagnosis?',
        answer: 'Skrining diuji pada kelompok populasi sehat tanpa gejala, sedangkan Diagnosis pada pasien suspek bergejala.',
        level: 0
      },
      {
        id: 'fc-m1-2',
        question: 'Tuliskan rumus Sensitivitas alat uji skrining!',
        answer: 'Sensitivitas = True Positive / (True Positive + False Negative)',
        level: 0
      },
      {
        id: 'fc-m1-3',
        question: 'Apa konsekuensi utama jika sensitivitas tes skrining terlalu rendah?',
        answer: 'Banyak orang sakit yang lolos saringan (False Negative tinggi), menyebabkan kegagalan deteksi dini penyakit.',
        level: 0
      }
    ],
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'm2',
    subjectId: 'survei-cepat-epi',
    title: 'Metode Klaster Dua Tahap WHO 30x7',
    content: 'Survei Cepat Epidemiologi (Rapid Epidemiological Assessment) adalah metode taktis lapangan untuk mendapatkan estimasi cakupan program imunisasi atau status gizi dengan waktu pengerjaan yang singkat dan biaya rendah.',
    points: [
      'Menggunakan teknik sampling klaster dua tahap konvensional.',
      'Tahap 1: Memilih 30 klaster pemukiman secara Probability Proportional to Size (PPS).',
      'Tahap 2: Memilih secara acak sederhana minimal 7 responden per klaster.',
      'Total ukuran sampel minimal adalah 210 responden untuk menjamin ketepatan estimasi.'
    ],
    formulas: [
      'Total Responden = 30 Klaster * 7 Responden = 210 Orang',
      'Interval Kumulatif (untuk pemilihan klaster PPS) = Total Populasi / 30'
    ],
    flashcards: [
      {
        id: 'fc-m2-1',
        question: 'Mengapa metode survei cepat 30x7 banyak dipilih di wilayah tropis miskin?',
        answer: 'Karena tidak membutuhkan peta sampling lengkap di awal, sangat hemat biaya, dan cepat diselesaikan di lapangan.',
        level: 0
      },
      {
        id: 'fc-m2-2',
        question: 'Berapakah jumlah standar minimum responden klaster menurut pedoman WHO?',
        answer: 'Minimal 210 responden (Didapat dari 30 Klaster ditiap klaster terdapat 7 responden).',
        level: 0
      }
    ],
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'm3',
    subjectId: 'p-surveilans-epi',
    title: 'Mekanisme SKDR di Puskesmas',
    content: 'Sistem Kewaspadaan Dini dan Respon (SKDR) dirancang untuk memantau tren penyakit menular berpotensi wabah secara mingguan guna segera memicu respon penanggulangan jika alarm terlewati.',
    points: [
      'Laporan wajib dikirim secara mingguan (setiap hari Senin/Selasa pagi).',
      'Variabel umum mencakup tren demam akut, diare akut, ILI (Influenza Like Illness), dan suspek campak.',
      'Indikator kualitas surveilans: Kelengkapan (completeness) dan Ketepatan waktu (promptness).'
    ],
    formulas: [
      'Kelengkapan (%) = (Jumlah Puskesmas Melapor / Total Target Puskesmas) * 100%',
      'Ketepatan Laporan (%) = (Jumlah Laporan Tepat Waktu / Total Target Laporan) * 100%'
    ],
    flashcards: [
      {
        id: 'fc-m3-1',
        question: 'Apa singkatan dari instrumen SKDR?',
        answer: 'Sistem Kewaspadaan Dini dan Respon (sistem pendeteksian dini potensi wabah mingguan).',
        level: 0
      },
      {
        id: 'fc-m3-2',
        question: 'Sebutkan 3 penyakit utama yang wajib dipantau dalam lembar SKDR!',
        answer: 'Diare Akut, Influenza Like Illness (ILI), Demam Berdarah Dengue (DBD), atau Demam Tifoid.',
        level: 0
      }
    ],
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'm4',
    subjectId: 'manajemen-analisis-data',
    title: 'Ukuran Kekuatan Hubungan: Odd Ratio (OR) dan Relative Risk (RR)',
    content: 'Manajemen analisis epidemiologi membedakan asosiasi berdasarkan desain studi. Studi Kasus Kontrol dianalisis dengan Odd Ratio, sedangkan Studi Kohort dianalisis dengan Relative Risk.',
    points: [
      'Tabel Kontingensi 2x2 digunakan untuk merepresentasikan paparan (Exposure) dan luaran (Disease).',
      'OR menggambarkan kemungkinan terpapar pada kelompok kasus dibanding kelompok kontrol.',
      'Confounding adalah variabel luar yang memiliki hubungan baik dengan faktor paparan maupun disease.'
    ],
    formulas: [
      'Odds Ratio (OR) = (a * d) / (b * c) [Dimana a=kasus terpapar, d=kontrol tidak terpapar]',
      'Relative Risk (RR) = [a / (a + b)] / [c / (c + d)] (mengukur insidensi kelompok terpapar vs tidak terpapar)'
    ],
    flashcards: [
      {
        id: 'fc-m4-1',
        question: 'Kapankah kita menggunakan Odds Ratio (OR) alih-alih Relative Risk (RR)?',
        answer: 'Saat desain penelitian yang kita gunakan adalah Case-Control (Kasus-Kontrol), di mana angka insidensi sesungguhnya tidak bisa dihitung.',
        level: 0
      },
      {
        id: 'fc-m4-2',
        question: 'Apakah yang dimaksud dengan Confounding Factor dalam analisis data?',
        answer: 'Variabel perancu yang bias mengaburkan hubungan asosiasi sebenarnya antara paparan utama dan penyakit.',
        level: 0
      }
    ],
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'm5',
    subjectId: 'telaah-ilmiah',
    title: 'Critical Appraisal Artikel Jurnal Epidemiologi',
    content: 'Melakukan penelaahan kritis terhadap literatur kedokteran dan kesehatan masyarakat agar tidak terjebak hasil penelitian semu yang disebabkan kesalahan desain riset.',
    points: [
      'Menggunakan panduan baku kritisi (misalnya kuesioner CASP atau STROBE).',
      'Mengevaluasi validitas internal (metodologi bebas bias) dan validitas eksternal (generalisasi populasi).',
      'Pernyataan PICO membantu merumuskan komponen telaah secara cepat.'
    ],
    formulas: [
      'PICO = Population / Patient, Intervention / Exposure, Comparison / Control, Outcome'
    ],
    flashcards: [
      {
        id: 'fc-m5-1',
        question: 'Sebutkan 3 jenis bias utama yang harus dievaluasi saat menelaah jurnal!',
        answer: 'Selection Bias (bias seleksi sampel), Information/Measurement Bias (bias informasi), dan Confounding Bias.',
        level: 0
      },
      {
        id: 'fc-m5-2',
        question: 'Apakah urutan teratas bukti ilmiah (Highest Hierarchy of Evidence)?',
        answer: 'Systematic Review / Meta-analysis dari Randomised Controlled Trials (RCT).',
        level: 0
      }
    ],
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'm6',
    subjectId: 'epi-penyakit-tropis',
    title: 'Rantai Penularan Virus Dengue',
    content: 'Penyakit tropis menular yang disebabkan virus Dengue (famili Flaviviridae) yang ditransmisikan melalui gigitan nyamuk betina genus Aedes, terutama spesies Aedes aegypti.',
    points: [
      'Trias Epidemiologi: Agent (Dengue virus), Host (Manusia), Environment (Genangan air jernih, suhu tropis).',
      'Siklus hidup nyamuk membutuhkan genangan air buatan dalam ruangan (bak mandi, vas bunga).',
      'Indikator keberhasilan program dikur dengan Angka Bebas Jentik.'
    ],
    formulas: [
      'Angka Bebas Jentik (ABJ %) = (Jumlah Rumah Bebas Jentik / Total Rumah Diperiksa) * 100%'
    ],
    flashcards: [
      {
        id: 'fc-m6-1',
        question: 'Sebutkan nama nyamuk vektor primer penular penyakit demam berdarah dengu!',
        answer: 'Aedes aegypti betina!',
        level: 0
      },
      {
        id: 'fc-m6-2',
        question: 'Berapakah target standar nasional program untuk Angka Bebas Jentik (ABJ)?',
        answer: 'Harus mencapai 95% atau lebih tinggi guna mencegah ledakan siklus KLB.',
        level: 0
      }
    ],
    createdAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'm7',
    subjectId: 'praktik-investigasi-wabah',
    title: 'Sepuluh Langkah Investigasi KLB CDC',
    content: 'Investigasi wabah adalah penyelidikan lapangan yang dirancang untuk melacak penyebab kejadian luar biasa (KLB) penyakit agar tindakan isolasi dan penghentian paparan segera diambil.',
    points: [
      'Langkah paling awal adalah mempersiapkan kerja lapangan dan memverifikasi diagnosis.',
      'Mendefinisikan kasus secara ketat (Confirm Case, Probable Case, Suspect Case).',
      'Menggambar Kurva Epidemi (Epidemic Curve) berdasarkan waktu timbul gejala pasien.'
    ],
    formulas: [
      'Attack Rate (%) = (Jumlah kasus baru pada selang waktu tertentu / Jumlah populasi berisiko) * 100%',
      'Case Fatality Rate (CFR %) = (Jumlah kematian akibat penyakit tersebut / Total kasus penyakit tersebut) * 100%'
    ],
    flashcards: [
      {
        id: 'fc-m7-1',
        question: 'Apakah perbedaan bentuk kurva epidemi tipe Point Source dibanding Propagated Source?',
        answer: 'Point Source menunjukkan satu lonjakan puncak tunggal yang cepat mereda; Propagated menunjukkan serangkaian puncak beruntun seiring penularan sekunder orang-ke-orang.',
        level: 0
      },
      {
        id: 'fc-m7-2',
        question: 'Apa ukuran mortalitas klinis utama dari tingkat keganasan wabah?',
        answer: 'Case Fatality Rate (CFR) = (Jumlah meninggal / Jumlah kasus terdiagnosis) * 100%.',
        level: 0
      }
    ],
    createdAt: '2026-06-01T00:00:00Z'
  }
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'first-step',
    name: 'Petualang Pertama',
    description: 'Memulai perjalanan belajar persiapan UAS.',
    icon: '🌱',
    requirement: 'Buka aplikasi untuk pertama kali.'
  },
  {
    id: 'material-creator',
    name: 'Kolektor Ilmu',
    description: 'Menambahkan materi belajar pertamamu secara mandiri.',
    icon: '📚',
    requirement: 'Tambahkan 1 materi baru ke dalam aplikasi.'
  },
  {
    id: 'quiz-master',
    name: 'Bintang Kelas',
    description: 'Menyelesaikan kuis belajarmu dengan skor sempurna!',
    icon: '✨',
    requirement: 'Selesaikan kuis dengan jawaban benar semua.'
  },
  {
    id: 'xp-warrior',
    name: 'Ksatria XP',
    description: 'Mencapai total XP sebesar 200.',
    icon: '🏆',
    requirement: 'Kumpulkan total akumulasi XP sebanyak 200.'
  },
  {
    id: 'focus-expert',
    name: 'Konsentrasi Mew',
    description: 'Berhasil melakukan sesi belajar tenang di Mode Fokus selama 5 menit.',
    icon: '🐱',
    requirement: 'Selesaikan sesi Timer Mode Fokus minimal 5 menit.'
  },
  {
    id: 'streak-keeper',
    name: 'Anak Rajin',
    description: 'Memepertahankan semangat belajar dengan rekor belajar berturut-turut.',
    icon: '🔥',
    requirement: 'Dapatkan streak belajar minimal 2 hari berturut-turut.'
  },
  {
    id: 'game-champion',
    name: 'Pemenang Game Memori',
    description: 'Berhasil memenangkan mini game memori mencocokkan kartu materi.',
    icon: '🃏',
    requirement: 'Selesaikan mini game Matching Card term-definition.'
  },
  {
    id: 'level-up-pioneer',
    name: 'Paling Jago',
    description: 'Mendaki ke Level 3 atau lebih tinggi.',
    icon: '👑',
    requirement: 'Capai Level 3 belajar.'
  }
];
