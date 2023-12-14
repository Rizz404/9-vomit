## Navbar

- Navbar itu sticky / fixed dan menggunakan `flexbox` untuk mengatur 4 elemen utamanya:

1. **Hamburger untuk Membuka Sidebar**
   - Pada ukuran `xl`, tombol hamburger disembunyikan.
   - Pada ukuran `md` dan `sm`, tombol hamburger ditampilkan.

2. **Logo Navbar / Nama Website**

3. **Searchbar** dengan Logo Pencarian
   - Ketika dalam mode pencarian, akan muncul sebuah popup box dibawahnya yang berisi rekomendasi search yang terdiri dari 2 list: list tag dan list post, masing-masing menampilkan 5 item.
   - Setiap tag akan menampilkan logo tag bersama jumlah postingannya.

4. **Foto Profil Pengguna**
   - Ketika diklik, akan muncul menu pop-over di bawah gambar yang berisi link ke halaman Profile, Account, dan Settings.

## Sidebar

- Sidebar defaultnya adalah kebuka dilayar `xl` possitionnya `sticky / fixed`, pada ukuran layar `md` disembunyikan dan defaultnya dan jadi ada di paling atas komponen lainnya (atur `z-index`)
- Sidebar terdiri dari 5 bagian yang ditampilkan dalam bentuk list vertikal:

1. **Navigasi Postingan**
   - Terdapat opsi: Home, Top, Trending, dan Fresh. Setiap opsi memiliki logo yang bisa disesuaikan dengan tema konten.

2. **Recent**
   - Menampilkan tiga tag terkait postingan yang baru dilihat dalam div yang mencakup logo tag bersama nama tag.
   - Terdapat opsi "show more" untuk menampilkan semua tag yang tersedia.
   - Logo "pinned" berubah warna saat di-pin.

3. **Pinned**
   - Menampilkan tag yang telah di-pin dengan perubahan warna yang menunjukkan statusnya.

4. **Following**
   - Daftar tag-tagnya ditampilkan di sini, mirip dengan "Recent" dan "Pinned".

5. **Interest**
   - Daftar tag-tagnya ditampilkan di sini, mirip dengan "Recent", "Pinned", dan "Following".

## Layout Utama

- Layout dibagi menjadi 3 bagian, sidebar, main konten, dan ads

1. **Sidebar**
   - kalau di layar `xl` itu akan tampil kan defaultnya, terus kalo ditutup itu akan menggeser main content dan ads untuk mengambil tempat sidebar yang udah ditutup, jadinya main content dan ads rada ketengah sedikit

2. **Main Content**
   - ini berurutan ya
   - `Featured Tags` tampil persis dibawah navbar
   - `PostCard`
   
3. **Ads**
   - Untuk ads posstionnya `fixed`

## Featured Tags
- Menampilkan tags yang populer di hari ini designnya itu button outlined dan flex-wrap

## PostCard

- Memiliki 3 component yaitu, header, main, dan footer

1. **Header**
   - logo tag, nama tag, dan waktu posting satu div terus flex between sama icon titik tiga sama icon x
   - kalau titik tiga di klik maka akan tampil menu popover dengan list: download media, report post dan block
   - Post title dibawah div yang diatasnya untuk ukuran terserah
2. **Main**
   - Main itu foto yang bisa di slide, dan slide bentukannya itu kaya ada navigasi di samping kanan dan kiri foto.
   - dibawah foto ada seperti titik yang sesuai dengan jumlah fotonya vertikal yang ngasih tau kita ada di foto yang mana

3. **Footer**
   - ada tag dari post tersebut yang berbaris secara vertikal, dan kalo tagnya kebanyakan maka akan muncul slider vertikal untuk liat tagsnya
   - terus ada icon upvote, angka vote count, downvote, dan icon comment serta angka comment countnya yang satu div yang akan between sama div yang isinya save dan share icon