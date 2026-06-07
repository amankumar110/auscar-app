import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onAddCar: () => void;
}

export default function Header({ onAddCar }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg
            className="w-8 h-8 text-red-600"
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
          <span className="text-xl font-bold text-red-600 tracking-tight">AusCar</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddCar}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
          >
            + Add Car
          </button>
          <div className="flex items-center gap-2">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName ?? "User"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
