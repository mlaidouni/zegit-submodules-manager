/**
 * Ce module fournit des fonctions pour gére et exécute les commandes git. Il
 * s'occupe de tout ce qui touche aux commandes git et à l'exécution de ces
 * commandes.
 */

const {exec} = require('child_process');
const {logCommand, logError, logOutput} = require('./logger');

/**
 * Exécute une commande git.
 *
 * @param {string} command La commande git à exécuter
 * @param {any} options Les options à passer à la commande
 * @param {function} callback La fonction callback à appeler après l'exécution
 *     de la commande
 */
function executeGitCommand(command, options, callback) {
	// On commence par afficher la commande à exécuter dans le canal.
	logCommand(command);

	/**
	 * On exécute la commande git.
	 *
	 * @param {any} err L'erreur retournée par la commande
	 * @param {any} stdout La sortie standard de la commande
	 * @param {any} stderr La sortie d'erreur de la commande
	 */
	exec(command, options, (err, stdout, stderr) => {
		// Une fois que la commande a été exécutée, on vérifie s'il y a une
		// erreur.
		if (err) {
			// On l'affiche dans le canal de sortie
			logError(stderr);
			// On appelle la fonction callback avec l'erreur
			callback(err, null);
			return;  // On sort de la fonction
		}

		// Si tout s'est bien passé, on affiche la sortie standard dans le canal
		// de sortie
		logOutput(stdout);
		// On appelle la fonction callback avec la sortie standard
		callback(null, stdout);
	});
}

module.exports = {
	executeGitCommand,
};
