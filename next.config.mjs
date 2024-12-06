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
      {
        source: '/about',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/why-poland',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/universities',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/ru/blog/besplatnoe-obrazovanie-v-polshe-dlya-kazakhstancev',
        destination: '/ru/obuchenie-v-polshe/besplatnoe-obrazovanie-v-polshe-dlya-kazakhstancev',
        permanent: true,
      },
      {
        source: '/ru/blog/universitety-v-polshe-dla-inostrancev',
        destination: '/ru/vuzy-polshi',
        permanent: true,
      },
      {
        source: '/ru/blog/stoimost-obucheniya-v-polshe',
        destination: '/ru/stoimost-obucheniya-v-polshe ',
        permanent: true,
      },
      {
        source: '/ru/blog/postuplenie-v-polshu-dlya-belorusov',
        destination: '/ru/obuchenie-v-polshe/obuchenie-dlya-belorusov-v-polshe ',
        permanent: true,
      },
      {
        source: '/ru/blog/postuplenie-v-polshu-dlya-kazakhstancev',
        destination: '/ru/obuchenie-v-polshe/obuchenie-v-polshe-dlya-kazakhstancev ',
        permanent: true,
      },
      {
        source: '/ru/blog/postuplenie-v-polshu-dlya-ukraincev',
        destination: '/ru/obuchenie-v-polshe/ucheba-v-polshe-dlya-ukraincev',
        permanent: true,
      },
      {
        source: '/ru/blog/postuplenie-v-polshu-s-kartoi-polyaka',
        destination: '/ru/obuchenie-v-polshe/postuplenie-v-polshu-po-karte-polyaka',
        permanent: true,
      },
      {
        source: '/ru/blog/studencheskaya-viza-v-polshu-dlya-belorusov',
        destination: '/ru/studencheskaya-viza/studencheskaya-viza-v-polshu-dlya-belorusov',
        permanent: true,
      },
      {
        source: '/ru/blog/yuridicheskoe-obrazovanie-v-polshe',
        destination: '/ru/vuzy-polshi/yuridicheskoe-obrazovanie-v-polshe',
        permanent: true,
      },
      {
        source: '/ru/blog/studencheskaya-viza-v-polshu-dlya-ukraincev',
        destination: '/ru/studencheskaya-viza/studencheskaya-viza-v-polshu-dlya-ukraincev',
        permanent: true,
      },
      {
        source: '/ru/blog/polushenie-studencheskoi-vizy',
        destination: '/ru/studencheskaya-viza',
        permanent: true,
      },
      {
        source: '/ru/blog/kak-postupit-v-polshu ',
        destination: '/ru/obuchenie-v-polshe',
        permanent: true,
      },
      {
        source: '/ru/blog/obuchenie-v-polshe',
        destination: '/ru/obuchenie-v-polshe',
        permanent: true,
      },
      {
        source: '/ru/blog/postuplenie-v-polshu-v-2024-godu',
        destination: '/ru/obuchenie-v-polshe',
        permanent: true,
      },
      {
        source: '/cost-of-studying-in-poland-for-international-students',
        destination: '/blog/cost-of-studying-in-poland',
        permanent: true,
      },
      {
        source: '/how-to-apply-to-university-in-poland',
        destination: '/blog/how-to-apply-to-university-in-poland',
        permanent: true,
      },
      {
        source: '/studying-in-poland',
        destination: '/blog/studying-in-poland',
        permanent: true,
      },
      {
        source: '/student-visa-in-poland-how-to-get-a-student-visa-in-poland',
        destination: '/blog/universities-in-poland-for-international-students',
        permanent: true,
      },
      {
        source: '/student-residence-permit-in-poland',
        destination: '/blog/student-residence-permit-in-poland',
        permanent: true,
      },
      {
        source: '/specialties-in-polish-universities',
        destination: '/blog/specialties-in-polish-universitiesv',
        permanent: true,
      },
      {
        source: '/scholarships-in-poland-how-to-get-a-scholarship-in-poland',
        destination: '/blog/how-to-get-a-scholarship-in-poland',
        permanent: true,
      },
      {
        source: '/study-in-poland-2024-admission-in-eu-2024',
        destination: '/blog/study-in-poland-2024-or-admission-in-eu-2024',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-bangladesh',
        destination: '/blog/study-in-poland-from-bangladesh',
        permanent: true,
      },
      {
        source: '/study-in-poland-for-moroccan',
        destination: '/blog/study-in-poland-for-moroccan',
        permanent: true,
      },
      {
        source: '/10-reasons-to-study-in-poland',
        destination: '/blog/10-reasons-to-study-in-poland',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-egypt',
        destination: '/blog/study-in-poland-from-egypt',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-rwanda',
        destination: '/blog/study-in-poland-from-rwanda',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-vietnam',
        destination: '/blog/study-in-poland-from-vietnam',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-philippines',
        destination: '/blog/study-in-poland-from-philippines',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.htm',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/en',
        permanent: true,
      },
      // Удаление завершающего слеша, исключая корень сайта
      {
        source: '/:path*/',
        has: [
          {
            type: 'query',
            key: 'path',
            value: '^((?!^$).)*$', // исключает корневой маршрут
          },
        ],
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
