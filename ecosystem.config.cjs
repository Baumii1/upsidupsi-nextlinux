module.exports = {
  apps: [
    {
      name: "upsidupsi",
      cwd: "/var/www/upsidupsi",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        // nur serverseitig genutzt – NICHT als NEXT_PUBLIC_* herausgeben!
        MC_BETTERMC1_RCON: "2daND-2e09v-FDLF2-nV89d-Dvtv3-awnF2",
        // optional: falls sich HOST/PORT im Status-Route ändern sollen
        // MC_BETTERMC1_HOST: "127.0.0.1",
        // MC_BETTERMC1_PORT: "25575",
      },
      max_memory_restart: "512M",
      watch: false
    }
  ]
}
