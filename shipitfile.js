module.exports = shipit => {
    require('shipit-deploy')(shipit);
    require('shipit-shared')(shipit);

    const appName = 'test-node';

    shipit.initConfig({
        default: {
            deployTo: '/home/ubuntu/test-node',
            repositoryUrl: 'https://github.com/wachira90/test-node.git',
            keepReleases: 5,
            shared: {
                overwrite: true,
                dirs: ['node_modules']
            }
        },
        production: {
            servers: 'ubuntu@172.16.1.5'
        }
    });

    const path = require('path');
    const ecosystemFilePath = path.join(
        shipit.config.deployTo,
        'shared',
        'ecosystem.config.js'
    );

    // Our listeners and tasks will go here
    shipit.on('updated', async () => {
        shipit.start('npm-install', 'copy-config');
    });

    shipit.on('published', async () => {
        shipit.start('pm2-server');
    });

    shipit.blTask('copy-config', async () => {
        const fs = require('fs');
        const ecosystem = `
            module.exports = {
              apps: [
                {
                  name: '${appName}',
                  script: '${shipit.releasePath}/server.js',
                  watch: true,
                  autorestart: true,
                  restart_delay: 1000,
                  env: {
                    NODE_ENV: 'development'
                  },
                  env_production: {
                    NODE_ENV: 'production'
                  }
                }
              ]
            };`;

        fs.writeFileSync('ecosystem.config.js', ecosystem, function (err) {
            if (err) throw err;
            console.log('File created successfully.');
        });

        await shipit.copyToRemote('ecosystem.config.js', ecosystemFilePath);
    });

    shipit.task('npm-install', async () => {
//        shipit.remote(`cd ${shipit.releasePath} && npm install --production`);
//        shipit.remote(`cd ${shipit.releasePath} && yarn install`);
        shipit.remote(`cd ${shipit.releasePath} && yarn install`);
    });

    shipit.task('pm2-server', async () => {
//         await shipit.remote(`pm2 delete -s ${appName} || :`);
        await shipit.remote(`pm2 delete -s ${appName} || :`);
        await shipit.remote(`pm2 start ${ecosystemFilePath} --env production --watch true`);
    });
};
