import DzikirClient from './_components/dzikir-client';

export const metadata = {
  title: 'Dzikir Pagi & Petang — Jadda',
  description: 'Dzikir pagi dan petang sesuai Sunnah. Dilengkapi teks Arab, transliterasi, dan terjemahan Indonesia.',
};

export default function DzikirPage() {
  return <DzikirClient />;
}
