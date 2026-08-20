import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full border border-black px-4 py-1.5 text-sm font-semibold transition-colors ${
    isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
  }`;

export function NavBar() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 px-4 py-3 sm:px-8">
      <span className="font-serif text-2xl font-bold tracking-tight">Connections ...</span>
      <nav className="flex gap-2">
        <NavLink to="/play" className={linkClass}>
          Play
        </NavLink>
        <NavLink to="/create" className={linkClass}>
          Create
        </NavLink>
      </nav>
    </header>
  );
}
