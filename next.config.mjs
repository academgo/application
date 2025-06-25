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
        source: '/blog/cost-of-studying-in-poland',
        destination: '/cost-of-studying-in-poland',
        permanent: true,
      },
      {
        source: '/blog/how-to-apply-to-university-in-poland',
        destination: '/study-in-poland',
        permanent: true,
      },
      {
        source: '/blog/studying-in-poland',
        destination: '/study-in-poland',
        permanent: true,
      },
      {
        source: '/blog/universities-in-poland-for-international-students',
        destination: '/universities-in-poland',
        permanent: true,
      },
      {
        source: '/student-residence-permit-in-poland',
        destination: '/blog/student-residence-permit-in-poland',
        permanent: true,
      },
      {
        source: '/blog/specialties-in-polish-universities',
        destination: 'study-in-poland/degree-programs-in-polish-universities',
        permanent: true,
      },
      {
        source: '/blog/how-to-get-a-scholarship-in-poland',
        destination: '/study-in-poland/scholarships-for-studying-in-poland',
        permanent: true,
      },
      {
        source: '/blog/study-in-poland-2024-or-admission-in-eu-2024',
        destination: '/study-in-poland',
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
        source: '/blog/study-in-poland-from-vietnam',
        destination: '/study-in-poland/study-in-poland-from-vietnam',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-philippines',
        destination: '/blog/study-in-poland-from-philippines',
        permanent: true,
      },
      {
        source: '/blog/cost-of-studying-in-poland',
        destination: '/cost-of-studying-in-poland',
        permanent: true,
      },
      {
        source: '/blog/student-visa-in-poland-how-to-get-a-student-visa-in-poland',
        destination: '/student-visa-to-poland',
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
