import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg
            className="w-12 h-12 text-red-600"
            viewBox="0 0 64 64"
            fill="currentColor"
          >
            <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="32" cy="32" r="10" />
            <line x1="32" y1="2" x2="32" y2="22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="32" y1="42" x2="32" y2="62" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="2" y1="32" x2="22" y2="32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="42" y1="32" x2="62" y2="32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="9.4" y1="9.4" x2="23.5" y2="23.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="40.5" y1="40.5" x2="54.6" y2="54.6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="54.6" y1="9.4" x2="40.5" y2="23.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="23.5" y1="40.5" x2="9.4" y2="54.6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="text-4xl font-bold text-red-600 tracking-tight">
            AusCar
          </span>
        </div>

        <p className="text-gray-500 text-center text-base leading-relaxed">
          Car inventory & price management for Australian part-time sellers
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-red-500 hover:shadow-md rounded-xl px-6 py-4 text-gray-700 font-semibold text-base transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 text-center">
          Your data is private and stored securely.
        </p>
      </div>
    </div>
  );
}
