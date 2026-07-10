'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Clock, ScrollText, PersonStanding, ChevronDown, ChevronRight, BookOpen, CheckCircle2, ArrowLeft
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  arabic?: string;
  latin?: string;
  arti?: string;
  detail: string;
  dalil?: string;
}

const LANGKAH_SHOLAT: { section: string; icon: string; steps: Step[] }[] = [
  {
    section: 'Sebelum Sholat',
    icon: '🧹',
    steps: [
      {
        id: 'niat',
        title: 'Niat dalam Hati',
        detail: 'Niat dilakukan dalam hati, tidak dilafadzkan. Rasulullah ﷺ bersabda: "Sesungguhnya amal itu tergantung niatnya." (HR. Bukhari no. 1, Muslim no. 1907). Niat membedakan jenis sholat (fardhu/sunnah) dan jumlah rakaat.',
        dalil: 'HR. Bukhari no. 1, Muslim no. 1907',
      },
      {
        id: 'takbir',
        title: 'Takbiratul Ihram',
        arabic: 'اللَّهُ أَكْبَرُ',
        latin: 'Allaahu Akbar',
        arti: 'Allah Maha Besar',
        detail: 'Mengangkat kedua tangan sejajar bahu atau telinga sambil mengucapkan takbir. Pandangan mata tertuju ke tempat sujud. Tangan kanan diletakkan di atas tangan kiri di dada.',
        dalil: 'HR. Bukhari no. 735, Muslim no. 390',
      },
    ],
  },
  {
    section: 'Berdiri (Qiyam)',
    icon: '🧍',
    steps: [
      {
        id: 'iftitah',
        title: 'Doa Iftitah',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلٰهَ غَيْرُكَ',
        latin: 'Subhaanakallaahumma wa bihamdika wa tabaarakasmuka wa ta\'aalaa jadduka wa laa ilaaha ghairuk',
        arti: 'Maha Suci Engkau ya Allah, dan dengan memuji-Mu, Maha Berkah nama-Mu, Maha Tinggi kemuliaan-Mu, tidak ada sesembahan yang haq selain Engkau.',
        detail: 'Doa iftitah dibaca setelah takbiratul ihram sebelum membaca Al-Fatihah. Ada beberapa variasi doa iftitah yang shahih, dianjurkan untuk berganti-ganti membacanya. Yang paling masyhur adalah bacaan di atas.',
        dalil: 'HR. Abu Daud no. 775, Tirmidzi no. 243, dishahihkan Al-Albani',
      },
      {
        id: 'taawudz',
        title: 'Ta\'awwudz',
        arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        latin: 'A\'uudzu billaahi minasy-syaithaanir rajiim',
        arti: 'Aku berlindung kepada Allah dari godaan setan yang terkutuk.',
        detail: 'Dibaca sebelum Al-Fatihah pada rakaat pertama. Merupakan realisasi dari perintah Allah: "Apabila kamu membaca Al-Qur\'an, hendaklah kamu meminta perlindungan kepada Allah dari setan yang terkutuk." (QS. An-Nahl: 98)',
        dalil: 'QS. An-Nahl: 98',
      },
      {
        id: 'fatihah',
        title: 'Al-Fatihah',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾',
        latin: 'Bismillaahir rahmaanir rahiim. Alhamdu lillaahi rabbil \'aalamiin. Arrahmaanir rahiim. Maaliki yaumid diin. Iyyaaka na\'budu wa iyyaaka nasta\'iin. Ihdinash shiraathal mustaqiim. Shiraathal ladziina an\'amta \'alaihim ghairil maghdhuubi \'alaihim wa ladh dhaalliin.',
        arti: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan. Tunjukilah kami jalan yang lurus. (Yaitu) jalan orang-orang yang telah Engkau beri nikmat, bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
        detail: 'Wajib dibaca di setiap rakaat. Rasulullah ﷺ bersabda: "Tidak ada sholat bagi orang yang tidak membaca Al-Fatihah." (HR. Bukhari no. 756, Muslim no. 394). Disunnahkan membaca dengan tartil (perlahan), berhenti di setiap akhir ayat.',
        dalil: 'HR. Bukhari no. 756, Muslim no. 394',
      },
      {
        id: 'amin',
        title: 'Mengucapkan Aamiin',
        arabic: 'آمِينَ',
        latin: 'Aamiin',
        arti: 'Ya Allah, kabulkanlah.',
        detail: 'Setelah membaca Al-Fatihah, disunnahkan mengucapkan "Aamiin" (dengan memanjangkan). Bagi makmum, mengucapkan bersamaan dengan imam. Nabi ﷺ bersabda: "Apabila imam mengucapkan Aamiin, ucapkanlah Aamiin, karena barangsiapa yang ucapan Aamiin-nya bersamaan dengan Malaikat, akan diampuni dosa-dosanya yang telah lalu." (HR. Bukhari no. 780)',
        dalil: 'HR. Bukhari no. 780, Muslim no. 410',
      },
      {
        id: 'surat',
        title: 'Membaca Surat Al-Qur\'an',
        detail: 'Setelah Al-Fatihah, disunnahkan membaca surat atau beberapa ayat Al-Qur\'an. Pada rakaat pertama dan kedua, dibaca lebih panjang dari rakaat ketiga dan keempat. Khusus sholat Subuh di hari Jumat, disunnahkan membaca surat As-Sajdah (rakaat 1) dan Al-Insan (rakaat 2). Pada sholat Maghrib dan Isya, dianjurkan membaca surat-surat pendek (qishar al-mufashshal).',
        dalil: 'HR. Bukhari no. 759, Muslim no. 451',
      },
    ],
  },
  {
    section: 'Ruku\'',
    icon: '🙇',
    steps: [
      {
        id: 'ruku',
        title: 'Ruku\'',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ (3×)',
        latin: 'Subhaana rabbiyal \'azhiim (3x)',
        arti: 'Maha Suci Tuhanku Yang Maha Agung.',
        detail: 'Setelah selesai membaca surat, bertakbir lalu ruku\'. Kedua tangan memegang lutut, punggung rata (lurus), kepala sejajar dengan punggung. Membaca tasbih minimal 3 kali, maksimal 10 kali. Rasulullah ﷺ membaca tasbih ruku\' dan sujud masing-masing 10 kali (HR. Abu Daud no. 871). Ada beberapa variasi bacaan ruku\' yang shahih.',
        dalil: 'HR. Abu Daud no. 871, Tirmidzi no. 261',
      },
    ],
  },
  {
    section: 'I\'tidal (Bangkit dari Ruku\')',
    icon: '🧍',
    steps: [
      {
        id: 'itidal',
        title: 'I\'tidal',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
        latin: 'Sami\'allaahu liman hamidah',
        arti: 'Allah mendengar orang yang memuji-Nya.',
        detail: 'Bangkit dari ruku\' sambil mengangkat kedua tangan dan membaca "Sami\'allaahu liman hamidah". Setelah berdiri tegak, membaca:\n\nرَبَّنَا وَلَكَ الْحَمْدُ\nRabbanaa wa lakal hamd\n"Ya Rabb kami, bagi-Mu segala puji."\n\nAda beberapa variasi bacaan setelahnya, seperti:\n• Rabbanaa lakal hamd (Ya Rabb kami, bagi-Mu segala puji)\n• Rabbanaa wa lakal hamd hamdan katsiiran thayyiban mubaarakan fiih (segala puji yang banyak, baik, dan diberkahi)',
        dalil: 'HR. Bukhari no. 789, Muslim no. 392',
      },
    ],
  },
  {
    section: 'Sujud',
    icon: '🕌',
    steps: [
      {
        id: 'sujud',
        title: 'Sujud',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى (3×)',
        latin: 'Subhaana rabbiyal a\'laa (3x)',
        arti: 'Maha Suci Tuhanku Yang Maha Tinggi.',
        detail: 'Turun sujud dengan meletakkan 7 anggota tubuh: dahi dan hidung (wajah), dua telapak tangan, dua lutut, dan dua ujung kaki (jari-jari). Menjauhkan lengan dari lambung, perut dari paha. Membaca tasbih minimal 3 kali. Doa yang paling banyak diijabahi adalah saat sujud.',
        dalil: 'HR. Muslim no. 482, Bukhari no. 812',
      },
      {
        id: 'doa-sujud',
        title: 'Doa Saat Sujud',
        arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ',
        latin: 'Allaahummaghfir lii dzanbii kullahu diqqahu wa jillahu wa awwalahu wa aakhirahu wa \'alaaniyatahu wa sirrahu',
        arti: 'Ya Allah, ampunilah dosaku seluruhnya, yang kecil maupun yang besar, yang awal maupun yang akhir, yang tampak maupun yang tersembunyi.',
        detail: 'Ini salah satu doa yang diajarkan Rasulullah ﷺ saat sujud. Boleh juga membaca doa-doa lain yang shahih.',
        dalil: 'HR. Muslim no. 483, Abu Daud no. 878',
      },
    ],
  },
  {
    section: 'Duduk di Antara Dua Sujud',
    icon: '🧎',
    steps: [
      {
        id: 'duduk-dua-sujud',
        title: 'Duduk di Antara Dua Sujud',
        arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
        latin: 'Rabbighfir lii warhamnii wajburnii warfa\'nii warzuqnii wahdinii wa \'aafinii wa\'fu \'annii',
        arti: 'Ya Rabb, ampunilah aku, rahmatilah aku, cukupkanlah aku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, berilah aku kesehatan, dan maafkanlah aku.',
        detail: 'Duduk iftirasy (kaki kiri diduduki, kaki kanan ditegakkan). Bacaan minimal: "Rabbighfir lii" (Ya Rabb, ampunilah aku). Bisa juga membaca doa yang lebih panjang.',
        dalil: 'HR. Abu Daud no. 850, Tirmidzi no. 284, Ibnu Majah no. 898',
      },
    ],
  },
  {
    section: 'Tasyahhud & Sholawat',
    icon: '📿',
    steps: [
      {
        id: 'tasyahud-awal',
        title: 'Tasyahhud Awal (Rakaat 2)',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        latin: 'Attahiyyaatu lillaahi wash shalawaatu wath thayyibaat. Assalaamu \'alaika ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh. Assalaamu \'alainaa wa \'alaa \'ibaadillaahish shaalihiin. Asyhadu an laa ilaaha illallaah, wa asyhadu anna Muhammadan \'abduhu wa rasuuluh.',
        arti: 'Segala penghormatan, sholawat, dan kebaikan hanya milik Allah. Semoga keselamatan, rahmat, dan keberkahan Allah tercurah kepadamu wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang shalih. Aku bersaksi bahwa tiada sesembahan yang haq selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.',
        detail: 'Pada rakaat kedua (sholat 3/4 rakaat), duduk iftirasy dan membaca tasyahhud. Jari telunjuk kanan diisyaratkan (menunjuk) saat membaca kalimat tauhid. Setelah tasyahhud awal, langsung berdiri ke rakaat ketiga.',
        dalil: 'HR. Bukhari no. 1202, Muslim no. 402',
      },
      {
        id: 'sholawat',
        title: 'Sholawat Nabi (Tasyahhud Akhir)',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        latin: 'Allaahumma shalli \'alaa Muhammad wa \'alaa aali Muhammad, kamaa shallaita \'alaa Ibraahiim wa \'alaa aali Ibraahiim, innaka hamiidum majiid. Allaahumma baarik \'alaa Muhammad wa \'alaa aali Muhammad, kamaa baarakta \'alaa Ibraahiim wa \'alaa aali Ibraahiim, innaka hamiidum majiid.',
        arti: 'Ya Allah, limpahkanlah sholawat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau limpahkan sholawat kepada Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berkahilah Muhammad dan keluarga Muhammad, sebagaimana Engkau berkahi Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.',
        detail: 'Dibaca pada tasyahhud akhir (rakaat terakhir) setelah membaca tasyahhud, sebelum salam. Ini adalah sholawat yang paling minimal. Sholawat wajib dibaca dalam tasyahhud akhir.',
        dalil: 'HR. Bukhari no. 3370, Muslim no. 406',
      },
      {
        id: 'doa-sebelum-salam',
        title: 'Doa Sebelum Salam',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
        latin: 'Allaahumma innii a\'uudzu bika min \'adzaabi jahannam, wa min \'adzaabil qabri, wa min fitnatil mahyaa wal mamaat, wa min syarri fitnatil masiihid dajjaal.',
        arti: 'Ya Allah, aku berlindung kepada-Mu dari siksa neraka Jahannam, dari siksa kubur, dari fitnah kehidupan dan kematian, dan dari keburukan fitnah Dajjal.',
        detail: 'Disunnahkan membaca doa perlindungan ini sebelum salam. Boleh juga membaca doa-doa lain yang shahih sesuai kebutuhan.',
        dalil: 'HR. Muslim no. 588, Bukhari no. 1377',
      },
    ],
  },
  {
    section: 'Salam',
    icon: '👋',
    steps: [
      {
        id: 'salam',
        title: 'Salam',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        latin: 'Assalaamu \'alaikum wa rahmatullaah',
        arti: 'Semoga keselamatan dan rahmat Allah tercurah kepada kalian.',
        detail: 'Menoleh ke kanan sambil mengucapkan salam pertama, lalu ke kiri untuk salam kedua. Ini adalah penutup sholat yang menandakan berakhirnya rangkaian ibadah. Rasulullah ﷺ bersabda: "Kunci sholat adalah bersuci, pembukanya adalah takbir, dan penutupnya adalah salam." (HR. Abu Daud no. 61, Tirmidzi no. 3)',
        dalil: 'HR. Abu Daud no. 61, Tirmidzi no. 3, Muslim no. 431',
      },
    ],
  },
];

