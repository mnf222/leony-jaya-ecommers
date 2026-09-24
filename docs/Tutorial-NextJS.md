## Tutorial Next.js Lengkap untuk Pemula

## Daftar Isi

- 1. Pengenalan Next.js

2. Instalasi & Setup Proyek

- 3. Struktur Folder Proyek

- 4. App Router & Routing Dasar

- 5. Nested Route & Dynamic Route

- 6. Layout

- 7. Server Component vs Client Component

- 8. Navigasi Antar Halaman

- 9. Data Fetching

- 10. Route Handler (API di Next.js)

- 11. Metadata & SEO

- 12. Static vs Dynamic Rendering

- 13. Styling di Next.js

- 14. Latihan Akhir

## 1. Pengenalan Next.js

Next.js adalah framework berbasis React yang dikembangkan oleh Vercel, yang menambahkan berbagai fitur siap pakai di atas React seperti routing berbasis folder, server-side rendering (SSR), static site generation (SSG), API routes, optimasi gambar, dan banyak lagi.

## Perbedaan utama React vs Next.js:

- React adalah library untuk membangun UI; ia tidak memiliki sistem routing atau rendering di sisi server secara bawaan.

- Next.js adalah framework lengkap yang dibangun di atas React, sudah mencakup routing, rendering strategy, optimasi otomatis, dan struktur proyek yang terstandarisasi.

## Kenapa belajar Next.js?

- Routing otomatis berdasarkan struktur folder (tidak perlu setup React Router secara manual).

- Mendukung Server-Side Rendering (SSR) dan Static Site Generation (SSG) yang meningkatkan performa dan SEO.

- Memiliki fitur API Route sehingga backend sederhana bisa dibuat dalam proyek yang sama.

- Banyak dipakai di industri untuk aplikasi production-grade.


## 2. Instalasi & Setup Proyek

```
bash
npxcreate-next-app@latestnama-proyek
cdnama-proyek
npmrundev
```

Saat instalasi, akan muncul beberapa pertanyaan konfigurasi, misalnya:

- Menggunakan TypeScript? (disarankan Yes untuk proyek yang lebih besar)

- Menggunakan ESLint? (Yes, membantu menjaga kualitas kode)

- Menggunakan Tailwind CSS? (opsional, tapi sangat umum dipakai)

- Menggunakan App Router? (Yes — ini adalah pendekatan modern yang akan kita gunakan di tutorial ini)

Setelah selesai, jalankan proyek dan buka http://localhost:3000 di browser.

## 3. Struktur Folder Proyek

Dengan App Router (Next.js 13 ke atas), struktur folder utama berada di dalam folder app/ .

```
nama-proyek/
├── app/
│ ├── layout.tsx <- layout utama seluruh aplikasi
│ ├── page.tsx <- halaman utama ("/")
│ ├── globals.css
│ └── about/
│ └── page.tsx <- halaman "/about"
├── public/ <- file statis (gambar, favicon, dll)
├── next.config.js
└── package.json
```

Penjelasan penting: Di App Router, setiap folder di dalam app/ merepresentasikan satu segmen URL, dan file bernama page.tsx di dalam folder tersebut adalah konten yang akan ditampilkan untuk route tersebut.

## 4. App Router & Routing Dasar

Next.js menggunakan sistem file-based routing — kita tidak perlu mendefinisikan route secara manual seperti di React Router, cukup membuat folder dan file page.tsx .

## Contoh: Halaman utama

app/page.tsx akan menjadi halaman untuk path / .


```
exportdefaultfunctionHome(){
return<h1>Selamat datang di Beranda!</h1>;
}
```

## Contoh: Halaman "About"

Buat folder app/about/page.tsx , otomatis dapat diakses di path /about .

```
tsx
exportdefaultfunctionAbout(){
return<h1>Ini adalah halaman Tentang Kami</h1>;
}
```

## Contoh: Halaman "Contact"

```
app/contact/page.tsx -> path: /contact
```

Tidak perlu konfigurasi routing tambahan sama sekali — cukup dengan membuat struktur foldernya.

## 5. Nested Route & Dynamic Route

## Nested Route

Route dapat disusun bertingkat mengikuti struktur folder.

```
app/blog/page.tsx -> /blog
app/blog/kategori/page.tsx -> /blog/kategori
```

## Dynamic Route

Untuk route dengan parameter dinamis (misalnya id produk atau slug artikel), gunakan tanda kurung siku [ ] pada nama folder.

```
app/blog/[slug]/page.tsx
tsx
interfaceProps{
params: { slug: string};
}
exportdefaultfunctionDetailBlog({params}: Props){
return<h1>Menampilkan artikel: {params.slug}</h1>;
}
```


