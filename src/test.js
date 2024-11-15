const vscode = require('vscode');
const {SubmodulesProvider} = require('./submodulesTreeView');
const {logCommand, logOutput, logError} = require('./logger');
const {executeGitCommand} = require('./gitCommands');
const {getSubmodules} = require('./utils');

function activate(context) {
	console.log(
	    'Congratulations, your extension "zegit-submodules-manager" is now active!');

	const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
	const git = gitExtension.getAPI(1);

	if (!git) {
		vscode.window.showErrorMessage(
		    'L\'extension Git de VS Code n\'est pas activée.');
		return;
	}

	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showErrorMessage('Aucun projet ouvert.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const submodulesProvider = new SubmodulesProvider(rootPath, git);

	vscode.window.registerTreeDataProvider(
	    'submodulesView', submodulesProvider);

	const refreshSubmodulesCommand = vscode.commands.registerCommand(
	    'zegit-submodules-manager.refreshSubmodules',
	    () => submodulesProvider.refresh());

	const initAllSubmodulesCommand = vscode.commands.registerCommand(
	    'zegit-submodules-manager.initAllSubmodules', function() {
		    const command = 'git submodule update --init --recursive';
		    executeGitCommand(command, {cwd: rootPath}, (err) => {
			    if (err) {
				    vscode.window.showErrorMessage(
				        `Erreur lors de l'initialisation des submodules : ${
					        err.message}`);
				    return;
			    }
			    vscode.window.showInformationMessage(
			        'Tous les submodules ont été initialisés.');
			    submodulesProvider.refresh();
		    });
	    });

	const initSpecificSubmoduleCommand = vscode.commands.registerCommand(
	    'zegit-submodules-manager.initSpecificSubmodule', async function() {
		    getSubmodules(rootPath, async (err, submodules) => {
			    if (err) {
				    vscode.window.showErrorMessage(
				        `Erreur lors de la récupération des submodules : ${
					        err.message}`);
				    return;
			    }

			    if (submodules.length === 0) {
				    vscode.window.showWarningMessage('Aucun submodule trouvé.');
				    return;
			    }

			    const selectedSubmodule =
			        await vscode.window.showQuickPick(submodules, {
				        placeHolder: 'Sélectionnez le submodule à initialiser',
			        });

			    if (selectedSubmodule) {
				    const command =
				        `git submodule update --init ${selectedSubmodule}`;
				    executeGitCommand(command, {cwd: rootPath}, (err) => {
					    if (err) {
						    vscode.window.showErrorMessage(
						        `Erreur lors de l'initialisation du submodule ${
							        selectedSubmodule} : ${err.message}`);
						    return;
					    }
					    vscode.window.showInformationMessage(`Le submodule ${
						    selectedSubmodule} a été initialisé.`);
					    submodulesProvider.refresh();
				    });
			    }
		    });
	    });

	const deinitAllSubmodulesCommand = vscode.commands.registerCommand(
	    'zegit-submodules-manager.deinitAllSubmodules', function() {
		    const command = 'git submodule deinit --all';
		    executeGitCommand(command, {cwd: rootPath}, (err) => {
			    if (err) {
				    vscode.window.showErrorMessage(
				        `Erreur lors de la désinitialisation des submodules : ${
					        err.message}`);
				    return;
			    }
			    vscode.window.showInformationMessage(
			        'Tous les submodules ont été désinitialisés.');
			    submodulesProvider.refresh();
		    });
	    });

	const deinitSpecificSubmoduleCommand = vscode.commands.registerCommand(
	    'zegit-submodules-manager.deinitSpecificSubmodule', async function() {
		    getSubmodules(rootPath, async (err, submodules) => {
			    if (err) {
				    vscode.window.showErrorMessage(
				        `Erreur lors de la récupération des submodules : ${
					        err.message}`);
				    return;
			    }

			    if (submodules.length === 0) {
				    vscode.window.showWarningMessage('Aucun submodule trouvé.');
				    return;
			    }

			    const selectedSubmodule =
			        await vscode.window.showQuickPick(submodules, {
				        placeHolder:
				            'Sélectionnez le submodule à désinitialiser',
			        });

			    if (selectedSubmodule) {
				    const command = `git submodule deinit ${selectedSubmodule}`;
				    executeGitCommand(command, {cwd: rootPath}, (err) => {
					    if (err) {
						    vscode.window.showErrorMessage(
						        `Erreur lors de la désinitialisation du submodule ${
							        selectedSubmodule} : ${err.message}`);
						    return;
					    }
					    vscode.window.showInformationMessage(`Le submodule ${
						    selectedSubmodule} a été désinitialisé.`);
					    submodulesProvider.refresh();
				    });
			    }
		    });
	    });

	context.subscriptions.push(initAllSubmodulesCommand);
	context.subscriptions.push(initSpecificSubmoduleCommand);
	context.subscriptions.push(deinitAllSubmodulesCommand);
	context.subscriptions.push(deinitSpecificSubmoduleCommand);
	context.subscriptions.push(refreshSubmodulesCommand);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate,
};
