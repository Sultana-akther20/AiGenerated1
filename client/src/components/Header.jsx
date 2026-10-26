import { useState } from "react";
import { navLinks } from "../data/siteData";

function Header({ user, onSignInClick, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-deep text-white">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1120px] items-center justify-between gap-4 px-5">
        <a
          href="#home"
          className="font-head text-lg font-extrabold whitespace-nowrap sm:text-xl"
        >
          World Wide Travel
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="whitespace-nowrap font-medium text-[#cfe3e8] underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-[#cfe3e8] xl:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="whitespace-nowrap text-sm font-semibold underline underline-offset-4 hover:text-sun sm:text-base"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onSignInClick}
              className="whitespace-nowrap text-sm font-semibold underline underline-offset-4 hover:text-sun sm:text-base"
            >
              Sign in
            </button>
          )}

          <a
            href="#plan"
            className="hidden whitespace-nowrap rounded-full bg-sun px-5 py-3 font-semibold text-deep hover:bg-[#ffc933] sm:inline-block"
          >
            Get a Quote
          </a>

          <button
            type="button"
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-2xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-white/20 px-5 pb-4 lg:hidden"
        >
          <ul className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1 font-medium text-[#cfe3e8] hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;