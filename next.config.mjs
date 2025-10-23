/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Ensure config.yml is served with correct MIME type for Decap CMS
        source: '/admin/config.yml',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/yaml; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
