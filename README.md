# 🧠 MindMate AI

**Your AI-Powered Mental Health Companion**

## 1. Deskripsi Singkat Proyek
MindMate AI adalah aplikasi *web-based* yang dirancang sebagai ruang aman digital (*digital sanctuary*) untuk mendukung kesehatan mental. Aplikasi ini mengintegrasikan *Artificial Intelligence* generatif untuk memberikan pertolongan pertama emosional yang personal dan tanpa penghakiman. Proyek ini dibangun menggunakan **MERN Stack** (MongoDB, Express, React, Node.js) dan Vite sebagai tugas akhir (Capstone Project) DBS Foundation Coding Camp.

**Fitur Utama:**
- **Dynamic AI Therapist:** Chatbot empatik yang merespons secara *real-time* layaknya manusia.
- **AI Safety Guardrails:** Sistem *prompt engineering* yang ketat agar AI menolak topik di luar ranah psikologi (seperti *coding* atau politik).
- **Emotional Resonance Tracking:** Grafik interaktif untuk melacak riwayat suasana hati (*mood*) pengguna.
- **Soundscape Player:** Fitur pemutar audio relaksasi untuk melatih *mindfulness*.
- **Local Support Map:** Peta interaktif (Leaflet) untuk mencari fasilitas kesehatan mental dan klinik terdekat.

**Arsitektur Sistem (System Architecture):**
Aplikasi ini beroperasi dengan arsitektur *Client-Server* modern berbasis *Serverless*:
- **Frontend Layer:** Dibangun dengan React 19 dan Vite, menggunakan Tailwind CSS untuk *styling*. Bertugas menangani UI/UX dan interaksi pengguna di *browser*. Di-deploy di Vercel Edge Network.
- **Backend Layer:** Menggunakan Node.js dan Express.js. Bertugas sebagai penghubung (*middleware*) antara *frontend*, *database*, dan API pihak ketiga. Berjalan sebagai *Vercel Serverless Functions*.
- **Database Layer:** Menggunakan MongoDB Atlas (Cloud) dengan Mongoose ODM untuk menyimpan data pengguna, riwayat percakapan, dan hasil survei secara persisten.
- **AI/ML Layer:** Menggunakan *Large Language Model* (Meta Llama 3) yang dipanggil secara eksternal melalui REST API dari *provider* Groq Cloud.

---

## 2. Struktur Folder (Folder Structure)

Untuk mempermudah navigasi bagi *developer* atau penguji yang mereplikasi proyek ini, berikut adalah hierarki kode utama:

```text
mindmate-ai/
├── frontend/                # Sisi Klien (React + Vite)
│   ├── src/
│   │   ├── components/      # Komponen UI yang bisa digunakan ulang (Chart, Player, dll)
│   │   ├── context/         # React Context untuk State Management (AuthContext)
│   │   ├── pages/           # Halaman utama (Dashboard, Chat, Support)
│   │   ├── services/        # Modul untuk memanggil API Backend (Axios)
│   │   ├── App.jsx          # Konfigurasi Routing (React Router)
│   │   └── index.css        # Entry point Tailwind CSS
│   ├── vercel.json          # Konfigurasi rewrite rule untuk deployment SPA
│   └── package.json
│
├── backend/                 # Sisi Server (Node.js + Express)
│   ├── controllers/         # Logika bisnis utama (Auth, Chat, Survey)
│   ├── models/              # Skema Database Mongoose (User, Message, Survey)
│   ├── routes/              # Definisi endpoint REST API
│   ├── db.js                # Konfigurasi koneksi ke MongoDB Atlas
│   ├── server.js            # Entry point aplikasi backend
│   └── package.json
│
├── README.md                # Dokumentasi proyek (File ini)
└── CHANGELOG.md             # Riwayat pembaruan dan perbaikan aplikasi
```

---

## 3. Petunjuk Setup Environment

Bagian ini berisi instruksi detail tentang bagaimana orang lain dapat mereplikasi langkah-langkah pengembangan (*local setup*) secara utuh:

