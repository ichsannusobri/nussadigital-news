'use client';

import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function AuthBar({ user, isDemo, onToggleDemo }) {
  const handleGoogleSignIn = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Google Sign-In Error:", e);
      alert("Sign in failed. You can continue using Demo Mode.");
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout Error:", e);
    }
  };

  return (
    <div className="budget-auth-bar">
      <div className="auth-bar-left">
        <div className="app-badge">
          <span className="app-badge-pill">BETA</span>
          <span className="app-badge-title">NDNews Personal Finance</span>
        </div>
        <div className="demo-toggle-wrap">
          <label className="demo-toggle-label">
            <input
              type="checkbox"
              checked={isDemo}
              onChange={(e) => onToggleDemo(e.target.checked)}
            />
            <span className="slider"></span>
            <span className="toggle-text">{isDemo ? "🎮 Demo Mode" : "🔒 Live Account"}</span>
          </label>
        </div>
      </div>

      <div className="auth-bar-right">
        {user ? (
          <div className="user-profile-box">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || "User"} className="user-avatar-img" />
            ) : (
              <div className="user-avatar-fallback">{user.displayName?.charAt(0) || "U"}</div>
            )}
            <div className="user-details">
              <span className="user-name">{user.displayName || "Google User"}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout" title="Sign Out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </button>
          </div>
        ) : (
          <div className="login-prompt-box">
            <span className="auth-info-text">Link your Google Account to save private budget data securely</span>
            <button onClick={handleGoogleSignIn} className="btn-google-signin">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
