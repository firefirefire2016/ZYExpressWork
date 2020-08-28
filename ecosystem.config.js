module.exports = {
  apps : [{
    name:'ZYexpressApi',
    script: './bin/www',
    instances:1,
    autorestart:true,
    watch: false,
    max_memory_restart:'1G'
  }]

};
