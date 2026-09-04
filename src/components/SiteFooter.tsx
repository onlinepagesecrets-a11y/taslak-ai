import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Taslak AI</span>
      <nav className="site-footer__links">
        <Link href="/legal/terms">Kullanım Koşulları</Link>
        <Link href="/legal/privacy">Gizlilik Politikası</Link>
        <Link href="/legal/refund">İade Politikası</Link>
        <Link href="/pricing">Fiyatlandırma</Link>
      </nav>
    </footer>
  );
}
