### Navbar:

- **Sticky / Fixed Navbar:**
  - Gunakan `position: fixed` atau `position: sticky` untuk menahan navbar di bagian atas layar saat digulir.

- **Flexbox untuk 4 Elemen Utama:**
  - Container navbar menggunakan `display: flex` untuk mengatur Hamburger, Logo, Searchbar, dan Foto Profil secara horizontal.

- **Responsif pada Ukuran Layar:**
  - Gunakan media queries untuk mengontrol visibilitas tombol Hamburger berdasarkan ukuran layar.

- **Popup Box untuk Search:**
  - Ketika dalam mode pencarian, gunakan `position: absolute` pada popup box untuk menampilkan rekomendasi search di bawah searchbar.

### Sidebar:

- **Sticky / Fixed pada Ukuran Layar XL:**
  - Gunakan `position: sticky` atau `position: fixed` pada sidebar saat layar dalam ukuran XL.

- **Positioning dan Z-Index:**
  - Pada layar `md`, atur `position: absolute` dan `z-index` pada sidebar untuk menempatkannya di atas elemen lainnya.

- **List Vertical untuk 5 Bagian:**
  - Gunakan `display: flex` atau `flex-direction: column` pada sidebar untuk menampilkan opsi Navigasi Postingan, Recent, Pinned, Following, dan Interest.

### Layout Utama:

- **Sidebar:**
  - Bagi layout menjadi 3 bagian: sidebar, main content, dan ads dengan menggunakan `flex` atau `grid`.
  - Pada layar `xl`, atur sidebar untuk tampil secara default. Ketika ditutup, gunakan `transition` atau `animation` untuk menggeser main content dan ads.

- **Main Content:**
  - Gunakan `display: flex` atau `grid` untuk menata Featured Tags dan PostCard di bawah navbar.

- **Ads:**
  - Atur posisi dengan `position: fixed` untuk menjaganya tetap di lokasi yang diinginkan.

### Featured Tags:

- **Button Outlined dan Flex-wrap:**
  - Buat tampilan button outlined untuk tags dan atur `flex-wrap` agar tags dapat menyesuaikan tata letaknya sesuai dengan ruang yang tersedia.

### PostCard:

- **Header:**
  - Gunakan `flexbox` untuk menata logo tag, nama tag, waktu posting, dan icon pada header. Tampilkan menu popover dengan CSS saat icon titik tiga diklik.

- **Main:**
  - Implementasikan slider CSS atau library khusus untuk membuat fitur slide foto pada PostCard.

- **Footer:**
  - Gunakan `flexbox` atau `grid` untuk menata icon upvote, vote count, downvote, icon comment, comment count, save, dan share.
  - Berikan kemampuan slider vertikal untuk menampilkan tags yang terlalu banyak.