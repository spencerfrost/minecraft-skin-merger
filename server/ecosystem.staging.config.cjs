module.exports = {
  apps: [{
    name: 'MCSkinMerger-Staging',
    script: 'dist/server.mjs',  // Note: Updated to .mjs to match rollup output
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    },
    watch: true,
    ignore_watch: ['node_modules', 'public', 'uploads'],
    max_memory_restart: '300M'
  }]
}
