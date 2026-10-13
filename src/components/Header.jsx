import { navLinks } from "../data/siteData";

function Header() {
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

        <a
          href="#plan"
          className="rounded-full bg-sun px-5 py-3 font-semibold text-deep hover:bg-[#ffc933]"
        >
          Get a Quote
        </a>
      </div>
    </header>
  );
}

export default Header;


