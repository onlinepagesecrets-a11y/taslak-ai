export const metadata = { title: "İade Politikası — Taslak AI" };

export default function RefundPage() {
  return (
    <main className="page page--legal">
      <div className="card legal-card">
        <p className="legal-disclaimer">
          <strong>Şablon Uyarısı:</strong> Bu metin bir taslaktır; Mesafeli Sözleşmeler Yönetmeliği ve
          Tüketicinin Korunması Hakkında Kanun kapsamında bir avukata inceletmen önerilir. Dijital
          içerik/hizmet istisnası için kullanıcıdan açık onay alınması (checkout sırasında bir onay
          kutusu) yasal olarak önemlidir.
        </p>

        <h1>İade Politikası</h1>
        <p className="legal-updated">Son güncelleme: [TARİH]</p>

        <h2>1. Genel İlke: İade Yok</h2>
        <p>
          Taslak AI, aylık [10 USD] tutarında tekrarlayan bir abonelik hizmetidir ve{" "}
          <strong>dijital hizmet</strong> niteliğindedir. Her ödeme dönemi başında tahsil edilen ücret,
          o dönem için hizmete erişim sağlandığı anda ifa edilmiş sayılır. Bu nedenle tahsil edilen
          abonelik ücretleri için <strong>para iadesi yapılmamaktadır</strong> — dönem içinde hizmeti az
          kullanmış ya da hiç kullanmamış olman bu kuralı değiştirmez.
        </p>

        <h2>2. Yasal Dayanak</h2>
        <p>
          6502 sayılı Tüketicinin Korunması Hakkında Kanun’a dayanan Mesafeli Sözleşmeler Yönetmeliği
          madde 15/1-ğ uyarınca, “elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında
          teslim edilen gayrimaddi mallara ilişkin sözleşmelerde” cayma hakkı kullanılamaz. Abonelik,
          ödeme onaylandığı anda hesaba tanımlandığından bu istisna kapsamındadır. Satın alma sırasında
          bu husus açıkça onayına sunulur.
        </p>

        <h2>3. İptal ve Otomatik Yenileme</h2>
        <ul>
          <li>Aboneliğin, iptal etmediğin sürece her ay otomatik olarak yenilenir.</li>
          <li>
            İptal işlemini panelindeki “Aboneliği Yönet” bağlantısından (Stripe Müşteri Portalı)
            dilediğin an yapabilirsin.
          </li>
          <li>
            İptal, yalnızca <strong>bir sonraki</strong> dönemin otomatik yenilenmesini durdurur; mevcut
            ödediğin dönemin sonuna kadar hizmete erişimin devam eder. Geçmiş dönem için ödenen ücret
            iade edilmez.
          </li>
        </ul>

        <h2>4. İstisnai Durumlar</h2>
        <p>Aşağıdaki durumlarda, tarafımızın takdirinde, tam veya kısmi iade yapılabilir:</p>
        <ul>
          <li><strong>Mükerrer ödeme:</strong> Aynı dönem için yanlışlıkla iki kez ödeme alındığı teknik olarak doğrulanırsa, fazladan alınan tutar iade edilir.</li>
          <li><strong>Hizmete erişilememesi:</strong> Bizim tarafımızdan kaynaklanan, dönemin tamamına yakınını kapsayan bir kesinti yaşanırsa, orantılı bir iade değerlendirilir.</li>
          <li><strong>Yetkisiz işlem:</strong> Kart sahibinin bilgisi/onayı dışında gerçekleşen ve bankaca doğrulanan işlemlerde, ilgili mevzuat çerçevesinde işlem yapılır.</li>
        </ul>
        <p>
          Not: Kendi Replicate hesabındaki kullanım maliyetleri ve bakiyeler Taslak AI’nin değil,
          doğrudan Replicate’in politikalarına tabidir; bu iade politikası yalnızca Taslak AI abonelik
          ücretini kapsar.
        </p>

        <h2>5. Talep Süreci</h2>
        <p>
          Madde 4 kapsamına girdiğini düşündüğün bir durum için [E-POSTA] adresinden, işlem tarihi ve
          e-posta adresinle birlikte bize ulaşabilirsin. Talepler en geç 14 iş günü içinde
          değerlendirilir.
        </p>

        <h2>6. İletişim</h2>
        <p>Sorularınız için: [E-POSTA]</p>
      </div>
    </main>
  );
}
