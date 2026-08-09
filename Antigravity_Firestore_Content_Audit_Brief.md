# Task Brief untuk Antigravity — Audit Konten NDNews di Firestore

**Project:** nussadigital-news-a332e
**Collection:** `articles`
**Tujuan:** Audit seluruh dokumen artikel untuk menemukan 3 kategori masalah yang menyebabkan rejection "Low Value Content" dari AdSense, TANPA langsung menghapus/mengubah data production. Fase 1 = read-only report. Fase 2 = rewrite dengan approval manual per-batch.

---

## Struktur dokumen (konfirmasi dari Firestore Anda)

```
articles/{id}
  author: string
  authorAvatar: string | null
  category: string  // "Sport" | "Economy" | "Finance" | "APAC" | "Opinion" | "Explainer"
  content: string    // plain text/markdown, TANPA field terpisah per section
  date: string (ISO)
  excerpt: string
  id: string
  image: string (URL)
  isBreaking: boolean
  isFeatured: boolean
  isLive: boolean
  readTime: string
  tags: array<string>
  title: string
  views: number
```

Catatan penting: `content` di dokumen Messi-vs-Ronaldo yang Anda kirim **tidak** memakai header eksplisit ("Why It Matters" dst) — strukturnya prosa naratif dengan sub-topik inline (mis. "Messi's Dream Finally Came True" sebagai kalimat, bukan `##` heading). Artinya deteksi tidak bisa hanya cari string header lama — perlu deteksi pola di level kalimat/struktur juga.

---

## FASE 1 — Audit Report (read-only, aman dijalankan kapan saja)

### Setup
```javascript
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();
```
Gunakan service account dengan role **Firestore Viewer only** untuk fase ini kalau memungkinkan — supaya secara teknis script tidak bisa menulis walau ada bug di kode.

### Logika audit per dokumen

Untuk setiap artikel, hitung dan simpan flag berikut:

**1. Thin content flag**
```
word_count = content.split(/\s+/).length
thin_flag = word_count < 500   // ambang aman di atas rekomendasi umum 300-400
```

**2. Template/legacy-header flag** (untuk artikel lama yang masih pakai format eksplisit)
```javascript
const templatePatterns = [
  /why it matters/i, /business impact/i, /apac impact/i,
  /expert opinion/i, /future outlook/i, /the bottom line/i,
  /closing thoughts/i, /key takeaways/i
];
template_flag = templatePatterns.some(p => p.test(content));
```

**3. Structural fingerprint similarity** (untuk mendeteksi kemiripan "kerangka" walau tanpa header eksplisit, seperti kasus Messi-Ronaldo)
- Ambil kalimat pembuka paragraf pertama dan kalimat penutup paragraf terakhir dari tiap artikel.
- Ambil kalimat pertama dari tiap kategori (per `category` field) sebagai kelompok, lalu hitung cosine similarity (pakai embedding sederhana — bisa panggil Claude/Gemini API untuk embedding, atau pakai library `natural`/TF-IDF lokal biar tidak perlu API call per artikel).
- Tandai `high_similarity_cluster: [id1, id2, ...]` untuk artikel-artikel dalam kategori sama yang closing/opening-nya polanya berulang (mis. semua artikel Sport ditutup dengan variasi kalimat "Regardless of personal preference, fans were fortunate to witness...").

**4. Generic/oversaturated topic flag** (relevan untuk kasus Messi-Ronaldo)
```javascript
const oversaturatedTopics = [
  'goat debate', 'messi vs ronaldo', 'how to start a blog',
  // tambahkan daftar topik evergreen yang sudah dibahas ribuan situs lain
];
generic_topic_flag = oversaturatedTopics.some(t => title.toLowerCase().includes(t) || tags.some(tag => tag.toLowerCase().includes(t)));
```
Ini flag "soft" — bukan berarti harus dihapus, tapi ditandai perlu ditambah sudut pandang unik (mis. angle Indonesia/APAC: bagaimana media Asia meliput rivalitas ini, dampak ke sponsor Asia, dll) sebelum dianggap aman.

