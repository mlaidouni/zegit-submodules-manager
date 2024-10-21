const vscode = require("vscode");
const { exec } = require("child_process");
const { SubmodulesProvider } = require("./submodulesTreeView");

// This method is called when your extension is activated
function activate(context) {
  console.log(
    'Congratulations, your extension "zegit-submodules-manager" is now active!'
  );

  // TreeView Provider for Submodules
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("Aucun projet ouvert.");
    return;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const submodulesProvider = new SubmodulesProvider(rootPath);

  // Register the TreeView
  vscode.window.registerTreeDataProvider("submodulesView", submodulesProvider);

  // Command: Refresh the TreeView
  const refreshSubmodulesCommand = vscode.commands.registerCommand(
    "zegit-submodules-manager.refreshSubmodules",
    () => submodulesProvider.refresh()
  );

  // Command: Initialize all submodules
  const initAllSubmodulesCommand = vscode.commands.registerCommand(
    "zegit-submodules-manager.initAllSubmodules",
    function () {
      exec(
        "git submodule update --init --recursive",
        { cwd: rootPath },
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage(
              `Erreur lors de l'initialisation des submodules : ${stderr}`
            );
            return;
          }
          vscode.window.showInformationMessage(
            "Tous les submodules ont été initialisés."
          );
          submodulesProvider.refresh(); // Refresh the TreeView after updating
        }
      );
    }
  );

  // Command: Initialize specific submodule
  const initSpecificSubmoduleCommand = vscode.commands.registerCommand(
    "zegit-submodules-manager.initSpecificSubmodule",
    async function () {
      exec(
        "git config --file .gitmodules --name-only --get-regexp path",
        { cwd: rootPath },
        async (err, stdout, stderr) => {
          if (err || stderr) {
            vscode.window.showErrorMessage(
              `Erreur lors de la récupération des submodules : ${stderr}`
            );
            return;
          }

          const submodules = stdout
            .trim()
            .split("\n")
            .map((line) => line.replace("submodule.", "").replace(".path", ""));

          if (submodules.length === 0) {
            vscode.window.showWarningMessage("Aucun submodule trouvé.");
            return;
          }

          const selectedSubmodule = await vscode.window.showQuickPick(
            submodules,
            {
              placeHolder: "Sélectionnez le submodule à initialiser",
            }
          );

          if (selectedSubmodule) {
            exec(
              `git submodule update --init ${selectedSubmodule}`,
              { cwd: rootPath },
              (err, stdout, stderr) => {
                if (err) {
                  vscode.window.showErrorMessage(
                    `Erreur lors de l'initialisation du submodule ${selectedSubmodule} : ${stderr}`
                  );
                  return;
                }
                vscode.window.showInformationMessage(
                  `Le submodule ${selectedSubmodule} a été initialisé.`
                );
                submodulesProvider.refresh(); // Refresh the TreeView after updating
              }
            );
          }
        }
      );
    }
  );

  // Command: Deinitialize all submodules
  const deinitAllSubmodulesCommand = vscode.commands.registerCommand(
    "zegit-submodules-manager.deinitAllSubmodules",
    function () {
      exec(
        "git submodule deinit --all",
        { cwd: rootPath },
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage(
              `Erreur lors de la désinitialisation des submodules : ${stderr}`
            );
            return;
          }
          vscode.window.showInformationMessage(
            "Tous les submodules ont été désinitialisés."
          );
          submodulesProvider.refresh(); // Refresh the TreeView after updating
        }
      );
    }
  );

  // Command: Deinitialize specific submodule
  const deinitSpecificSubmoduleCommand = vscode.commands.registerCommand(
    "zegit-submodules-manager.deinitSpecificSubmodule",
    async function () {
      exec(
        "git config --file .gitmodules --name-only --get-regexp path",
        { cwd: rootPath },
        async (err, stdout, stderr) => {
          if (err || stderr) {
            vscode.window.showErrorMessage(
              `Erreur lors de la récupération des submodules : ${stderr}`
            );
            return;
          }

          const submodules = stdout
            .trim()
            .split("\n")
            .map((line) => line.replace("submodule.", "").replace(".path", ""));

          if (submodules.length === 0) {
            vscode.window.showWarningMessage("Aucun submodule trouvé.");
            return;
          }

          const selectedSubmodule = await vscode.window.showQuickPick(
            submodules,
            {
              placeHolder: "Sélectionnez le submodule à désinitialiser",
            }
          );

          if (selectedSubmodule) {
            exec(
              `git submodule deinit ${selectedSubmodule}`,
              { cwd: rootPath },
              (err, stdout, stderr) => {
                if (err) {
                  vscode.window.showErrorMessage(
                    `Erreur lors de la désinitialisation du submodule ${selectedSubmodule} : ${stderr}`
                  );
                  return;
                }
                vscode.window.showInformationMessage(
                  `Le submodule ${selectedSubmodule} a été désinitialisé.`
                );
                submodulesProvider.refresh(); // Refresh the TreeView after updating
              }
            );
          }
        }
      );
    }
  );

  // Register all commands
  context.subscriptions.push(initAllSubmodulesCommand);
  context.subscriptions.push(initSpecificSubmoduleCommand);
  context.subscriptions.push(deinitAllSubmodulesCommand);
  context.subscriptions.push(deinitSpecificSubmoduleCommand);
  context.subscriptions.push(refreshSubmodulesCommand);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
