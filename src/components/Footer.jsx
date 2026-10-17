const exploreLinks = [
  { label: "Home", href: "#home" },
  { label: "Tour Packages", href: "#packages" },
  { label: "Reviews", href: "#testimonials" },
];

const planLinks = [
  { label: "Get a Quote", href: "#plan" },
  { label: "Contact Us", href: "#plan" },
];

function FooterLinks({ title, links }) {
  return (
    <nav aria-label={title}>
      <h4 className="mb-2 text-base font-semibold text-white">{title}</h4>
      <ul>
        {links.map((link) => (
          <li key={link.label} className="mb-1.5">
            <a href={link.href} className="hover:text-white hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#041720] pt-12 text-[#b9cfd5]">
      <div className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 pb-8 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-head text-xl font-extrabold text-white">World Wide Travel</p>
          <p>Hand-planned trips as always.</p>
        </div>
        <FooterLinks title="Explore" links={exploreLinks} />
        <FooterLinks title="Plan" links={planLinks} />
      </div>
      <div className="mx-auto w-full max-w-[1120px] border-t border-[#1b3946] px-5 py-5">
        <small>&copy; 2026 World Wide Travel. Sultana</small>
      </div>
    </footer>
  );
}

export default Footer;