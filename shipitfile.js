
module.exports = shipit => {
	// Load shipit-deploy tasks
	require('shipit-deploy')(shipit)


	// shipit.on('updated', async () => {
	// 	shipit.start('npm-install', 'copy-config', 'copy-config2', 'copy-config3', 'permission-config');
	// });

	shipit.on('published', async () => {
		shipit.start('pm2-server');
	});



	shipit.initConfig({
		default: {
			workspace: '/home/ubuntu/test-node',
			deployTo: '/home/ubuntu/test-node',
			repositoryUrl: 'https://github.com/wachira90/test-node.git',
		},
		staging: {
			servers: 'ubuntu@172.16.1.5'
		},
	})

	shipit.blTask('pm2-server', async () => {
		await shipit.remote(`export`);
	});


}
