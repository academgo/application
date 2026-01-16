/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  async redirects() {
    return [
      // ===========================
      // EN redirects
      // ===========================
      { source: '/blog/cost-of-studying-in-poland', destination: '/cost-of-studying-in-poland', permanent: true },
      { source: '/blog/how-to-apply-to-university-in-poland', destination: '/study-in-poland', permanent: true },
      { source: '/blog/studying-in-poland', destination: '/study-in-poland', permanent: true },
      { source: '/blog/universities-in-poland-for-international-students', destination: '/universities-in-poland', permanent: true },
      { source: '/student-residence-permit-in-poland', destination: '/blog/student-residence-permit-in-poland', permanent: true },
      { source: '/blog/specialties-in-polish-universities', destination: '/study-in-poland/degree-programs-in-polish-universities', permanent: true },
      { source: '/blog/how-to-get-a-scholarship-in-poland', destination: '/study-in-poland/scholarships-for-studying-in-poland', permanent: true },
      { source: '/blog/study-in-poland-2024-or-admission-in-eu-2024', destination: '/study-in-poland', permanent: true },
      { source: '/study-in-poland-from-bangladesh', destination: '/blog/study-in-poland-from-bangladesh', permanent: true },
      { source: '/study-in-poland-for-moroccan', destination: '/blog/study-in-poland-for-moroccan', permanent: true },
      { source: '/10-reasons-to-study-in-poland', destination: '/blog/10-reasons-to-study-in-poland', permanent: true },
      { source: '/study-in-poland-from-egypt', destination: '/blog/study-in-poland-from-egypt', permanent: true },
      { source: '/study-in-poland-from-rwanda', destination: '/blog/study-in-poland-from-rwanda', permanent: true },
      { source: '/blog/study-in-poland-from-vietnam', destination: '/study-in-poland/study-in-poland-from-vietnam', permanent: true },
      { source: '/study-in-poland-from-philippines', destination: '/blog/study-in-poland-from-philippines', permanent: true },
      { source: '/blog/student-visa-in-poland-how-to-get-a-student-visa-in-poland', destination: '/student-visa-to-poland', permanent: true },

      { source: '/link', destination: '/', permanent: true },

      // ===========================
      // RU redirects (старые / без /ru)
      // ===========================
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-po-karte-polyaka', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-po-karte-polyaka', permanent: true },
      { source: '/obuchenie-v-polshe/pomosh-v-postuplenii-v-polshu', destination: '/ru/obuchenie-v-polshe/pomosh-v-postuplenii-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-kazakhstancev', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-kazakhstancev', permanent: true },
      { source: '/obuchenie-v-polshe/shkola-polskogo-yazyka-w-polshe', destination: '/ru/obuchenie-v-polshe/shkola-polskogo-yazyka-w-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-russkih', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-russkih', permanent: true },
      { source: '/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-ukraincev', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-ukraincev', permanent: true },
      { source: '/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-belorusov', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-belorusov', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-posle-11-klassa', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-posle-11-klassa', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-posle-9-klassa', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-posle-9-klassa', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-posle-10-klassa', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-posle-10-klassa', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-posle-kolledzha', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-posle-kolledzha', permanent: true },
      { source: '/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe', destination: '/ru/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/stoimost-obucheniya-v-polshe', destination: '/ru/obuchenie-v-polshe/stoimost-obucheniya-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/stipendia-v-polshe', destination: '/ru/obuchenie-v-polshe/stipendia-v-polshe', permanent: true },

      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-belorusskih-studentov', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-belorusskih-studentov', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-ukrainskih-studentov', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-ukrainskih-studentov', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-russkih-studentov', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-russkih-studentov', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-kazakhstanskih-studentov', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-kazakhstanskih-studentov', permanent: true },

      { source: '/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe-dlya-russkih', destination: '/ru/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe-dlya-russkih', permanent: true },
      { source: '/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe-dlya-ukraincev', destination: '/ru/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe-dlya-ukraincev', permanent: true },
      { source: '/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe-dlya-belorusov', destination: '/ru/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe-dlya-belorusov', permanent: true },
      { source: '/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe-dlya-kazakhstancev', destination: '/ru/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe-dlya-kazakhstancev', permanent: true },

      { source: '/obuchenie-v-polshe/kak-postupit-v-polshu', destination: '/ru/obuchenie-v-polshe/kak-postupit-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-dlya-belorusov', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-dlya-belorusov', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-dlya-russkih', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-dlya-russkih', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-dlya-ukraincev', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-dlya-ukraincev', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-dlya-kazakhstancev', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-dlya-kazakhstancev', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-dlya-gruzinov', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-dlya-gruzinov', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-dlya-armyan', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-dlya-armyan', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-dlya-azerbaidzhancev', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-dlya-azerbaidzhancev', permanent: true },

      { source: '/obuchenie-v-polshe/vnzh-v-polshe', destination: '/ru/obuchenie-v-polshe/vnzh-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/vid-na-zhitelstvo-v-polshe', destination: '/ru/obuchenie-v-polshe/vid-na-zhitelstvo-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/karta-pobyta-v-polshe', destination: '/ru/obuchenie-v-polshe/karta-pobyta-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/viza-v-polshu', destination: '/ru/obuchenie-v-polshe/viza-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/studentcheskaya-viza-v-polshu', destination: '/ru/obuchenie-v-polshe/studentcheskaya-viza-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/uchebnaya-viza-v-polshu', destination: '/ru/obuchenie-v-polshe/uchebnaya-viza-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/karta-pobyta', destination: '/ru/obuchenie-v-polshe/karta-pobyta', permanent: true },
      { source: '/obuchenie-v-polshe/karta-pobyta-dlya-studentov', destination: '/ru/obuchenie-v-polshe/karta-pobyta-dlya-studentov', permanent: true },

      { source: '/obuchenie-v-polshe/zhizn-v-polshe', destination: '/ru/obuchenie-v-polshe/zhizn-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/rabota-v-polshe', destination: '/ru/obuchenie-v-polshe/rabota-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/zarplata-v-polshe', destination: '/ru/obuchenie-v-polshe/zarplata-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/stoimost-zhizni-v-polshe', destination: '/ru/obuchenie-v-polshe/stoimost-zhizni-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/prozhivanie-v-polshe', destination: '/ru/obuchenie-v-polshe/prozhivanie-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/registraciya-v-polshe', destination: '/ru/obuchenie-v-polshe/registraciya-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/medicina-v-polshe', destination: '/ru/obuchenie-v-polshe/medicina-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/strahovka-v-polshe', destination: '/ru/obuchenie-v-polshe/strahovka-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/transport-v-polshe', destination: '/ru/obuchenie-v-polshe/transport-v-polshe', permanent: true },

      { source: '/obuchenie-v-polshe/goroda-polshi', destination: '/ru/obuchenie-v-polshe/goroda-polshi', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-varshave', destination: '/ru/obuchenie-v-polshe/zhizn-v-varshave', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-krakove', destination: '/ru/obuchenie-v-polshe/zhizn-v-krakove', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-vroclave', destination: '/ru/obuchenie-v-polshe/zhizn-v-vroclave', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-gdansku', destination: '/ru/obuchenie-v-polshe/zhizn-v-gdansku', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-poznani', destination: '/ru/obuchenie-v-polshe/zhizn-v-poznani', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-lodz', destination: '/ru/obuchenie-v-polshe/zhizn-v-lodz', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-lyublin', destination: '/ru/obuchenie-v-polshe/zhizn-v-lyublin', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-shchetsin', destination: '/ru/obuchenie-v-polshe/zhizn-v-shchetsin', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-bydgoszcz', destination: '/ru/obuchenie-v-polshe/zhizn-v-bydgoszcz', permanent: true },
      { source: '/obuchenie-v-polshe/zhizn-v-bialystok', destination: '/ru/obuchenie-v-polshe/zhizn-v-bialystok', permanent: true },

      { source: '/obuchenie-v-polshe/kakie-dokumenty-nuzhny-dlya-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/kakie-dokumenty-nuzhny-dlya-postupleniya-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/dokumenty-dlya-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/dokumenty-dlya-postupleniya-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/vstuplitelnie-ekzameny-v-polshu', destination: '/ru/obuchenie-v-polshe/vstuplitelnie-ekzameny-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/kogda-nachinaetsya-obuchenie-v-polshe', destination: '/ru/obuchenie-v-polshe/kogda-nachinaetsya-obuchenie-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/kogda-nachinaetsya-ucheba-v-polshe', destination: '/ru/obuchenie-v-polshe/kogda-nachinaetsya-ucheba-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/kak-vybrat-vuz-v-polshe', destination: '/ru/obuchenie-v-polshe/kak-vybrat-vuz-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/kakie-vuzy-v-polshe-luchshie', destination: '/ru/obuchenie-v-polshe/kakie-vuzy-v-polshe-luchshie', permanent: true },
      { source: '/obuchenie-v-polshe/reyting-vuzov-polshi', destination: '/ru/obuchenie-v-polshe/reyting-vuzov-polshi', permanent: true },
      { source: '/obuchenie-v-polshe/top-vuzov-polshi', destination: '/ru/obuchenie-v-polshe/top-vuzov-polshi', permanent: true },
      { source: '/obuchenie-v-polshe/populyarnye-specialnosti-v-polshe', destination: '/ru/obuchenie-v-polshe/populyarnye-specialnosti-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/specialnosti-v-polshe', destination: '/ru/obuchenie-v-polshe/specialnosti-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/fakultety-v-polshe', destination: '/ru/obuchenie-v-polshe/fakultety-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/fakultety-vuzov-polshi', destination: '/ru/obuchenie-v-polshe/fakultety-vuzov-polshi', permanent: true },
      { source: '/obuchenie-v-polshe/kak-poluchit-stipendiu-v-polshe', destination: '/ru/obuchenie-v-polshe/kak-poluchit-stipendiu-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/granty-na-obuchenie-v-polshe', destination: '/ru/obuchenie-v-polshe/granty-na-obuchenie-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/sroki-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu', permanent: true },
      { source: '/obuchenie-v-polshe/sroki-postupleniya-v-polshu-2025', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu-2025', permanent: true },
      { source: '/obuchenie-v-polshe/sroki-postupleniya-v-polshu-2026', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu-2026', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-v-2025', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-v-2025', permanent: true },
      { source: '/obuchenie-v-polshe/postuplenie-v-polshu-v-2026', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-v-2026', permanent: true },
      { source: '/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-v-2025', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-v-2025', permanent: true },
      { source: '/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-v-2026', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-v-2026', permanent: true },
      { source: '/obuchenie-v-polshe/stipendii-v-polshe', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe', permanent: true },
      { source: '/obuchenie-v-polshe/stipendii-v-polshe-2025', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe-2025', permanent: true },
      { source: '/obuchenie-v-polshe/stipendii-v-polshe-2026', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe-2026', permanent: true },

      { source: '/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-kz', destination: '/ru/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-kz', permanent: true },
      { source: '/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-rf', destination: '/ru/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-rf', permanent: true },
      { source: '/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-ukrainy', destination: '/ru/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-ukrainy', permanent: true },
      { source: '/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-belarusi', destination: '/ru/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-belarusi', permanent: true },
      { source: '/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-gruzii', destination: '/ru/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-gruzii', permanent: true },
      { source: '/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-armenii', destination: '/ru/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-armenii', permanent: true },
      { source: '/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-azerbaidzhana', destination: '/ru/obuchenie-v-polshe/obuchenie-v-polshe-dlya-grazhdan-azerbaidzhana', permanent: true },

      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-kz', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-kz', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-rf', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-rf', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-ukrainy', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-ukrainy', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-belarusi', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-belarusi', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-gruzii', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-gruzii', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-armenii', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-armenii', permanent: true },
      { source: '/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-azerbaidzhana', destination: '/ru/obuchenie-v-polshe/obrazovanie-v-polshe-dlya-grazhdan-azerbaidzhana', permanent: true },

      // ===========================
      // RU blog -> RU singlepages (уникальные)
      // ===========================
      { source: '/blog/stipendii-v-polshe-kak-poluchit-stipendiu-w-polshe', destination: '/ru/obuchenie-v-polshe/granty-na-obuchenie-v-polshe', permanent: true },
      { source: '/ru/blog/stipendii-v-polshe-kak-poluchit-stipendiu-w-polshe', destination: '/ru/obuchenie-v-polshe/granty-na-obuchenie-v-polshe', permanent: true },

      { source: '/blog/stipendii-v-polshe', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe', permanent: true },
      { source: '/ru/blog/stipendii-v-polshe', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe', permanent: true },

      { source: '/blog/postuplenie-v-polshu', destination: '/ru/obuchenie-v-polshe/kak-postupit-v-polshu', permanent: true },
      { source: '/ru/blog/postuplenie-v-polshu', destination: '/ru/obuchenie-v-polshe/kak-postupit-v-polshu', permanent: true },

      { source: '/blog/obrazovanie-v-polshe', destination: '/ru/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe', permanent: true },
      { source: '/ru/blog/obrazovanie-v-polshe', destination: '/ru/obuchenie-v-polshe/vysshee-obrazovanie-v-polshe', permanent: true },

      { source: '/blog/besplatnoe-obrazovanie-v-polshe', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe', permanent: true },
      { source: '/ru/blog/besplatnoe-obrazovanie-v-polshe', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe', permanent: true },

      { source: '/blog/sroki-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu', permanent: true },
      { source: '/ru/blog/sroki-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu', permanent: true },

      { source: '/blog/kak-vybrat-vuz-v-polshe', destination: '/ru/obuchenie-v-polshe/kak-vybrat-vuz-v-polshe', permanent: true },
      { source: '/ru/blog/kak-vybrat-vuz-v-polshe', destination: '/ru/obuchenie-v-polshe/kak-vybrat-vuz-v-polshe', permanent: true },

      { source: '/blog/specialnosti-v-polshe', destination: '/ru/obuchenie-v-polshe/specialnosti-v-polshe', permanent: true },
      { source: '/ru/blog/specialnosti-v-polshe', destination: '/ru/obuchenie-v-polshe/specialnosti-v-polshe', permanent: true },

      { source: '/blog/studenskaya-viza-v-polshu', destination: '/ru/obuchenie-v-polshe/studentcheskaya-viza-v-polshu', permanent: true },
      { source: '/ru/blog/studenskaya-viza-v-polshu', destination: '/ru/obuchenie-v-polshe/studentcheskaya-viza-v-polshu', permanent: true },

      { source: '/blog/rabota-v-polshe-dlya-studentov', destination: '/ru/obuchenie-v-polshe/rabota-v-polshe', permanent: true },
      { source: '/ru/blog/rabota-v-polshe-dlya-studentov', destination: '/ru/obuchenie-v-polshe/rabota-v-polshe', permanent: true },

      { source: '/blog/stoimost-zhizni-v-polshe', destination: '/ru/obuchenie-v-polshe/stoimost-zhizni-v-polshe', permanent: true },
      { source: '/ru/blog/stoimost-zhizni-v-polshe', destination: '/ru/obuchenie-v-polshe/stoimost-zhizni-v-polshe', permanent: true },

      { source: '/blog/prozhivanie-v-polshe', destination: '/ru/obuchenie-v-polshe/prozhivanie-v-polshe', permanent: true },
      { source: '/ru/blog/prozhivanie-v-polshe', destination: '/ru/obuchenie-v-polshe/prozhivanie-v-polshe', permanent: true },

      { source: '/blog/medicina-v-polshe', destination: '/ru/obuchenie-v-polshe/medicina-v-polshe', permanent: true },
      { source: '/ru/blog/medicina-v-polshe', destination: '/ru/obuchenie-v-polshe/medicina-v-polshe', permanent: true },

      { source: '/blog/transport-v-polshe', destination: '/ru/obuchenie-v-polshe/transport-v-polshe', permanent: true },
      { source: '/ru/blog/transport-v-polshe', destination: '/ru/obuchenie-v-polshe/transport-v-polshe', permanent: true },

      { source: '/blog/goroda-polshi', destination: '/ru/obuchenie-v-polshe/goroda-polshi', permanent: true },
      { source: '/ru/blog/goroda-polshi', destination: '/ru/obuchenie-v-polshe/goroda-polshi', permanent: true },

      { source: '/blog/zhizn-v-varshave', destination: '/ru/obuchenie-v-polshe/zhizn-v-varshave', permanent: true },
      { source: '/ru/blog/zhizn-v-varshave', destination: '/ru/obuchenie-v-polshe/zhizn-v-varshave', permanent: true },

      { source: '/blog/zhizn-v-krakove', destination: '/ru/obuchenie-v-polshe/zhizn-v-krakove', permanent: true },
      { source: '/ru/blog/zhizn-v-krakove', destination: '/ru/obuchenie-v-polshe/zhizn-v-krakove', permanent: true },

      { source: '/blog/zhizn-v-vroclave', destination: '/ru/obuchenie-v-polshe/zhizn-v-vroclave', permanent: true },
      { source: '/ru/blog/zhizn-v-vroclave', destination: '/ru/obuchenie-v-polshe/zhizn-v-vroclave', permanent: true },

      { source: '/blog/zhizn-v-gdansku', destination: '/ru/obuchenie-v-polshe/zhizn-v-gdansku', permanent: true },
      { source: '/ru/blog/zhizn-v-gdansku', destination: '/ru/obuchenie-v-polshe/zhizn-v-gdansku', permanent: true },

      { source: '/blog/zhizn-v-poznani', destination: '/ru/obuchenie-v-polshe/zhizn-v-poznani', permanent: true },
      { source: '/ru/blog/zhizn-v-poznani', destination: '/ru/obuchenie-v-polshe/zhizn-v-poznani', permanent: true },

      { source: '/blog/zhizn-v-lodz', destination: '/ru/obuchenie-v-polshe/zhizn-v-lodz', permanent: true },
      { source: '/ru/blog/zhizn-v-lodz', destination: '/ru/obuchenie-v-polshe/zhizn-v-lodz', permanent: true },

      { source: '/blog/zhizn-v-lyublin', destination: '/ru/obuchenie-v-polshe/zhizn-v-lyublin', permanent: true },
      { source: '/ru/blog/zhizn-v-lyublin', destination: '/ru/obuchenie-v-polshe/zhizn-v-lyublin', permanent: true },

      { source: '/blog/zhizn-v-shchetsin', destination: '/ru/obuchenie-v-polshe/zhizn-v-shchetsin', permanent: true },
      { source: '/ru/blog/zhizn-v-shchetsin', destination: '/ru/obuchenie-v-polshe/zhizn-v-shchetsin', permanent: true },

      { source: '/blog/zhizn-v-bydgoszcz', destination: '/ru/obuchenie-v-polshe/zhizn-v-bydgoszcz', permanent: true },
      { source: '/ru/blog/zhizn-v-bydgoszcz', destination: '/ru/obuchenie-v-polshe/zhizn-v-bydgoszcz', permanent: true },

      { source: '/blog/zhizn-v-bialystok', destination: '/ru/obuchenie-v-polshe/zhizn-v-bialystok', permanent: true },
      { source: '/ru/blog/zhizn-v-bialystok', destination: '/ru/obuchenie-v-polshe/zhizn-v-bialystok', permanent: true },

      { source: '/blog/kakie-dokumenty-nuzhny-dlya-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/kakie-dokumenty-nuzhny-dlya-postupleniya-v-polshu', permanent: true },
      { source: '/ru/blog/kakie-dokumenty-nuzhny-dlya-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/kakie-dokumenty-nuzhny-dlya-postupleniya-v-polshu', permanent: true },

      { source: '/blog/dokumenty-dlya-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/dokumenty-dlya-postupleniya-v-polshu', permanent: true },
      { source: '/ru/blog/dokumenty-dlya-postupleniya-v-polshu', destination: '/ru/obuchenie-v-polshe/dokumenty-dlya-postupleniya-v-polshu', permanent: true },

      { source: '/blog/vstuplitelnie-ekzameny-v-polshu', destination: '/ru/obuchenie-v-polshe/vstuplitelnie-ekzameny-v-polshu', permanent: true },
      { source: '/ru/blog/vstuplitelnie-ekzameny-v-polshu', destination: '/ru/obuchenie-v-polshe/vstuplitelnie-ekzameny-v-polshu', permanent: true },

      { source: '/blog/kogda-nachinaetsya-ucheba-v-polshe', destination: '/ru/obuchenie-v-polshe/kogda-nachinaetsya-ucheba-v-polshe', permanent: true },
      { source: '/ru/blog/kogda-nachinaetsya-ucheba-v-polshe', destination: '/ru/obuchenie-v-polshe/kogda-nachinaetsya-ucheba-v-polshe', permanent: true },

      { source: '/blog/top-vuzov-polshi', destination: '/ru/obuchenie-v-polshe/top-vuzov-polshi', permanent: true },
      { source: '/ru/blog/top-vuzov-polshi', destination: '/ru/obuchenie-v-polshe/top-vuzov-polshi', permanent: true },

      { source: '/blog/fakultety-vuzov-polshi', destination: '/ru/obuchenie-v-polshe/fakultety-vuzov-polshi', permanent: true },
      { source: '/ru/blog/fakultety-vuzov-polshi', destination: '/ru/obuchenie-v-polshe/fakultety-vuzov-polshi', permanent: true },

      { source: '/blog/granty-na-obuchenie-v-polshe', destination: '/ru/obuchenie-v-polshe/granty-na-obuchenie-v-polshe', permanent: true },
      { source: '/ru/blog/granty-na-obuchenie-v-polshe', destination: '/ru/obuchenie-v-polshe/granty-na-obuchenie-v-polshe', permanent: true },

      { source: '/blog/stipendii-v-polshe-2025', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe-2025', permanent: true },
      { source: '/ru/blog/stipendii-v-polshe-2025', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe-2025', permanent: true },

      { source: '/blog/stipendii-v-polshe-2026', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe-2026', permanent: true },
      { source: '/ru/blog/stipendii-v-polshe-2026', destination: '/ru/obuchenie-v-polshe/stipendii-v-polshe-2026', permanent: true },

      { source: '/blog/postuplenie-v-polshu-v-2025', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-v-2025', permanent: true },
      { source: '/ru/blog/postuplenie-v-polshu-v-2025', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-v-2025', permanent: true },

      { source: '/blog/postuplenie-v-polshu-v-2026', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-v-2026', permanent: true },
      { source: '/ru/blog/postuplenie-v-polshu-v-2026', destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-v-2026', permanent: true },

      { source: '/blog/besplatnoe-obrazovanie-v-polshe-v-2025', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-v-2025', permanent: true },
      { source: '/ru/blog/besplatnoe-obrazovanie-v-polshe-v-2025', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-v-2025', permanent: true },

      { source: '/blog/besplatnoe-obrazovanie-v-polshe-v-2026', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-v-2026', permanent: true },
      { source: '/ru/blog/besplatnoe-obrazovanie-v-polshe-v-2026', destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-v-2026', permanent: true },

      { source: '/blog/sroki-postupleniya-v-polshu-2025', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu-2025', permanent: true },
      { source: '/ru/blog/sroki-postupleniya-v-polshu-2025', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu-2025', permanent: true },

      { source: '/blog/sroki-postupleniya-v-polshu-2026', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu-2026', permanent: true },
      { source: '/ru/blog/sroki-postupleniya-v-polshu-2026', destination: '/ru/obuchenie-v-polshe/sroki-postupleniya-v-polshu-2026', permanent: true },

      // ===========================
      // Trailing slash cleanup (не трогает корень)
      // ===========================
      { source: '/:path((?!$).*)/', destination: '/:path', permanent: true },
    ];
  },
};

export default nextConfig;
