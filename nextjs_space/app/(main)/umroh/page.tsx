import UmrohClient from './_components/umroh-client';

export function generateMetadata() {
  return {
    title: 'Panduan Umrah - Jariyah',
    description: 'Panduan ringkas tata cara umrah lengkap dengan doa dan bacaan Arab, transliterasi, dan keterangan praktis.',
  };
}

export default function UmrohPage() {
  return <UmrohClient />;
}