export default function TataCaraClient() {
  const [expandedSection, setExpandedSection] = useState<string | null>(LANGKAH_SHOLAT[0].section);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (id: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Top Navigation Tabs */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/sholat"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.04] text-white/35 hover:bg-white/80 hover:text-white/85 transition-colors"
        >
          <Clock size={16} /> Waktu Sholat
        </Link>
        <Link
          href="/sholat/tata-cara"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground shadow-sm"
        >
          <PersonStanding size={16} /> Tata Cara
        </Link>
        <Link
          href="/sholat/makna-bacaan"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.04] text-white/35 hover:bg-white/80 hover:text-white/85 transition-colors"
        >
          <ScrollText size={16} /> Makna Bacaan
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-2">
          <Link href="/sholat" className="flex items-center gap-1 text-sm text-white/35 hover:text-emerald-400 transition-colors">
            <ArrowLeft size={16} /> Sholat
          </Link>
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">Tata Cara Sholat Nabi ﷺ</h1>
        <p className="text-sm text-white/35 mt-1">
          Panduan sholat sesuai Sunnah Rasulullah — berdasarkan Sifat Sholat Nabi karya Syaikh Al-Albani
        </p>
      </motion.div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600/15 via-primary/10 to-emerald-600/10 border border-amber-500/10 p-5"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
            <BookOpen size={20} className="text-amber-500" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-foreground">Sholatlah Sebagaimana Kalian Melihatku Sholat</h2>
            <p className="text-xs text-white/35 mt-1 leading-relaxed">
              Sabda Rasulullah ﷺ: <em>"Shalluu kamaa ra-aitumuunii ushallii"</em> — Sholatlah kalian sebagaimana kalian melihatku sholat. 
              (HR. Bukhari no. 631). Panduan ini merujuk pada kitab <em>Sifatu Sholaatin Nabi</em> karya Syaikh Muhammad Nashiruddin Al-Albani rahimahullah.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Langkah-langkah */}
      <div className="space-y-3">
        {LANGKAH_SHOLAT.map((section, idx) => (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
          >
            {/* Section Header */}
            <button
              onClick={() => setExpandedSection(expandedSection === section.section ? null : section.section)}
              className="w-full flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/50 shadow-sm p-4 hover:border-emerald-500/20 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{section.icon}</span>
                <div className="text-left">
                  <h3 className="font-display font-bold text-base text-foreground">{section.section}</h3>
                  <p className="text-xs text-white/35">{section.steps.length} langkah</p>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`text-white/35 transition-transform duration-300 ${expandedSection === section.section ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Section Content */}
            <AnimatePresence initial={false}>
              {expandedSection === section.section && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-2 pl-2 border-l-2 border-emerald-500/20 ml-4">
                    {section.steps.map((step) => {
                      const isExpanded = expandedSteps.has(step.id);
                      return (
                        <div key={step.id} className="rounded-lg bg-card/60 border border-white/30 overflow-hidden">
                          <button
                            onClick={() => toggleStep(step.id)}
                            className="w-full flex items-center justify-between p-3 hover:bg-white/[0.03] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 size={14} className="text-emerald-400" />
                              </div>
                              <span className="text-sm font-medium text-white/85 text-left">{step.title}</span>
                            </div>
                            <ChevronRight
                              size={16}
                              className={`text-white/35 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 space-y-3">
                                  {/* Arabic */}
                                  {step.arabic && (
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">Arab</p>
                                      <p className="text-xl font-arabic leading-relaxed text-right" dir="rtl">{step.arabic}</p>
                                    </div>
                                  )}

                                  {/* Latin */}
                                  {step.latin && (
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">Latin</p>
                                      <p className="text-sm italic text-emerald-400/80">{step.latin}</p>
                                    </div>
                                  )}

                                  {/* Arti */}
                                  {step.arti && (
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">Arti</p>
                                      <p className="text-sm text-white/70 leading-relaxed">{step.arti}</p>
                                    </div>
                                  )}

                                  {/* Detail */}
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">Penjelasan</p>
                                    <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">{step.detail}</p>
                                  </div>

                                  {/* Dalil */}
                                  {step.dalil && (
                                    <div className="flex items-start gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2.5">
                                      <BookOpen size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                      <p className="text-xs text-white/35">{step.dalil}</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6"
      >
        <p className="text-xs text-white/35">
          Sumber: Sifatu Sholaatin Nabi ﷺ — Syaikh Muhammad Nashiruddin Al-Albani rahimahullah<br />
          & Kitab-kitab hadits shahih (Bukhari, Muslim, Abu Daud, Tirmidzi, dll)
        </p>
      </motion.div>
    </div>
  );
}
