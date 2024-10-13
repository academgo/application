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
    ];
  },
};

export default nextConfig;
