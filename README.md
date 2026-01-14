# 🤖 MathSolver AI - Pro Edition

![Version](https://img.shields.io/badge/version-15.0-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-success)
![Gemini](https://img.shields.io/badge/AI-Gemini%203.0-orange)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**MathSolver AI**, tarayıcınızda karşılaştığınız herhangi bir soruyu (Matematik, Fizik, Tarih, Kimya vb.) ekran görüntüsü yoluyla analiz eden, konunun uzmanı gibi davranarak adım adım çözüm sunan gelişmiş bir Chrome Uzantısıdır.

<p align="center">
  <img src="icon.png" width="128" alt="MathSolver Logo">
</p>

## ✨ Özellikler

- **📋 Pano Entegrasyonu (Süper Hızlı):** İzin pencereleriyle uğraşmayın. İşletim sisteminizin ekran alıntısı aracını kullanın ve sayfaya sadece **`CTRL + V`** yapın.
- **🧠 Uzman Persona Modu:** Yapay zeka sadece cevabı vermez; görseldeki dersi tanır ve o dalın en iyi profesörü gibi pedagojik bir dille anlatır.
- **🎨 Modern Arayüz (Floating Dock):**
  - Ekranın sağında konumlanan, sürüklenebilir (draggable) ve **Koyu Tema (Dark Mode)** kontrol çubuğu.
  - Okuması kolay, göz yormayan **Aydınlık (Light)** sonuç penceresi.
- **🧹 Akıllı Metin Temizleyici:** Karmaşık LaTeX kodlarını (`\frac`, `\cdot`, `$`) otomatik olarak temizler ve herkesin okuyabileceği düzgün, sade bir formata çevirir.
- **🚀 Gemini 3.0 Flash Desteği:** Google'ın en güncel ve hızlı modelleriyle çalışır.
- **🔒 Güvenli:** API anahtarınız sadece tarayıcınızın yerel hafızasında (Chrome Local Storage) saklanır.

## 📂 Dosya Yapısı

```text
MathSolverAI/
├── manifest.json   # Chrome Uzantı yapılandırması (Manifest V3)
├── content.js      # Ana mantık, UI oluşturma ve API iletişimi
├── styles.css      # Modern stil dosyası (Glassmorphism, Animations)
├── icon.png        # Uygulama ikonu
└── README.md       # Proje dokümantasyonu

## 🛠️ Kurulum

Bu eklenti açık kaynaklıdır ve **"Geliştirici Modu"** ile yüklenir:

1. Bu repoyu bilgisayarınıza indirin (`git clone` veya ZIP olarak).
2. Google Chrome'u açın ve adres çubuğuna şunu yazın:  chrome://extensions/
3. Sağ üst köşedeki **Geliştirici Modu (Developer mode)** anahtarını açın.
4. Sol üstte beliren **Paketlenmemiş öğe yükle (Load unpacked)** butonuna tıklayın.
5. İndirdiğiniz `MathSolverAI` klasörünü seçin.
6. Tebrikler! Eklenti yüklendi ve kullanıma hazır. 🎉

---

## 🚀 Nasıl Kullanılır?

### 1. API Anahtarını Alın:
- [Google AI Studio](https://aistudio.google.com/) adresinden ücretsiz bir **Gemini API anahtarı** alın.

### 2. Anahtarı Kaydedin:
- Herhangi bir web sayfasını açın.
- Sağ taraftaki **MathSolver** çubuğunda bulunan 🔑 (**Anahtar**) ikonuna tıklayın.
- Anahtarınızı yapıştırın ve kaydedin. *(Bir kez yapmanız yeterlidir.)*

### 3. Soruyu Kopyalayın:
- **Windows:** `Win + Shift + S` ile soruyu seçin.  
- **Mac:** `Cmd + Ctrl + Shift + 4` ile soruyu seçin.

### 4. Çözün:
- Web sayfasına geri dönün ve `CTRL + V` (`Cmd + V` Mac'te) ile yapıştırın.
- Açılan pencerede **"🚀 Çözümü Başlat"** butonuna tıklayın.

