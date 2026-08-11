import { NavLink } from "react-router-dom";
import {
  X,
  User,
  Package,
  ShoppingCart,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../features/auth/authSlice";
/* ------------------------------------------------------------------ */
/* Dummy user — replace with real auth/user context.                   */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { label: "Profile", to: "/profile", icon: User },
  { label: "My Orders", to: "/orders", icon: Package },
  { label: "My Cart", to: "/cart", icon: ShoppingCart },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const {
    userAuthStatus: { data },
    auth: { loading },
  } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(userLogout()).unwrap();
    window.location.reload();
  };
const USER = data?.data

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onClose(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85%] bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
          <span className="text-base font-bold text-gray-900">Menu</span>
          <button
            onClick={() => onClose(false)}
            aria-label="Close menu"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile summary */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 shrink-0">
          {USER?.avatar ? (
            <img
              src={USER.avatar}
              alt={USER.username}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-sm font-bold text-[#2563eb] shrink-0">
              {getInitials(USER.username)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {USER.username}
            </p>
            <p className="text-xs font-medium text-gray-500 truncate">
              {USER.email}
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#2563eb]/10 text-[#2563eb]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4.5 h-4.5" />
                {label}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100 shrink-0">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 cursor-pointer py-2.5 rounded-xl text-sm font-semibold text-[#dc2626] hover:bg-[#dc2626]/5 transition-all duration-200"
            >
              <LogOut className="w-4.5 h-4.5" />
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
