const {executeGitCommand} = require('./gitCommands');

/**
 * Récupère la liste des submodules du dépôt.
 *
 * @param {string} rootPath Le chemin du dépôt
 * @param {function} callback La fonction callback à appeler après la
 *     récupération des submodules
 */
function getSubmodules(rootPath, callback) {
	const command =
	    'git config --file .gitmodules --name-only --get-regexp path';

	executeGitCommand(command, {cwd: rootPath}, (err, stdout) => {
		// On définit la fonction de callback à appeler après l'exécution de la
		// commande
		if (err) {
			callback(
			    err, null);  // On appelle la fonction callback avec l'erreur
			return;
		}

		// On récupère les noms des submodules, en retirant les parties inutiles
		const submodules = stdout.trim().split('\n').map(
		    (line) => line.replace('submodule.', '').replace('.path', ''));
		callback(null, submodules);
	});
}

module.exports = {
	getSubmodules,
};