```
Jika pengguna mengakses /blog/belajar-nextjs , maka params.slug akan bernilai
"belajar-nextjs" .
```

## Catch-all Route

Untuk menangkap banyak segmen sekaligus, gunakan tiga titik di dalam kurung siku:

```
app/docs/[...slug]/page.tsx
```

Route ini akan cocok dengan /docs/a , /docs/a/b , /docs/a/b/c , dan seterusnya. Nilai params.slug akan berupa array, misalnya ["a", "b", "c"] .

## 6. Layout

File layout.tsx digunakan untuk mendefinisikan tampilan yang konsisten di banyak halaman, misalnya navbar dan footer yang selalu muncul di setiap route.

```
tsx
// app/layout.tsx
exportdefaultfunctionRootLayout({
children,
}: {
children: React.ReactNode;
}){
return(
<htmllang="id">
<body>
<nav>Navbar Aplikasi</nav>
<main>{children}</main>
<footer>Footer Aplikasi</footer>
</body>
</html>
);
}
```

Penjelasan: Prop children di sini merepresentasikan konten dari page.tsx pada route yang sedang aktif. Layout bersifat nested — kita bisa membuat layout.tsx di dalam subfolder tertentu (misalnya app/dashboard/layout.tsx ) untuk memberikan tampilan khusus hanya pada bagian dashboard, sementara tetap mewarisi layout dari level di atasnya.

## 7. Server Component vs Client Component

Ini adalah salah satu konsep terpenting yang membedakan Next.js App Router dari React biasa.

Server Component (default):


- Semua komponen di dalam app/ secara default adalah Server Component.

- Dirender di server, sehingga HTML yang dikirim ke browser sudah jadi (lebih cepat, baik untuk SEO).

- Tidak dapat menggunakan hook seperti useState , useEffect , atau event handler seperti onClick secara langsung.

- Cocok untuk komponen yang menampilkan data tanpa interaksi kompleks, misalnya mengambil data dari database.

## Client Component:

- Harus ditandai secara eksplisit dengan menuliskan "use client" di baris paling atas file.

- Dirender di browser (client-side), sehingga bisa menggunakan useState , useEffect , dan event handler.

- Cocok untuk komponen yang membutuhkan interaktivitas, seperti form, modal, atau counter.

```
tsx
"use client";
import{ useState }from"react";
exportdefaultfunctionCounter(){
const[jumlah, setJumlah] = useState(0);
return(
<div>
<p>Jumlah: {jumlah}</p>
<buttononClick={()=>setJumlah(jumlah + 1)}>Tambah</button>
</div>
);
}
```

Aturan penting: Server Component tidak bisa langsung mengimpor dan menggunakan hook dari Client Component sembarangan tanpa direktif "use client" . Sebaliknya, Client Component tetap bisa menerima Server Component sebagai children . Sebaiknya jadikan Client Component sekecil dan sespesifik mungkin (misalnya hanya komponen tombol/form-nya saja), sementara sisa halaman tetap sebagai Server Component agar performa tetap optimal.

## 8. Navigasi Antar Halaman

Gunakan komponen Link dari next/link untuk berpindah halaman tanpa reload penuh (client-side navigation).


```
tsx
import Link from"next/link";
exportdefaultfunctionNavbar(){
return(
<nav>
<Linkhref="/">Beranda</Link>
<Linkhref="/about">Tentang</Link>
<Linkhref="/contact">Kontak</Link>
</nav>
);
}
```

## Navigasi secara programatik

Untuk berpindah halaman melalui kode (misalnya setelah submit form), gunakan useRouter dari next/navigation (khusus di dalam Client Component).

```
tsx
"use client";
import{ useRouter }from"next/navigation";
exportdefaultfunctionTombolKembali(){
const router = useRouter();
return<buttononClick={()=> router.push("/")}>Kembali ke Beranda</button>;
}
```

## 9. Data Fetching

Karena Server Component dijalankan di server, kita bisa langsung menggunakan async/await di dalam komponen untuk mengambil data, tanpa perlu useEffect .

```
tsx
```


```
asyncfunctiongetData(){
const res = awaitfetch("https://jsonplaceholder.typicode.com/posts");
return res.json();
}
exportdefaultasyncfunctionDaftarPost(){
const data = awaitgetData();
return(
<ul>
{data.slice(0,5).map((post: any)=>(
<likey={post.id}>{post.title}</li>
))}
</ul>
);
}
```

Penjelasan: Karena ini adalah Server Component, proses fetch dilakukan di server sebelum halaman dikirim ke browser, sehingga pengguna langsung melihat data tanpa "loading spinner" tambahan seperti pada pendekatan useEffect di React biasa.

## Caching pada fetch

