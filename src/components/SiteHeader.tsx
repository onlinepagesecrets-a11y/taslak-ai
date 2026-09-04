import Link from "next/link";

export default function SiteHeader() {
  return (
    <nav className="site-nav">
      <Link href="/" className="site-nav__brand">
        Taslak AI
      </Link>
    </nav>
  );
}
