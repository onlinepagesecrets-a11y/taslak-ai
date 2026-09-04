export const metadata = { title: "Kullanım Koşulları — Taslak AI" };

export default function TermsPage() {
  return (
    <main className="page page--legal">
      <div className="card legal-card">
        <p className="legal-disclaimer">
          <strong>Şablon Uyarısı:</strong> Bu metin, Taslak AI için hazırlanmış bir taslak sözleşmedir.
          Yayına almadan önce bir avukata (özellikle KVKK, mesafeli satış ve tüketici hukuku alanında)
          inceletmen ve şirket/işletme bilgilerinle ([ŞİRKET UNVANI], [MERSİS/VERGİ NO], [ADRES],
          [E-POSTA]) doldurman gerekir.
        </p>

        <h1>Kullanım Koşulları</h1>
        <p className="legal-updated">Son güncelleme: [TARİH]</p>

        <h2>1. Taraflar ve Kabul</h2>
        <p>
          Bu Kullanım Koşulları (“Koşullar”), [ŞİRKET UNVANI] (“Taslak AI”, “biz”) tarafından işletilen
          taslakai.com (veya ilgili alan adı) üzerinden sunulan hizmetleri (“Hizmet”) kullanan kişi
          (“Kullanıcı”, “sen”) ile Taslak AI arasındaki ilişkiyi düzenler. Hizmete kayıt olarak veya
          kullanarak bu Koşulları kabul etmiş sayılırsın.
        </p>

        <h2>2. Hizmetin Tanımı</h2>
        <p>
          Taslak AI, kullanıcıların yükledikleri oda/mekân fotoğraflarını yapay zekâ modelleri
          aracılığıyla işleyerek tasarım taslakları (görsel çıktılar) üreten bir dijital hizmettir.
          Üretilen görseller yapay zekâ tarafından oluşturulan tahmini görselleştirmelerdir; gerçek
          uygulama sonucunu birebir yansıtacağı garanti edilmez.
        </p>

        <h2>3. Hesap Oluşturma</h2>
        <ul>
          <li>Hizmeti kullanmak için geçerli bir e-posta adresiyle hesap oluşturman gerekir.</li>
          <li>Hesap bilgilerinin gizliliğinden ve hesabın altında gerçekleşen tüm işlemlerden sen sorumlusun.</li>
          <li>18 yaşından küçüklerin hizmeti veli/vasi onayı olmadan kullanması yasaktır.</li>
          <li>Yanlış veya yanıltıcı bilgiyle oluşturulan hesaplar bildirimsiz olarak askıya alınabilir.</li>
        </ul>

        <h2>4. Abonelik ve Kendi API Anahtarın (BYOK)</h2>
        <ul>
          <li>Hizmet, aylık [10 USD] tutarında tekrarlayan (otomatik yenilenen) bir abonelik ile çalışır. Abonelik, uygulama arayüzüne ve özelliklerine erişim sağlar.</li>
          <li>
            Taslak üretimi için kendi Replicate API anahtarını panelinden eklemen gerekir (“Bring Your Own
            Key” / BYOK). Yapay zekâ üretim isteklerinin gerçek maliyeti Taslak AI’ye değil, doğrudan senin
            Replicate hesabına yansır; bu maliyeti yönetmek ve karşılamak senin sorumluluğundadır.
          </li>
          <li>API anahtarın, veritabanımızda sunucu tarafında şifrelenmiş (AES-256-GCM) olarak saklanır ve yalnızca senin adına üretim isteği göndermek için kullanılır.</li>
          <li>Abonelik, iptal edilmediği sürece her ay otomatik olarak yenilenir ve kayıtlı ödeme yöntemine tahsil edilir.</li>
          <li>Aboneliğini istediğin zaman panelden (Stripe Müşteri Portalı) iptal edebilirsin; iptal, mevcut ödeme döneminin sonunda geçerli olur, o ana kadar erişimin devam eder.</li>
        </ul>

        <h2>5. Ödemeler</h2>
        <p>
          Abonelik ödemeleri Stripe altyapısı üzerinden işlenir ve otomatik olarak her ay yenilenir.
          Fiyat [10 USD]/ay olup vergiler uygulanabilir bölgede ayrıca eklenebilir. Ödeme bilgilerin
          doğrudan Stripe tarafından işlenir; kart bilgilerin Taslak AI sunucularında saklanmaz.
        </p>

        <h2>6. İade Politikası</h2>
        <p>
          Taslak AI dijital bir hizmettir. Abonelik ücreti, ilgili dönemin başında tahsil edilir ve o an
          itibarıyla ifa edilmiş kabul edilir. Bu nedenle <strong>iade yapılmaz</strong>; iptal işlemi
          yalnızca bir sonraki dönemin otomatik yenilenmesini durdurur. Ayrıntılar için{" "}
          <a href="/legal/refund">İade Politikası</a> sayfasına bakabilirsin. Bu madde, ilgili tüketici
          mevzuatının emredici hükümleri saklı kalmak kaydıyla uygulanır.
        </p>

        <h2>7. Kullanıcı İçerikleri ve Fikri Mülkiyet</h2>
        <ul>
          <li>Yüklediğin fotoğraflar üzerindeki tüm haklar sana aittir. Bu içerikleri yalnızca hizmeti sana sunmak amacıyla işleriz.</li>
          <li>Başkasına ait, telif hakkıyla korunan veya kişisel verileri (ör. tanınabilir yüzler) içeren içerikleri yükleme sorumluluğu sana aittir.</li>
          <li>Üretilen çıktılar üzerinde, geçerli mevzuat ve kullanılan AI model sağlayıcılarının lisans koşulları çerçevesinde kullanım hakkına sahip olursun.</li>
        </ul>

        <h2>8. Yasak Kullanımlar</h2>
        <p>Aşağıdaki amaçlarla hizmeti kullanamazsın:</p>
        <ul>
          <li>Yasa dışı, aldatıcı veya başkalarının haklarını ihlal eden içerik üretmek,</li>
          <li>Hizmeti tersine mühendislik yapmak veya otomatik/toplu şekilde (bot) kötüye kullanmak,</li>
          <li>Başka bir kişinin rızası olmadan onun görselini/mülkünü yüklemek.</li>
        </ul>

        <h2>9. Hizmet Garantisi Yok / Sorumluluk Sınırlaması</h2>
        <p>
          Hizmet “olduğu gibi” sunulur. Yapay zekâ çıktılarının doğruluğu, kesintisizliği veya belirli
          bir amaca uygunluğu garanti edilmez. Yasaların izin verdiği azami ölçüde, Taslak AI dolaylı,
          arızi veya sonuç niteliğindeki zararlardan sorumlu tutulamaz. Toplam sorumluluğumuz, ilgili
          talebe konu son 12 ay içinde tarafımıza ödediğin toplam tutarla sınırlıdır.
        </p>

        <h2>10. Hizmetin Değiştirilmesi ve Sonlandırılması</h2>
        <p>
          Hizmeti, fiyatlandırmayı veya kredi tarifelerini önceden makul süre önceden bildirerek
          değiştirme hakkını saklı tutarız. Koşulları ihlal eden hesapları askıya alabilir veya
          kapatabiliriz.
        </p>

        <h2>11. Uygulanacak Hukuk</h2>
        <p>
          Bu Koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda [ŞEHİR] Mahkemeleri ve
          İcra Daireleri yetkilidir; tüketici işlemlerinde ilgili Tüketici Hakem Heyeti/Mahkemesi
          yetkisi saklıdır.
        </p>

        <h2>12. İletişim</h2>
        <p>Sorularınız için: [E-POSTA]</p>
      </div>
    </main>
  );
}