### Prasyarat Khusus
Pastikan Anda telah menginstal *software* berikut sebelum memulai:
- [Node.js](https://nodejs.org/) (Versi 18 ke atas)
- [MongoDB Atlas](https://www.mongodb.com/) (Kredensial cloud) atau MongoDB lokal
- [Git](https://git-scm.com/)
- Akun [Groq Cloud](https://console.groq.com/keys) untuk mendapatkan API Key secara gratis.

### Langkah Persiapan (Setup)
1. **Clone Repositori:**
   Buka terminal komputer Anda dan unduh kode sumber.
   ```bash
   git clone https://github.com/<your-username>/mindmate-ai.git
   cd mindmate-ai
   ```

2. **Setup Environment Backend (Server-side):**
   Masuk ke folder backend dan instal seluruh *package* yang dibutuhkan.
   ```bash
   cd backend
   npm install
   ```
   Buat file tersembunyi bernama `.env` di dalam folder `backend` dan isi dengan kredensial berikut:
   ```env
   PORT=5000
   MONGO_URI=masukkan_url_koneksi_mongodb_anda_disini
   JWT_SECRET=masukkan_kunci_rahasia_jwt_anda
   GROQ_API_KEY=gsk_masukkan_kunci_api_groq_anda
   ```

3. **Setup Environment Frontend (Client-side):**
   Buka jendela terminal baru, masuk ke folder frontend dan instal dependensinya.
   ```bash
   cd frontend
   npm install
   ```
   Buat file bernama `.env` di dalam folder `frontend` dan isi dengan koneksi API lokal:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

---

## 4. Tautan Model ML (Jika Ada)

> 🚧 **[STATUS: IN PROGRESS]** 
> *Saat ini, tim pengembang sedang dalam tahap eksplorasi dan perancangan arsitektur untuk mengintegrasikan model Machine Learning kustom (khusus) ke dalam ekosistem MindMate AI. Fitur ML kustom ini direncanakan akan bertugas untuk melakukan analisis sentimen otomatis pada entri *Diary* pengguna. Repositori ini akan diperbarui dengan tautan model ML (.h5/.pkl) beserta kode inferensinya segera setelah model selesai dilatih dan diuji coba.*

Untuk saat ini, guna memfasilitasi fitur inti "AI Therapist" pada versi rilis awal, aplikasi ini sementara memanfaatkan model Large Language Model (LLM) tercanggih melalui integrasi API, yaitu **Meta Llama 3 (Llama-3.3-70b-versatile)** melalui *provider* **Groq**.

- **Tautan Spesifikasi Model (Meta Llama 3):** [https://llama.meta.com/llama3/](https://llama.meta.com/llama3/)
- **Tautan Penyedia API (Groq Cloud Models):** [https://console.groq.com/docs/models](https://console.groq.com/docs/models)
- **Cara Load Model di Kode:** Model dipanggil secara *serverless API call* di dalam direktori proyek `backend/controllers/chatController.js`.

---

## 5. Cara Menjalankan Aplikasi

Setelah *Environment Setup* pada poin ketiga selesai dilakukan, ikuti instruksi terminal berikut untuk menjalankan dan menguji aplikasi secara lokal:

**Langkah 1: Menjalankan Server Backend**
Buka aplikasi terminal/CMD Anda, pastikan lokasi berada di direktori `/backend`, lalu jalankan perintah:
```bash
npm run dev
```
*(Tunggu hingga terminal menampilkan log: "Server is running on port 5000" dan "MongoDB Connected")*

**Langkah 2: Menjalankan Server Frontend**
Buka aplikasi terminal/CMD baru, pastikan lokasi berada di direktori `/frontend`, lalu jalankan perintah:
```bash
npm run dev
```
*(Terminal akan memunculkan URL server lokal Vite, menandakan frontend berhasil dikompilasi).*

**Akses Aplikasi:**
Buka *browser* pilihan Anda (Chrome/Firefox/Edge) dan kunjungi tautan berikut:
**http://localhost:5173**

---

## 6. Panduan Tambahan: Deployment (Vercel)
Untuk mereplikasi aplikasi ke server publik (Production), proyek ini di-*deploy* menggunakan Vercel.
1. Impor repositori GitHub ini ke *dashboard* Vercel.
2. Tambahkan variabel dari file `.env` ke bagian **Environment Variables** di Vercel (khususnya `MONGO_URI`, `JWT_SECRET`, dan `GROQ_API_KEY`).
3. File `frontend/vercel.json` sudah dikonfigurasi untuk mencegah *error 404* pada *React Router* (*Single Page Application*).

---
*Proyek ini merupakan bagian dari DBS Foundation Coding Camp Capstone Program.*
