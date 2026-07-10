'use client';

import React, { useState } from 'react';
import { Sun, Moon, Copy, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/layouts/page-header';

interface DzikirItem {
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  source: string;
  fadhilah?: string;
}

const dzikirPagi: DzikirItem[] = [
  {
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: "A'ūdzu billāhi minasy-syaithānir rajīm",
    translation: 'Aku berlindung kepada Allah dari godaan setan yang terkutuk.',
    count: 1,
    source: 'Pembuka dzikir',
  },
  {
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration: 'Ashbahnā wa ashbahal mulku lillāh, walhamdu lillāh, lā ilāha illallāhu wahdahū lā syarīka lah, lahul mulku wa lahul hamdu wa huwa \'alā kulli syai\'in qadīr. Rabbi as\'aluka khaira mā fī hādzal yaum wa khaira mā ba\'dah, wa a\'ūdzu bika min syarri mā fī hādzal yaum wa syarri mā ba\'dah. Rabbi a\'ūdzu bika minal kasali wa sū\'il kibar. Rabbi a\'ūdzu bika min \'adzābin fin nāri wa \'adzābin fil qabr.',
    translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah yang berhak disembah kecuali Allah saja, tiada sekutu bagi-Nya, milik-Nya kerajaan dan bagi-Nya pujian, dan Dia Maha Kuasa atas segala sesuatu. Ya Rabbku, aku memohon kepada-Mu kebaikan hari ini dan kebaikan sesudahnya, dan aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Ya Rabbku, aku berlindung kepada-Mu dari kemalasan dan kejelekan usia tua. Ya Rabbku, aku berlindung kepada-Mu dari siksa neraka dan siksa kubur.',
    count: 1,
    source: 'HR. Muslim (no. 2723)',
  },
  {
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allāhumma bika ashbahnā, wa bika amsainā, wa bika nahyā, wa bika namūtu, wa ilaikan nusyūr.',
    translation: 'Ya Allah, dengan-Mu kami memasuki pagi, dengan-Mu kami memasuki petang, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu kami dibangkitkan.',
    count: 1,
    source: 'HR. At-Tirmidzi (no. 3391), Abu Dawud (no. 5068)',
  },
  {
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa ana 'abduka, wa ana 'alā 'ahdika wa wa'dika mastatha'tu, a'ūdzu bika min syarri mā shana'tu, abū'u laka bini'matika 'alayya, wa abū'u bidzanbī faghfir lī, fa innahū lā yaghfirudz dzunūba illā anta.",
    translation: 'Ya Allah, Engkau adalah Rabbku, tidak ada ilah yang berhak disembah kecuali Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian-Mu dan janji-Mu semampuku. Aku berlindung kepada-Mu dari kejahatan yang telah aku lakukan. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, maka ampunilah aku, karena tidak ada yang dapat mengampuni dosa kecuali Engkau.',
    count: 1,
    source: 'HR. Al-Bukhari (no. 6306)',
    fadhilah: 'Barangsiapa mengucapkannya di waktu pagi dengan penuh keyakinan, lalu ia mati pada hari itu, maka ia masuk surga.'
  },
  {
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    transliteration: "Allāhumma innī as'alukal 'āfiyah fid dunyā wal ākhirah. Allāhumma innī as'alukal 'afwa wal 'āfiyah fī dīnī wa dunyāya wa ahlī wa mālī. Allāhummastur 'aurātī wa āmin rau'ātī. Allāhummahfazhnī min bayni yadayya wa min khalfī wa 'an yamīnī wa 'an syimālī wa min fauqī, wa a'ūdzu bi 'azhamatika an ughtāla min tahtī.",
    translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu keselamatan di dunia dan akhirat. Ya Allah, aku memohon kepada-Mu ampunan dan keselamatan dalam agamaku, duniaku, keluargaku, dan hartaku. Ya Allah, tutupilah auratku dan tenteramkanlah ketakutanku. Ya Allah, jagalah aku dari depan, belakang, kanan, kiri, dan atasku. Aku berlindung dengan keagungan-Mu dari dibenamkan dari bawahku.',
    count: 1,
    source: 'HR. Abu Dawud (no. 5074), Ibnu Majah (no. 3871)',
  },
  {
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhānallāhi wa bihamdih.',
    translation: 'Maha Suci Allah dan dengan memuji-Nya.',
    count: 100,
    source: 'HR. Muslim (no. 2691)',
    fadhilah: 'Barangsiapa mengucapkan "Subhanallah wa bihamdih" 100 kali dalam sehari, maka dihapuskan dosa-dosanya walaupun sebanyak buih di lautan.'
  },
  {
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Lā ilāha illallāhu wahdahū lā syarīka lah, lahul mulku wa lahul hamdu wa huwa 'alā kulli syai'in qadīr.",
    translation: 'Tidak ada ilah yang berhak disembah kecuali Allah saja, tiada sekutu bagi-Nya, milik-Nya kerajaan dan bagi-Nya pujian, dan Dia Maha Kuasa atas segala sesuatu.',
    count: 10,
    source: 'HR. Al-Bukhari dan Muslim',
    fadhilah: 'Barangsiapa mengucapkannya 10 kali, maka ditulis baginya 10 kebaikan, dihapus 10 keburukan, dan dinaikkan 10 derajat.'
  },
];

const dzikirPetang: DzikirItem[] = [
  {
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: "A'ūdzu billāhi minasy-syaithānir rajīm",
    translation: 'Aku berlindung kepada Allah dari godaan setan yang terkutuk.',
    count: 1,
    source: 'Pembuka dzikir',
  },
  {
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration: 'Amsainā wa amsal mulku lillāh, walhamdu lillāh, lā ilāha illallāhu wahdahū lā syarīka lah, lahul mulku wa lahul hamdu wa huwa \'alā kulli syai\'in qadīr. Rabbi as\'aluka khaira mā fī hādzihil lailah wa khaira mā ba\'dahā, wa a\'ūdzu bika min syarri mā fī hādzihil lailah wa syarri mā ba\'dahā...',
    translation: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah. Segala puji bagi Allah, tidak ada ilah yang berhak disembah kecuali Allah saja...',
    count: 1,
    source: 'HR. Muslim (no. 2723)',
  },
  {
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration: 'Allāhumma bika amsainā, wa bika ashbahnā, wa bika nahyā, wa bika namūtu, wa ilaikal mashīr.',
    translation: 'Ya Allah, dengan-Mu kami memasuki petang, dengan-Mu kami memasuki pagi, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu tempat kembali.',
    count: 1,
    source: 'HR. At-Tirmidzi (no. 3391), Abu Dawud (no. 5068)',
  },
  {
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa ana 'abduka, wa ana 'alā 'ahdika wa wa'dika mastatha'tu, a'ūdzu bika min syarri mā shana'tu, abū'u laka bini'matika 'alayya, wa abū'u bidzanbī faghfir lī, fa innahū lā yaghfirudz dzunūba illā anta.",
    translation: 'Ya Allah, Engkau adalah Rabbku, tidak ada ilah yang berhak disembah kecuali Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku berada di atas perjanjian-Mu dan janji-Mu semampuku. Aku berlindung kepada-Mu dari kejahatan yang telah aku lakukan. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, maka ampunilah aku, karena tidak ada yang dapat mengampuni dosa kecuali Engkau.',
    count: 1,
    source: 'HR. Al-Bukhari (no. 6306)',
    fadhilah: 'Barangsiapa mengucapkannya di waktu petang dengan penuh keyakinan, lalu ia mati pada malam itu, maka ia masuk surga.'
  },
  {
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'ūdzu bikalimātillāhit tāmmāti min syarri mā khalaq.",
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk-Nya.',
    count: 3,
    source: 'HR. Muslim (no. 2709), At-Tirmidzi',
  },
  {
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhānallāhi wa bihamdih.',
    translation: 'Maha Suci Allah dan dengan memuji-Nya.',
    count: 100,
    source: 'HR. Muslim (no. 2691)',
  },
];

export default function DzikirClient() {
  const [tab, setTab] = useState<'pagi' | 'petang'>('pagi');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const data = tab === 'pagi' ? dzikirPagi : dzikirPetang;

  const copyText = async (item: DzikirItem, idx: number) => {
    const text = `${item.arabic}\n\n${item.transliteration}\n\n"${item.translation}"\n\n${item.source}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {}
  };

  const shareItem = async (item: DzikirItem) => {
    try {
      await navigator.share({
        text: `${item.arabic}\n\n"${item.translation}"\n\n${item.source}`,
      });
    } catch {}
  };

  return (
    <div>
      <PageHeader title="Dzikir Pagi & Petang" description="Dari Al-Quran & Sunnah yang shahih" />

      {/* Tab */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setTab('pagi')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'pagi'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-card border border-border text-muted-foreground hover:bg-muted/20'
          }`}
        >
          <Sun size={16} />
          Dzikir Pagi
          <span className="text-[10px] opacity-70 ml-1">({dzikirPagi.length})</span>
        </button>
        <button
          onClick={() => setTab('petang')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'petang'
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-card border border-border text-muted-foreground hover:bg-muted/20'
          }`}
        >
          <Moon size={16} />
          Dzikir Petang
          <span className="text-[10px] opacity-70 ml-1">({dzikirPetang.length})</span>
        </button>
      </div>

      {/* Dzikir List */}
      <div className="mt-4 space-y-3 pb-8">
        {data.map((dzikir, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.5) }}
            className="p-4 rounded-xl bg-card border border-border overflow-hidden"
          >
            {/* Count badge */}
            {dzikir.count > 1 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-[11px] font-bold text-primary">×{dzikir.count}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">dibaca {dzikir.count} kali</span>
              </div>
            )}

            {/* Arabic */}
            <p className="text-2xl leading-[2.3] text-right font-arabic text-foreground mb-3">
              {dzikir.arabic}
            </p>

            {/* Transliteration */}
            <details className="mb-3">
              <summary className="text-xs font-semibold text-primary cursor-pointer hover:text-primary/80 transition-colors">
                Tampilkan Transliterasi
              </summary>
              <p className="text-sm italic text-foreground/70 mt-2">{dzikir.transliteration}</p>
            </details>

            {/* Translation */}
            <p className="text-xs font-semibold text-muted-foreground mb-1">Terjemah:</p>
            <p className="text-sm leading-relaxed text-foreground/80 mb-3">
              {dzikir.translation}
            </p>

            {/* Fadhilah */}
            {dzikir.fadhilah && (
              <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 mb-3">
                <p className="text-[11px] font-semibold text-amber-500 mb-0.5">KEUTAMAAN:</p>
                <p className="text-xs text-foreground/70 leading-relaxed">{dzikir.fadhilah}</p>
              </div>
            )}

            {/* Source + Actions */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-muted-foreground">{dzikir.source}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => shareItem(dzikir)}
                  className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Share2 size={13} className="text-muted-foreground" />
                </button>
                <button
                  onClick={() => copyText(dzikir, i)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    copiedIndex === i ? 'bg-primary/15' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {copiedIndex === i ? (
                    <Check size={13} className="text-primary" />
                  ) : (
                    <Copy size={13} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
