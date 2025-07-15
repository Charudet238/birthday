// src/app/card/[name]/page.tsx

import CardClient from './CardClient';

export const dynamic = 'force-dynamic'; // ถ้าต้องการให้ทุกการเข้าถึงเป็น dynamic จริง ๆ

// ประกาศว่า params จะมาในรูป Promise<{ name: string }>
interface CardPageProps {
  params: Promise<{ name: string }>;
}

export default async function CardPage({ params }: CardPageProps) {
  // รอให้ params resolve ก่อน จึงค่อยดึง name ออกมา
  const { name } = await params;

  const decodedName = decodeURIComponent(name);
  return <CardClient name={decodedName} />;
}
