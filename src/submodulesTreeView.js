const vscode = require('vscode');
const {exec} = require('child_process');
// const path = require("path");

class SubmoduleItem extends vscode.TreeItem {
	/**
	 * Crée une nouvelle instance de SubmoduleItem. Cet objet est utilisé pour
	 * représenter un submodule dans la vue des submodules.
	 *
	 * @param {string} label Le nom du submodule
	 * @param {vscode.TreeItemCollapsibleState} collapsibleState L'état du
	 *    submodule (collapsed ou expanded)
	 * @param {vscode.ThemeIcon} icon L'icône à afficher pour le submodule en
	 *   fonction de son status
	 * @param {string} description La description à afficher à droite du label
	 */
	constructor(label, collapsibleState, icon, description) {
		super(label, collapsibleState);
		this.iconPath = icon;
		this.description = description;  // Ajout de la description à droite
	}
}

class SubmodulesProvider {
	/**
	 * Crée une nouvelle instance de SubmodulesProvider. Cet objet est utilisé
	 * pour fournir les données des submodules à la vue des submodules.
	 *
	 * @param {string} workspaceRoot Le chemin du dépôt
	 */
	constructor(workspaceRoot) {
		// On stocke le chemin du dépôt
		this.workspaceRoot = workspaceRoot;
		// Événement qui se déclenche lorsque les données de l'arbre changent.
		this._onDidChangeTreeData = new vscode.EventEmitter();
		// On expose l'événement aux autres classes
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;
	}

	// Rafraîchit les données de l'arbre.
	refresh() {
		/**
		 * Pour rafraîchir les données de l'arbre, on déclenche l'événement qui
		 * indique que les données ont changé. Cela va appeler la méthode
		 * getChildren pour obtenir les nouvelles données.
		 */
		this._onDidChangeTreeData.fire();
	}

	/**
	 * Récupère l'élément de l'arbre à afficher.
	 *
	 * @param {SubmoduleItem} element L'élément de l'arbre à afficher
	 * @returns {SubmoduleItem} L'élément de l'arbre à afficher
	 */
	getTreeItem(element) {
		return element;
	}

	/**
	 * Récupère les enfants de l'élément donné.
	 *
	 * @param {SubmoduleItem} element L'élément dont on veut récupérer les
	 *     enfants (submodules).
	 * @returns {Promise<SubmoduleItem[]>} Les enfants de l'élément donné (les
	 *    submodules)
	 */
	getChildren(element) {
		// Si l'élément n'est pas défini, cela signifie que l'on veut afficher
		// les submodules à la racine de l'arbre.
		if (!element) {
			return this.getSubmodules();
		}

		// Sinon, cela signifie que l'on veut afficher les commits du submodule.
		// return this.getCommits(element.label);
	}

	getSubmodules() {
		return new Promise((resolve, reject) => {
			const command = 'git submodule status';
			exec(command, {cwd: this.workspaceRoot}, (err, stdout, stderr) => {
				if (err) {
					vscode.window.showErrorMessage(
					    'Échec de la récupération des submodules.');
					return resolve([]);
				}

				if (!stdout) {
					vscode.window.showInformationMessage(
					    'Aucun submodule trouvé.');
					return resolve([]);
				}

				const submodules = stdout.trim().split('\n').map((line) => {
					const parts = line.trim().split(/\s+/);
					const commitHash = parts[0].replace(
					    /^-|\+/g, '');  // Retirer les symboles '-' ou '+'
					const submodulePath = parts[1];

					// Obtenir le hash court (7 premiers caractères)
					const commitShort = commitHash.substring(0, 7);
					let description = '・';

					// Si le submodule n'est pas initialisé (le status
					// commence par "-")
					if (parts[0].startsWith('-'))
						description += 'Not Initialized';
					else
						description = description + commitShort;

					// Déterminer l'icône
					let icon =
					    new vscode.ThemeIcon('check');  // Icône par défaut "ok"
					if (parts[0].startsWith('-')) {
						icon = new vscode.ThemeIcon(
						    'circle-slash');  // Non initialisé
					} else if (parts[0].startsWith('+')) {
						icon = new vscode.ThemeIcon('arrow-up');  // Ahead
					} else if (parts[2] && parts[2].includes('behind')) {
						icon = new vscode.ThemeIcon('arrow-down');  // Behind
					}

					// Déterminer l'icône
					//   let iconPath = vscode.Uri.file(
					//     path.join(
					//       __dirname,
					//       "resources",
					//       "icons",
					//       "sbm.status",
					//       "ok.png"
					//     )
					//   ); // Icône par défaut "ok"
					//   if (parts[0].startsWith("-")) {
					//     iconPath = vscode.Uri.file(
					//       path.join(
					//         __dirname,
					//         "resources",
					//         "icons",
					//         "sbm.status",
					//         "x.png"
					//       )
					//     ); // Non initialisé
					//   } else if (parts[0].startsWith("+")) {
					//     iconPath = vscode.Uri.file(
					//       path.join(
					//         __dirname,
					//         "resources",
					//         "icons",
					//         "sbm.status",
					//         "x.png"
					//       )
					//     ); // Ahead
					//   } else if (parts[2] &&
					//   parts[2].includes("behind")) {
					//     iconPath = vscode.Uri.file(
					//       path.join(
					//         __dirname,
					//         "resources",
					//         "icons",
					//         "sbm.status",
					//         "x.png"
					//       )
					//     ); // Behind
					//   }

					// On récupère le nom du submodule et son chemin
					const submoduleName = submodulePath.split('/').pop();

					return new SubmoduleItem(
					    // Le nom du submodule est le label principal
					    submodulePath,
					    // L'état du submodule est toujours collapsed
					    vscode.TreeItemCollapsibleState.Collapsed,
					    // L'icône dépend du status du submodule
					    icon,
					    // Le commit hash ou "Not Initialized" comme description
					    description);
				});

				resolve(submodules);
			});
		});
	}
}

module.exports = {SubmodulesProvider};
