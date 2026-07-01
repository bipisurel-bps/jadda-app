import { Metadata } from 'next';
import FiqhSafarClient from './_components/fiqh-safar-client';

export const metadata: Metadata = {
  title: 'Panduan Safar — Jadda',
  description: 'Panduan safar: qashar, jamak, puasa musafir, tayammum, dan adab musafir',
};

export default function FiqhSafarPage() {
  return <FiqhSafarClient />;
}
