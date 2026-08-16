import { useEffect, useState } from "react";
import {
  Search,
  Menu,
  X,
  ShoppingBag,
  SidebarClose,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { userAuthStatus } from "../../features/auth/authSlice";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const dispatch = useDispatch();

  const {
    userAuthStatus: { data, loading, error: userError },
  } = useSelector((state) => state.auth);

  // Check whether the page has been scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    dispatch(userAuthStatus());
  }, [dispatch]);

  if (userError) {
    console.log(userError ?? "Failed to fetch user data");
  }

  const userData = data?.data;

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* =========================
              LOGO
          ========================== */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="ApexNode Home"
          >
            <ShoppingBag className="w-7 h-7 text-[#2563eb]" />

            <span className="text-xl font-bold cursor-pointer text-gray-900 tracking-tight">
              ApexNode
            </span>
          </Link>

          {/* =========================
              DESKTOP SEARCH
          ========================== */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  w-4.5 h-4.5
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="
                  w-full
                  pl-10 pr-4 py-2.5
                  rounded-xl
                  bg-gray-50
                  border border-gray-200
                  text-sm font-medium
                  text-gray-900
                  placeholder:text-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#2563eb]/40
                  focus:border-[#2563eb]
                  transition-all duration-200
                "
              />
            </div>
          </div>

          {/* =========================
              DESKTOP AUTH
              Hidden on mobile
          ========================== */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#2563eb]" />
            ) : userData ? (
              <>
                <div className="flex w-50 items-center justify-center">
                  <span className=" flex gap-3">
                    Welcome{" "}
                    <p className="font-semibold text-gray-900">
                      {userData?.username?.toUpperCase()}
                    </p>
                  </span>
                </div>

                {/* User sidebar */}
                <SidebarClose
                  className="w-5 h-5 cursor-pointer text-gray-700 hover:text-[#2563eb] transition-colors"
                  onClick={() => setSidebar(true)}
                />
              </>
            ) : (
              <Link to="/auth">
                <button
                  className="
                    px-5 py-2.5
                    text-sm
                    cursor-pointer
                    font-semibold
                    text-white
                    bg-[#2563eb]
                    rounded-xl
                    shadow-sm
                    hover:bg-blue-700
                    hover:shadow-md
                    transition-all duration-300
                  "
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* =========================
              MOBILE CONTROLS
              ========================== */}
          <div className="flex md:hidden items-center gap-1">
            {/* User sidebar button */}
            {userData && (
              <button
                onClick={() => setSidebar(true)}
                aria-label="Open account menu"
                className="
                  p-2
                  rounded-lg
                  text-gray-600
                  hover:bg-gray-100
                  transition-colors duration-200
                "
              >
                <SidebarClose className="w-5 h-5" />
              </button>
            )}

            {/* Mobile search */}
            <button
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label="Toggle search"
              className="
                p-2
                rounded-lg
                text-gray-600
                hover:bg-gray-100
                transition-colors duration-200
              "
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="
                p-2
                rounded-lg
                text-gray-600
                hover:bg-gray-100
                transition-colors duration-200
              "
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* =========================
            MOBILE SEARCH
        ========================== */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  w-4.5 h-4.5
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                className="
                  w-full
                  pl-10 pr-4 py-2.5
                  rounded-xl
                  bg-gray-50
                  border border-gray-200
                  text-sm font-medium
                  text-gray-900
                  placeholder:text-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#2563eb]/40
                  focus:border-[#2563eb]
                  transition-all duration-200
                "
              />
            </div>
          </div>
        )}
      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}
      {mobileMenuOpen && (
        <div
          className="
            md:hidden
            border-t border-gray-100
            bg-white
            px-4 py-4
            space-y-3
          "
        >
          {!userData && !loading && (
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <button
                className="
                  w-full
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  bg-[#2563eb]
                  rounded-xl
                  hover:bg-blue-700
                  transition-all duration-200
                "
              >
                Sign In
              </button>
            </Link>
          )}

          {userData && (
            <div className="py-2 text-sm font-semibold text-gray-700">
              Welcome, {userData?.username}
            </div>
          )}
        </div>
      )}

      {/* =========================
          SIDEBAR
      ========================== */}
      {userData && (
        <Sidebar isOpen={sidebar} onClose={() => setSidebar(false)} />
      )}
    </header>
  );
}
