import CardClient from './CardClient';

export const dynamic = 'force-dynamic'; // บอก Next.js ว่าหน้านี้เป็น dynamic จริง ๆ

interface CardPageProps {
  params: { name: string };
}

export default function CardPage({ params }: CardPageProps) {
  const decodedName = decodeURIComponent(params.name);
  return <CardClient name={decodedName} />;
}