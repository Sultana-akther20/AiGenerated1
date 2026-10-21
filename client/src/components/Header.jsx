import { navLinks } from "../data/siteData";

function Header({ user, onSignInClick, onSignOut }) {
  return (
    <header className="sticky top-0 z-10 bg-deep text-white">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1120px] items-center justify-between gap-6 px-5">
        <a href="#home" className="font-head text-xl font-extrabold">
          World Wide Travel
        </a>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-medium text-[#cfe3e8] underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-[#cfe3e8] sm:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="font-semibold underline underline-offset-4 hover:text-sun"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onSignInClick}
              className="font-semibold underline underline-offset-4 hover:text-sun"
            >
              Sign in
            </button>
          )}

          <a
            href="#plan"
            className="rounded-full bg-sun px-5 py-3 font-semibold text-deep hover:bg-[#ffc933]"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;