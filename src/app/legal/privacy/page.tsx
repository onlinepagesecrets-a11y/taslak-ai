export const metadata = { title: "Gizlilik Politikası — Taslak AI" };

export default function PrivacyPage() {
  return (
    <main className="page page--legal">
      <div className="card legal-card">
        <p className="legal-disclaimer">
          <strong>Şablon Uyarısı:</strong> Bu metin bir taslaktır. KVKK (6698 sayılı Kanun) uyumu için
          bir hukuk danışmanına inceletmen, veri sorumlusu bilgilerini ([ŞİRKET UNVANI], [ADRES],
          [E-POSTA]) doldurman ve kullandığın gerçek alt işlemcileri (Stripe, Replicate/OpenAI, hosting
          sağlayıcın vb.) bu listeye eklemen gerekir.
        </p>

        <h1>Gizlilik Politikası</h1>
        <p className="legal-updated">Son güncelleme: [TARİH]</p>

        <h2>1. Veri Sorumlusu</h2>
        <p>
          [ŞİRKET UNVANI] (“Taslak AI”), 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”)
          kapsamında veri sorumlusudur. İletişim: [E-POSTA], [ADRES].
        </p>

        <h2>2. Topladığımız Veriler</h2>
        <ul>
          <li><strong>Hesap verileri:</strong> e-posta adresi, ad (opsiyonel), şifre (şifrelenmiş/hash olarak saklanır).</li>
          <li><strong>Replicate API anahtarın:</strong> taslak üretimi için panelden eklediğin kişisel API anahtarı, veritabanında AES-256-GCM ile şifrelenmiş olarak saklanır (bkz. madde 4a).</li>
          <li><strong>Yüklenen görseller:</strong> taslak üretimi için yüklediğin oda/mekân fotoğrafları.</li>
          <li><strong>Abonelik/ödeme verileri:</strong> Stripe tarafından işlenir; kart numarası gibi hassas veriler bizim sunucularımıza ulaşmaz. Bizde yalnızca abonelik durumu, dönem bilgisi ve işlem geçmişi tutulur.</li>
          <li><strong>Kullanım verileri:</strong> üretim geçmişi, IP adresi, tarayıcı bilgisi, log kayıtları.</li>
          <li><strong>Çerezler:</strong> oturum yönetimi için zorunlu çerezler kullanılır (bkz. madde 7).</li>
        </ul>

        <h2>3. Verilerin İşlenme Amaçları</h2>
        <ul>
          <li>Hizmeti sunmak, hesabını yönetmek ve kimlik doğrulaması yapmak,</li>
          <li>Yapay zekâ taslak üretim isteklerini işlemek,</li>
          <li>Ödeme işlemlerini gerçekleştirmek ve faturalandırmak,</li>
          <li>Hizmet kalitesini artırmak, hataları gidermek ve güvenliği sağlamak,</li>
          <li>Yasal yükümlülükleri yerine getirmek (ör. muhasebe kayıtları).</li>
        </ul>

        <h2>4a. API Anahtarının Saklanması (BYOK)</h2>
        <p>
          Taslak AI, taslak üretimi için kendi altyapı anahtarımızı değil, senin panelden eklediğin
          kişisel Replicate API anahtarını kullanır. Bu anahtar, sunucu tarafında AES-256-GCM algoritması
          ile şifrelenerek veritabanında saklanır; düz metin olarak hiçbir yerde tutulmaz. Anahtar,
          yalnızca senin taslak üretim isteklerini Replicate’e iletmek için, istek anında çözülüp
          kullanılır. Anahtarını panelden istediğin zaman değiştirebilir veya kaldırabilirsin.
        </p>

        <h2>4b. Yüklenen Fotoğrafların İşlenmesi</h2>
        <p>
          Yüklediğin fotoğraflar, taslak üretimi sırasında (senin kendi API anahtarınla) Replicate
          altyapısına iletilir. Bu sağlayıcı, kendi gizlilik politikası çerçevesinde veriyi işler.
          Fotoğraflar, üretim tamamlandıktan sonra
          [SÜRE, ör. 30 gün] içinde sunucularımızdan silinir; üretilen sonuç görseli hesabında geçmiş
          olarak saklanmaya devam edebilir.
        </p>

        <h2>5. Verilerin Paylaşılması</h2>
        <p>Verilerini yalnızca aşağıdaki amaçlarla ve gerekli ölçüde üçüncü taraflarla paylaşırız:</p>
        <ul>
          <li><strong>Ödeme işlemcisi:</strong> Stripe Inc. (abonelik ödemesi),</li>
          <li><strong>AI model sağlayıcısı:</strong> Replicate (görsel üretim — senin kendi API anahtarınla),</li>
          <li><strong>Hosting/altyapı sağlayıcıları:</strong> [SAĞLAYICI ADI],</li>
          <li>Yasal zorunluluk halinde yetkili kamu kurumları.</li>
        </ul>
        <p>Verilerin yurt dışına aktarımı söz konusuysa, KVKK m.9 kapsamındaki yöntemlerle (açık rıza, Kurul kararı, standart sözleşme vb.) gerçekleştirilir.</p>

        <h2>6. Veri Saklama Süresi</h2>
        <p>
          Hesap verileri, hesabın aktif olduğu süre boyunca ve hesap kapatıldıktan sonra yasal
          yükümlülükler (ör. Vergi Usul Kanunu kapsamında 5-10 yıl saklama) gereği belirtilen süre
          kadar saklanır.
        </p>

        <h2>7. Çerezler</h2>
        <p>
          Hizmet, oturum açık kalması için zorunlu oturum çerezleri kullanır. Bu çerezler olmadan
          hizmete giriş yapamazsın. Şu an için pazarlama/analitik amaçlı üçüncü taraf çerez
          kullanılmamaktadır; kullanılması durumunda bu politika güncellenecek ve gerekli onay
          mekanizması eklenecektir.
        </p>

        <h2>8. KVKK Kapsamındaki Haklarınız</h2>
        <p>KVKK m.11 uyarınca aşağıdaki haklara sahipsin:</p>
        <ul>
          <li>Kişisel verinin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içi/yurt dışı aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>KVKK m.7 şartları oluştuğunda silinmesini/yok edilmesini isteme,</li>
          <li>İşlemenin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhine bir sonucun ortaya çıkmasına itiraz etme,</li>
          <li>Kanuna aykırı işleme nedeniyle zarara uğraman hâlinde zararın giderilmesini talep etme.</li>
        </ul>
        <p>
          Bu haklarını kullanmak için [E-POSTA] adresine yazılı olarak başvurabilirsin. Başvurular
          KVKK’da öngörülen süre (en geç 30 gün) içinde yanıtlanır.
        </p>

        <h2>9. Veri Güvenliği</h2>
        <p>
          Şifreler tek yönlü hash algoritmasıyla (bcrypt) saklanır; hiçbir personel şifrenizi düz metin
          olarak göremez. Replicate API anahtarınız AES-256-GCM ile şifrelenmiş olarak saklanır. Ödeme/
          abonelik verileri PCI-DSS uyumlu Stripe altyapısında işlenir.
        </p>

        <h2>10. Politika Değişiklikleri</h2>
        <p>
          Bu politika zaman zaman güncellenebilir. Önemli değişikliklerde kayıtlı e-posta adresine
          bilgilendirme yapılır.
        </p>

        <h2>11. İletişim</h2>
        <p>Sorularınız için: [E-POSTA]</p>
      </div>
    </main>
  );
}
