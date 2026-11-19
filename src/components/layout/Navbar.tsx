import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Home, LogOut, Menu, User as UserIcon, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { shortlist, compareIds, showToast } = useApp();
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    setMobileOpen(false);
    await logout();
    showToast('Signed out of your Google account.', 'info');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
      isActive
        ? 'text-teal-800 border-teal-700'
        : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
    }`;

  const mobileLinkClass = (path: string) =>
    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-teal-50 text-teal-900'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  const displayFirstName =
    user?.displayName?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Account';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 text-slate-900 hover:text-teal-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-teal-700 rounded-md"
        >
          <span className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
            <Home className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            HostelMate
          </span>
        </Link>

        {/* Zone 2: 5 Concise Single-Line Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          <NavLink to="/listings" className={navLinkClass}>
            Browse
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>
            Compare{compareIds.length > 0 ? ` (${compareIds.length})` : ''}
          </NavLink>
          <NavLink to="/shortlist" className={navLinkClass}>
            Shortlist{shortlist.length > 0 ? ` (${shortlist.length})` : ''}
          </NavLink>
          <NavLink to="/tools" className={navLinkClass}>
            Tools
          </NavLink>
          <NavLink to="/operators" className={navLinkClass}>
            Operators
          </NavLink>
        </nav>

        {/* Zone 3: 1 Primary Action / Account Control (Desktop) + Mobile Menu Button */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div ref={menuRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium text-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-teal-700"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {displayFirstName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[110px] truncate">{displayFirstName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              </button>

              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 rounded-xl bg-white border border-slate-200 shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user.displayName || 'Google Account'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/login"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Account overview</span>
                  </Link>
                  <Link
                    to="/pilot"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Join Early-Access Pilot
                  </Link>
                  <Link
                    to="/admin"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Admin Dashboard
                  </Link>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-teal-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
          {user && (
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 mb-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {displayFirstName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {user.displayName || 'Google Account'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 shrink-0"
              >
                Sign out
              </button>
            </div>
          )}

          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/')}>
              <span>Home</span>
            </Link>
            <Link to="/listings" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/listings')}>
              <span>Browse Hostels & PGs</span>
            </Link>
            <Link to="/compare" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/compare')}>
              <span>Compare</span>
              {compareIds.length > 0 && (
                <span className="text-xs font-mono text-teal-800 tabular-nums">{compareIds.length}/3</span>
              )}
            </Link>
            <Link to="/shortlist" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/shortlist')}>
              <span>Shortlist</span>
              {shortlist.length > 0 && (
                <span className="text-xs font-mono text-teal-800 tabular-nums">{shortlist.length}</span>
              )}
            </Link>
            <Link to="/tools" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/tools')}>
              <span>Budget & Checklist Tools</span>
            </Link>
            <Link to="/coming-soon" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/coming-soon')}>
              <span>Coming Soon Lab</span>
            </Link>
            <Link to="/feedback" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/feedback')}>
              <span>Prototype Feedback</span>
            </Link>
            <Link to="/operators" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/operators')}>
              <span>For Hostel / PG Operators</span>
            </Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/about')}>
              <span>About the Pilot</span>
            </Link>
            <Link to="/admin" onClick={() => setMobileOpen(false)} className={mobileLinkClass('/admin')}>
              <span>Admin Dashboard</span>
            </Link>
            <div className="pt-3 mt-2 border-t border-slate-200 space-y-2">
              {!user && (
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Sign in with Google
                </Link>
              )}
              <Link
                to="/pilot"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                Join Free Early-Access Pilot
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
