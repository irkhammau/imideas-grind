module.exports = {
  apps: [
    {
      name: "grind-next",
      script: "npm",
      args: "run start",
      cwd: "/var/www/grind-app",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
