import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { PILOT_DISCLAIMER, PRIVACY_DELETE_EMAIL } from '../../data/constants';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-200">
          {/* Brand Summary */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900">
              <span className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Home className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                HostelMate
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              Student-focused discovery and comparison pilot for hostels and PGs in Dehradun, Uttarakhand.
            </p>
            <p className="text-xs text-slate-500">
              Early-stage pilot · Dehradun, India
            </p>
          </div>

          {/* Student Discovery */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">For Students</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/listings" className="hover:text-teal-800 transition-colors">
                  Browse Hostels & PGs
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-teal-800 transition-colors">
                  Compare Side by Side
                </Link>
              </li>
              <li>
                <Link to="/shortlist" className="hover:text-teal-800 transition-colors">
                  My Shortlist
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-teal-800 transition-colors">
                  Budget Estimator & Checklist
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className="hover:text-teal-800 transition-colors">
                  Coming Soon Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Pilot & Community */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Pilot Program</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/pilot" className="hover:text-teal-800 transition-colors">
                  Join Early-Access Pilot
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-teal-800 transition-colors">
                  Prototype Usability Test
                </Link>
              </li>
              <li>
                <Link to="/operators" className="hover:text-teal-800 transition-colors">
                  For Hostel / PG Operators
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-800 transition-colors">
                  About the Pilot & Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Privacy */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Trust & Data</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href={`mailto:${PRIVACY_DELETE_EMAIL}?subject=HostelMate%20Pilot%20-%20Data%20Deletion%20Request`}
                  className="hover:text-teal-800 transition-colors"
                >
                  Request data deletion
                </a>
              </li>
              <li>
                <Link to="/about#privacy" className="hover:text-teal-800 transition-colors">
                  Privacy & Pilot Data Use
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-teal-800 transition-colors">
                  Admin Dashboard (Demo)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Pilot Disclaimer */}
        <div className="pt-8 space-y-4">
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Disclaimer: </strong>
            {PILOT_DISCLAIMER}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} HostelMate Pilot · Built for students moving to Dehradun.</p>
            <p>No brokerage · No in-app payments · Direct provider contact</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
