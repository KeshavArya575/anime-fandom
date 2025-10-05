// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  UsersIcon,
  FilmIcon,
  BarChart3Icon,
  BookOpenIcon,
  ChevronsUpDownIcon,
} from 'lucide-react';

export default function Sidebar() {
  const [isBrowseOpen, setIsBrowseOpen] = useState(true);

  return (
    // Main sidebar container with dark theme classes
    <aside className="flex w-64 flex-col gap-y-5 overflow-y-auto border-r bg-background px-6">
      <div className="flex h-16 shrink-0 items-center text-xl font-bold">
        AF AnimeFandom
      </div>
      
      <nav className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-y-7">
          
          {/* --- Collapsible Browse Section --- */}
          <Collapsible open={isBrowseOpen} onOpenChange={setIsBrowseOpen}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground">Browse</h3>
              <CollapsibleTrigger asChild>
                
                
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-1 mt-2">
              <Button variant="ghost" className="w-full justify-start gap-x-3" asChild>
                <Link href="/characters"><UsersIcon className="h-4 w-4" /> Characters</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-x-3" asChild>
                <Link href="/series"><FilmIcon className="h-4 w-4" /> Series</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-x-3" asChild>
                <Link href="/popularity"><BarChart3Icon className="h-4 w-4" /> Popularity</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-x-3" asChild>
                <Link href="#"><BookOpenIcon className="h-4 w-4" /> Wiki</Link>
              </Button>
            </CollapsibleContent>
          </Collapsible>

       
          
         

        </div>
      </nav>
    </aside>
  );
}