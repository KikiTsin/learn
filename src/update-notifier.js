const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
// todo
// Spawn a detached process, passing the options as an environment property
// process.execPath: '/usr/local/bin/node'
// spawn(process.execPath, [path.join(__dirname, 'check.js'), JSON.stringify(this.options)], {
//     detached: true,
//     stdio: 'ignore'
// }).unref();
// Checks for available update and returns an instance
const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000
});

// Notify using the built-in convenience method
notifier.notify();

// `notifier.update` contains some useful info about the update
// notifier.update : {
// 	latest: '1.0.1',
// 	current: '1.0.0',
// 	type: 'patch', // Possible values: latest, major, minor, patch, prerelease, build
// 	name: 'pageres'
// }

// notifier = {
//     options: {
//       pkg: { name: 'learn', version: '1.0.0' },
//       updateCheckInterval: 604800000,
//       distTag: 'latest'
//     },
//     packageName: 'learn',
//     packageVersion: '1.0.0',
//     updateCheckInterval: 604800000,
//     disabled: false,
//     shouldNotifyInNpmScript: undefined,
//     config: Configstore {
//       path: '/Users/kikitsin/.config/configstore/update-notifier-learn.json'
//     },
//     update: undefined
//   }
console.log(notifier);