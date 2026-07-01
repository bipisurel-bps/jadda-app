import { Metadata } from 'next';
import FiqhJenazahClient from './_components/fiqh-jenazah-client';

export const metadata: Metadata = {
  title: 'Panduan Pengurusan Jamaah — Jadda',
  description: 'Tata cara memandikan, mengkafani hingga pemakaman sesuai Sunnah',
};

export default function FiqhJenazahPage() {
  return <FiqhJenazahClient />;
}