**5. Named-attribution extraction** (untuk artikel finance/economy — replikasi temuan kutipan BNP Paribas kemarin)
```javascript
const attributionPattern = /(according to|said|noted|told (?:CNBC|Reuters|[A-Z][a-z]+)|[A-Z][a-z]+ (?:said|added|explained))/gi;
quotes_found = content.match(attributionPattern) || [];
needs_source_verification = quotes_found.length > 0;
```
Semua yang masuk `quotes_found` **wajib dicek manual oleh Anda** ke sumber asli — jangan diverifikasi otomatis oleh AI lain, karena AI tidak bisa memastikan AI lain tidak berhalusinasi.

**6. Missing/broken author real-identity flag**
```
fake_author_flag = !author || author trim().length < 3 || authorAvatar === null
```

### Output — simpan ke collection terpisah, JANGAN tulis balik ke `articles`
```javascript
await db.collection('content_audit_report').doc(articleId).set({
  title, category, word_count, thin_flag, template_flag,
  high_similarity_cluster, generic_topic_flag, quotes_found,
  needs_source_verification, fake_author_flag,
  recommendation: '',  // diisi manual setelah review: 'keep' | 'rewrite' | 'noindex' | 'delete'
  reviewed: false,
  audited_at: admin.firestore.FieldValue.serverTimestamp()
});
```
Atau kalau Anda lebih nyaman lihat di spreadsheet: export ke CSV/Google Sheet sekalian (lebih gampang di-scan sekali lihat 80+ artikel daripada buka Firestore console satu-satu).

---

## FASE 2 — Rewrite (HANYA setelah Anda review manual hasil Fase 1)

**Guardrail wajib:**
1. Script Fase 2 **tidak boleh** auto-jalan untuk semua artikel sekaligus. Proses per-batch kecil (mis. 10 artikel), dan tulis ke field baru dulu (`content_draft`) — bukan overwrite langsung `content` — supaya Anda bisa preview sebelum publish.
2. Artikel dengan `needs_source_verification: true` **tidak boleh** masuk auto-rewrite sebelum Anda konfirmasi manual kutipannya valid/dihapus.
3. Artikel dengan `generic_topic_flag: true` (seperti Messi-Ronaldo) diarahkan ke prompt Gemini yang sudah kita revisi, dengan instruksi tambahan: **wajib menyisipkan angle APAC/Indonesia** yang genuinely tidak ada di kompetitor, bukan sekadar tulis ulang kalimat.
4. Artikel dengan `thin_flag: true` DAN topik generic sekaligus → kandidat kuat untuk **noindex + tidak diprioritaskan rewrite** (effort lebih baik dialokasikan ke topik yang punya audience/keunikan jelas).

```javascript
// Contoh guardrail penulisan — bukan langsung overwrite
await db.collection('articles').doc(articleId).update({
  content_draft: newContent,       // preview field, belum live
  rewrite_pending_review: true
});
// Publish hanya lewat langkah terpisah setelah Anda approve
```

---

## Ringkasan alur kerja untuk Anda

1. Jalankan Fase 1 di Antigravity → hasilnya `content_audit_report` collection atau CSV.
2. Anda sortir: mana `thin_flag=true` + `generic_topic_flag=true` → kandidat noindex/hapus.
3. Mana `needs_source_verification=true` → Anda cek manual satu-satu kutipannya ke sumber asli.
4. Sisanya yang punya potensi (topik cukup spesifik, cuma perlu ditambah kedalaman) → masuk antrian Fase 2 rewrite via prompt Gemini yang sudah diperbaiki.
5. Baru setelah katalog artikel "bersih" (bukan tambah kuantitas, tapi kualitas rata-rata naik), pertimbangkan resubmit AdSense.
