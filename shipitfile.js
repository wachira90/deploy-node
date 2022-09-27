module.exports = shipit => {
    require('shipit-deploy')(shipit);
    require('shipit-shared')(shipit);

    const appName = 'test-node';

    shipit.initConfig({
        default: {
            workspace: '/home/ubuntu/test-node',
            deployTo: '/home/ubuntu/test-node',
            repositoryUrl: 'https://github.com/wachira90/test-node.git',
            ignores: ['.git', 'node_modules'],
            keepReleases: 5,
            keepWorkspace: false, // should we remove workspace dir after deploy?
            deleteOnRollback: false,
//            key: '/path/to/key',
            shallowClone: true,
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
        'ecosystem.config.js',
        'install_package.sh',
        'install_service.sh'
    );

    // Our listeners and tasks will go here
    shipit.on('updated', async () => {
        shipit.start('npm-install', 'copy-config');
    });

    shipit.on('published', async () => {
        shipit.start('pm2-server');
    });

//=======================    
    
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

//=======================
    
    	shipit.blTask('copy-config2', async () => {
        const fs = require('fs');
        const ecosystem = `
#! /bin/bash
yarn install
`;

        fs.writeFileSync('install_package.sh', ecosystem, function (err) {
            if (err) throw err;
            console.log('install_package.sh File created successfully.');
        });

        await shipit.copyToRemote('install_package.sh', ecosystemFilePath);
    });	
  
//=======================

 shipit.blTask('copy-config3', async () => {
        const fs = require('fs');
        const ecosystem = `
#! /bin/bash
pm2 start ${shipit.releasePath}/server.js --env production --watch true --name ${appName}
`;
//pm2 delete -s ${appName}
        fs.writeFileSync('install_service.sh', ecosystem, function (err) {
            if (err) throw err;
            console.log('install_service.sh File created successfully.');
        });

        await shipit.copyToRemote('install_service.sh', ecosystemFilePath);
    });
    
//=======================    
    
    shipit.blTask('npm-install', async () => {
//         await shipit.remote(`echo "npm install cmd"`);
//        shipit.remote(`cd ${shipit.releasePath} && npm install --production`);
//        shipit.remote(`cd ${shipit.releasePath} && yarn install`);
        shipit.remote(`cd ${shipit.releasePath} && ./install_pkg.sh`);
//        shipit.remote(`cd ${shipit.releasePath} && bash yarn install`);
    });

    shipit.blTask('pm2-server', async () => {
//         await shipit.remote(`echo ${ecosystemFilePath}`);
//         await shipit.remote(`pm2 delete -s ${appName} || :`);
        
//        await shipit.remote(`pm2 delete -s ${appName} || :`);
//        await shipit.remote(`pm2 start ${ecosystemFilePath} --env production --watch true`);
        
        await shipit.remote('./install_service.sh');
    });
};
