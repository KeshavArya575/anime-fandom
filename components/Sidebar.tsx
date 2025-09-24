// components/Sidebar.tsx
import { UserGroupIcon, FilmIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function NavLink({ href, icon: Icon, label, count, active = false }) {
  const activeClasses = 'bg-gray-100 text-gray-900';
  const inactiveClasses = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${active ? activeClasses : inactiveClasses}`}
    >
      {/* This inner div groups the icon and label together */}
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
    <aside className="flex flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 w-64">
      
      <div className="flex h-16 shrink-0 items-center text-xl font-bold">
        AF AnimeFandom
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">Browse</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              <li><NavLink href="#" icon={UserGroupIcon} label="Characters" active={true} /></li>
              <li><NavLink href="#" icon={FilmIcon} label="Series" /></li>
              <li><NavLink href="#" icon={ChartBarIcon} label="Popularity Index" /></li>
              <li><NavLink href="#" icon={BookOpenIcon} label="Wiki" /></li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
}