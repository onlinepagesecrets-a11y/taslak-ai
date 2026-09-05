import Link from "next/link";

export default function SiteHeader() {
  return (
    <nav className="site-nav">
      <Link href="/" className="site-nav__brand">
        Taslak AI
      </Link>
      <div className="site-nav__links">
        <Link href="/settings" className="site-nav__link">
          Ayarlar
        </Link>
      </div>
    </nav>
  );
}
