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
        source: '/privacy-policy',
        destination: '/en/privacy-policy',
        permanent: true,
      },
      {
        source: '/cost-of-studying-in-poland-for-international-students',
        destination: '/en/blog/cost-of-studying-in-poland',
        permanent: true,
      },
      {
        source: '/how-to-apply-to-university-in-poland',
        destination: '/en/blog/how-to-apply-to-university-in-poland',
        permanent: true,
      },
      {
        source: '/studying-in-poland',
        destination: '/en/blog/studying-in-poland',
        permanent: true,
      },
      {
        source: '/student-visa-in-poland-how-to-get-a-student-visa-in-poland',
        destination: '/en/blog/universities-in-poland-for-international-students',
        permanent: true,
      },
      {
        source: '/student-residence-permit-in-poland',
        destination: '/en/blog/student-residence-permit-in-poland',
        permanent: true,
      },
      {
        source: '/specialties-in-polish-universities',
        destination: '/en/blog/specialties-in-polish-universitiesv',
        permanent: true,
      },
      {
        source: '/scholarships-in-poland-how-to-get-a-scholarship-in-poland',
        destination: '/en/blog/how-to-get-a-scholarship-in-poland',
        permanent: true,
      },
      {
        source: '/study-in-poland-2024-admission-in-eu-2024',
        destination: '/en/blog/study-in-poland-2024-or-admission-in-eu-2024',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-bangladesh',
        destination: '/en/blog/study-in-poland-from-bangladesh',
        permanent: true,
      },
      {
        source: '/study-in-poland-for-moroccan',
        destination: '/en/blog/study-in-poland-for-moroccan',
        permanent: true,
      },
      {
        source: '/10-reasons-to-study-in-poland',
        destination: '/en/blog/10-reasons-to-study-in-poland',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-egypt',
        destination: '/en/blog/study-in-poland-from-egypt',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-rwanda',
        destination: '/en/blog/study-in-poland-from-rwanda',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-vietnam',
        destination: '/en/blog/study-in-poland-from-vietnam',
        permanent: true,
      },
      {
        source: '/study-in-poland-from-philippines',
        destination: '/en/blog/study-in-poland-from-philippines',
        permanent: true,
      },
      // Редирект с HTTP на HTTPS
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'academgo.com',
          },
        ],
        destination: 'https://academgo.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
