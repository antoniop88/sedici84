module.exports = {
  apps: [
    {
      name: 'sedici84',
      script: '.output/server/index.mjs',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 3003,
        NITRO_PRESET: 'node-server',
        NUXT_PUBLIC_SITE_URL: 'https://sedici84.it',
        NUXT_PUBLIC_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
}
