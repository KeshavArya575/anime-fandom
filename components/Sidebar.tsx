// components/Sidebar.tsx
import { UserGroupIcon, FilmIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function NavLink({ href, icon: Icon, label, count, active = false }: any) {
  const activeClasses = 'bg-gray-100 text-gray-900';
  const inactiveClasses = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${active ? activeClasses : inactiveClasses}`}
    >
      <div className="flex items-center">
        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
        <span>{label}</span>
      </div>
      
      {count && (
        <span className="ml-auto text-xs font-medium text-gray-500">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
     
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              <li><NavLink href="/characters" icon={UserGroupIcon} label="Characters" active={true} /></li>
              <li><NavLink href="/series" icon={FilmIcon} label="Series" count={5} /></li>
              <li><NavLink href="/popularity" icon={ChartBarIcon} label="Popularity Index" /></li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
}