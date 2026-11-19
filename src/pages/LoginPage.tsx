import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  LogOut,
  Mail,
  Shield,
} from 'lucide-react';
import { GoogleSignInButton } from '../components/ui/GoogleSignInButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function LoginPage() {
  useDocumentTitle(
    'Sign in with Google',
    'Sign in to HostelMate with your Google email account to organize your Dehradun hostel shortlist and pilot preferences.'
  );

  const { user, loading, signingIn, authError, signInWithGoogle, logout } = useAuth();
  const { showToast, shortlist } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state as { from?: string } | null)?.from || '/listings';

  const handleSignIn = async () => {
    const signedIn = await signInWithGoogle();
    if (signedIn) {
      showToast(
        `Signed in as ${signedIn.email || signedIn.displayName || 'Google user'}.`,
        'success'
      );
      if (redirectTo && redirectTo !== '/login') {
        navigate(redirectTo);
      }
    }
  };

  const handleSignOut = async () => {
    await logout();
    showToast('Signed out of your Google account.', 'info');
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 animate-pulse space-y-4">
          <div className="h-6 w-1/2 bg-slate-200 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-11 w-full bg-slate-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 space-y-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Google profile photo'}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full border border-slate-200 object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-800 font-display font-bold text-xl flex items-center justify-center shrink-0">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold text-slate-900 truncate">
                {user.displayName || 'HostelMate Student'}
              </h1>
              <p className="text-sm text-slate-600 flex items-center gap-1.5 truncate mt-0.5">
                <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                <span className="truncate">{user.email}</span>
              </p>
              {user.emailVerified && (
                <p className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Verified Google email</span>
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Your signed-in pilot benefits</p>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>
                Your shortlist ({shortlist.length} saved) and compare list are linked to your
                Google account on this browser.
              </li>
              <li>
                Your name and Google email automatically pre-fill the Early-Access Pilot and
                Prototype Feedback forms.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/shortlist"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>View Shortlist</span>
            </Link>
            <Link
              to="/pilot"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              <span>Join Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <Link
              to="/listings"
              className="text-xs font-semibold text-slate-600 hover:text-teal-800"
            >
              Browse Dehradun listings
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-teal-800">
            HostelMate Dehradun Pilot
          </p>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Sign in with your Google email
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Use your Google account to save your Dehradun hostel shortlist under your profile and
            auto-fill your student pilot registration.
          </p>
        </div>

        <div className="space-y-3">
          <GoogleSignInButton
            onClick={handleSignIn}
            loading={signingIn}
            label="Continue with Google"
            fullWidth
          />

          {authError && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 leading-relaxed"
            >
              {authError}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
          <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-800 mb-0.5">Minimal permissions</p>
            <p>
              We only request your Google email address and basic profile name/photo to identify
              your account. We never access your Gmail messages, Drive files, or Calendar.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Prefer to browse without signing in?{' '}
          <Link to="/listings" className="font-semibold text-teal-800 hover:underline">
            Explore listings as a guest
          </Link>
        </p>
      </div>
    </div>
  );
}
