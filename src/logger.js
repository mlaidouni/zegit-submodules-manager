/**
 * Ce module fournit des fonctions pour logger les commandes, les sorties et les
 * erreurs. Il s'occupe de tout ce qui touche aux logs et à l'affichage des logs
 * dans le canal de sortie de ZeGit.
 */

const vscode = require('vscode');

// Crée le canal de sortie pour ZeGit
const outputChannel = vscode.window.createOutputChannel('ZeGit');

/**
 * Affiche une commande dans le canal de sortie de ZeGit et montre le canal.
 *
 * @param {any} command La commande à logger
 */
function logCommand(command) {
	outputChannel.appendLine(`[CMD] ${command}`);
	outputChannel.show();
}

/**
 * Affiche une sortie dans le canal de sortie de ZeGit.
 *
 * @param {any} output La sortie à logger
 */
function logOutput(output) {
	if (output.trim()) { outputChannel.appendLine(`[OUT] ${output}`); }
}

/**
 * Affiche une erreur dans le canal de sortie de ZeGit et montre le canal.
 *
 * @param {any} error L'erreur à logger
 */
function logError(error) {
	outputChannel.appendLine(`[ERR] ${error}`);
	outputChannel.show();
}

module.exports = {
	logCommand,
	logOutput,
	logError,
};
