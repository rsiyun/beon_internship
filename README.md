# Keuangan warga (internship test)

Aplikasi manajemen data rumah dan penghuni RT/RW.

## Installation

Ini adalah panduan untuk menginstal dan menjalankan proyek ini di lingkungan lokal Anda.

### Backend (Laravel)

1.  **Clone Repositori:**
    Pertama, *clone* repositori *backend* dari GitHub:
    ```bash
    git clone https://github.com/rsiyun/beon_internship.git
    ```

2.  **Masuk ke Direktori Backend:**
    Navigasi ke direktori *backend* yang baru saja di-*clone*:
    ```bash
    cd backend
    ```

3.  **Instal Dependensi PHP:**
    Instal semua dependensi PHP yang dibutuhkan proyek menggunakan Composer. Pastikan Composer sudah terinstal di sistem Anda.
    ```bash
    composer install
    ```

4.  **Konfigurasi Environment (.env):**
    Buat *file* `.env` dengan menyalin *file* `.env.example`. *File* ini berisi konfigurasi penting seperti koneksi *database* dan kunci aplikasi.
    ```bash
    cp .env.example .env
    ```

5.  **Generate Application Key:**
    Laravel membutuhkan *application key* yang unik untuk keamanan. Jalankan perintah ini untuk menggenerasinya:
    ```bash
    php artisan key:generate
    ```

6.  **Konfigurasi Database:**
    Buka *file* `.env` yang baru dibuat dan atur detail koneksi *database* Anda. Contoh:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=nama_database_anda # Ganti dengan nama database yang Anda inginkan
    DB_USERNAME=root             # Ganti dengan username database Anda
    DB_PASSWORD=                   # Ganti dengan password database Anda (kosongkan jika tidak ada)
    ```

7.  **Jalankan Migrasi Database:**
    Setelah mengkonfigurasi *database*, jalankan migrasi untuk membuat tabel-tabel yang dibutuhkan di *database* Anda.
    ```bash
    php artisan migrate
    ```

8.  **Seed Database (Opsional):**
    Jika Anda memiliki *seeder* untuk data awal (misalnya, data admin, data contoh), Anda bisa menjalankannya:
    ```bash
    php artisan db:seed
    ```

9.  **Link Storage (Jika Ada Upload File):**
    Jika aplikasi Anda memiliki fitur *upload* file (seperti gambar KTP atau profil), Anda perlu membuat *symlink* ke *storage* agar file-file tersebut dapat diakses secara publik.
    ```bash
    php artisan storage:link
    ```

10. **Jalankan Server Lokal:**
    Mulai server pengembangan Laravel. Secara *default*, ini akan berjalan di `http://127.0.0.1:8000`.
    ```bash
    php artisan serve
    ```

---

### Frontend (React JS)

Setelah meng-*clone* repositori utama, Anda juga perlu menyiapkan bagian *frontend*.

1.  **Masuk ke Direktori Frontend:**
    Asumsikan Anda berada di *root* proyek setelah proses *clone*. Navigasi ke direktori *frontend*:
    ```bash
    cd frontend
    ```

2.  **Instal Dependensi Node.js:**
    Instal semua dependensi JavaScript yang dibutuhkan proyek menggunakan npm atau Yarn. Pastikan **Node.js** dan **npm/Yarn** sudah terinstal di sistem Anda.
    ```bash
    npm install
    # atau jika Anda menggunakan Yarn
    yarn install
    ```

3.  **Konfigurasi Environment Frontend:**
    Buat *file* `.env` di direktori *frontend* untuk mengonfigurasi URL *backend* Anda. Ini penting agar *frontend* bisa berkomunikasi dengan API Laravel Anda.
    ```bash
    cp .env.example .env
    ```
    Buka *file* `.env` yang baru dibuat dan tambahkan atau sesuaikan baris berikut:
    ```env
    VITE_API_URL="http://127.0.0.1:8000/api"
    Sesuaikan dengan URL backend Anda
    ```
    *(**Catatan:** Jika Anda menggunakan Vite, *prefix* variabel lingkungan adalah `VITE_`. Jika Anda menggunakan Create React App, *prefix*nya adalah `REACT_APP_`.)*

4.  **Jalankan Aplikasi Frontend:**
    Mulai server pengembangan *frontend*. Ini akan membuka aplikasi React Anda di *browser* pada alamat lokal tertentu (biasanya `http://localhost:3000` atau `http://localhost:5173` untuk Vite).
    ```bash
    npm run dev
    # atau jika Anda menggunakan Yarn
    yarn dev
    ```

Setelah kedua server (backend Laravel dan frontend React JS) berjalan, Anda seharusnya bisa mengakses aplikasi melalui URL *frontend* yang ditampilkan di konsol.

---