Next.js secara default akan melakukan caching terhadap hasil fetch . Untuk mengatur perilaku ini:

```
tsx
fetch("https://api.contoh.com/data",{cache:"no-store"});// selalu ambil da
fetch("https://api.contoh.com/data",{next:{revalidate:60}});// revalida
```

## 10. Route Handler (API di Next.js)

Next.js memungkinkan kita membuat endpoint API langsung di dalam proyek yang sama, menggunakan file bernama route.ts di dalam folder app/api/... .

```
app/api/hello/route.ts
```

tsx


```
import{ NextResponse }from"next/server";
exportasyncfunctionGET(){
return NextResponse.json({pesan:"Halo dari API Next.js!"});
}
exportasyncfunctionPOST(request: Request){
const body = await request.json();
return NextResponse.json({diterima: body });
}
```

Endpoint ini dapat diakses di http://localhost:3000/api/hello , dan bisa dipanggil dari

Client Component menggunakan fetch biasa.

## 11. Metadata & SEO

Next.js menyediakan cara mudah untuk mengatur metadata (judul halaman, deskripsi, dll) yang penting untuk SEO.

```
tsx
// app/about/page.tsx
importtype{ Metadata }from"next";
exportconst metadata: Metadata = {
title:"Tentang Kami | Nama Website",
description:"Halaman ini menjelaskan tentang perusahaan kami.",
};
exportdefaultfunctionAbout(){
return<h1>Tentang Kami</h1>;
}
```

Metadata ini akan otomatis menghasilkan tag <title> dan <meta name="description"> yang sesuai pada halaman tersebut.

## 12. Static vs Dynamic Rendering

Next.js menentukan strategi rendering suatu halaman secara otomatis berdasarkan bagaimana data diambil:


| Strategi Penjelasan |   | Kapan dipakai |
| --- | --- | --- |
| Static | Halaman dirender sekali saat | Halaman yang jarang berubah, misalnya |
| Rendering | proses build, hasilnya berupa | halaman landing page atau blog |
|   | HTML statis |   |
| Dynamic | Halaman dirender ulang di | Halaman yang datanya sering berubah atau |
| Rendering | server setiap kali ada permintaan | bergantung pada request (misalnya data user |
|   |   | yang sedang login) |

Penggunaan cache: "no-store" atau pembacaan cookies/headers pada suatu halaman akan membuat Next.js otomatis beralih menggunakan dynamic rendering untuk halaman tersebut.

## 13. Styling di Next.js

Next.js mendukung berbagai pendekatan styling:

## CSS Modules

app/about/about.module.css

```
css
.judul{
color: blue;
font-size:24px;
}
tsx
import styles from"./about.module.css";
exportdefaultfunctionAbout(){
return<h1className={styles.judul}>Tentang Kami</h1>;
}
```

## Tailwind CSS

Jika dipilih saat instalasi, Tailwind sudah otomatis terkonfigurasi. Contoh penggunaan:

```
tsx
```


```
exportdefaultfunctionCard(){
return(
<divclassName="p-4 rounded-lg shadow-md bg-white">
<h2className="text-xl font-bold">Judul Kartu</h2>
</div>
);
}
```

## Global CSS

File app/globals.css berlaku untuk seluruh aplikasi dan diimpor sekali di app/layout.tsx .

## 14. Latihan Akhir

- 1. Buat halaman /produk yang menampilkan daftar produk (bisa data dummy dalam array), dan buat dynamic route /produk/[id] untuk menampilkan detail dari masing- masing produk.

- 2. Buat layout.tsx khusus untuk folder /dashboard yang menampilkan sidebar berbeda dari layout utama aplikasi.

- 3. Buat sebuah Route Handler di app/api/produk/route.ts yang mengembalikan data produk dalam format JSON, lalu ambil data tersebut dari sebuah Client Component menggunakan fetch .

- 4. Tambahkan metadata (title dan description ) yang berbeda-beda untuk setiap halaman utama pada proyek latihanmu.

- 5. Buat komponen form pencarian produk sebagai Client Component ("use client" ) yang memfilter daftar produk berdasarkan input pengguna secara real-time.

## Tips Belajar Selanjutnya

- Pelajari Middleware di Next.js untuk menangani autentikasi atau redirect sebelum halaman dirender.

- Pelajari integrasi Next.js dengan database (misalnya Prisma + PostgreSQL, atau MongoDB).

- Pelajari Server Actions untuk menangani submit form langsung dari Server Component tanpa perlu membuat API Route terpisah.

- Coba deploy proyek Next.js ke Vercel untuk melihat proses production build dan hosting secara langsung.

- Pelajari optimasi gambar menggunakan komponen next/image untuk performa loading yang lebih baik.
