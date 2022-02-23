module.exports = {
  apps: [
    {
      name: 'touch-whale-erp',
      script: './server/dist/server.js',
      watch: false,
      ignore_watch: ['[\\/\\\\]\\./', '.git', 'downloads'],
      instance_var: 'IINSTANCE_ID',
      max_memory_restart: '100G',
      env: {
        PORT: 5000,
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
}
