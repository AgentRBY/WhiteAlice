module.exports = {
  apps: [
    {
      name: 'hentailibbot',
      script: './dist/app.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
