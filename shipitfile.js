module.exports = shipit => {
	// Load shipit-deploy tasks
	require('shipit-deploy')(shipit)

	shipit.initConfig({
		default: {
			// workspace: '/home/ubuntu/test-node',
			deployTo: '/home/ubuntu/test-node',
			repositoryUrl: 'https://github.com/wachira90/test-node.git',
		},
		staging: {
			servers: 'ubuntu@172.16.1.5'
		},
	})
}
