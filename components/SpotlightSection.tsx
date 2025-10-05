// components/SpotlightSection.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SpotlightSection({ featuredSeries, trendingCharacters }: { featuredSeries: any, trendingCharacters: any[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.section
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* --- Main Spotlight Card (Left) --- */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">{featuredSeries.title}</CardTitle>
            <CardDescription>{featuredSeries.category}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <p className="text-muted-foreground flex-grow">{featuredSeries.description}</p>
            <div className="mt-6">
              <Link href={featuredSeries.href}>
                <Button>View Series &rarr;</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- Trending Characters (Right) --- */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Trending Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {trendingCharacters.map((char: any) => (
                <li key={char.id}>
                  <Link href={`/character/${char.id}`} className="group flex items-center gap-x-4">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                      <Image src={char.image.large} alt={char.name.full} fill className="object-cover" />
                    </div>
                    <p className="font-medium text-foreground group-hover:text-primary">{char.name.full}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}