const vscode = require("vscode");
const { exec } = require("child_process");

class SubmoduleItem extends vscode.TreeItem {
  constructor(label, collapsibleState, command, icon, description) {
    super(label, collapsibleState);
    this.command = command;
    this.iconPath = icon;
    this.description = description; // Ajout de la description à droite
  }
}

class SubmodulesProvider {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No project found");
      return Promise.resolve([]);
    }

    return this.getSubmodules();
  }

  getSubmodules() {
    return new Promise((resolve, reject) => {
      exec(
        "git submodule status",
        { cwd: this.workspaceRoot },
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage("Failed to retrieve submodules.");
            return resolve([]);
          }

          if (!stdout) {
            vscode.window.showInformationMessage("No submodules found.");
            return resolve([]);
          }

          const submodules = stdout
            .trim()
            .split("\n")
            .map((line) => {
              const parts = line.trim().split(/\s+/);
              const commitHash = parts[0].replace(/^-|\+/g, ""); // Retirer les symboles '-' ou '+'
              const submodulePath = parts[1];

              // Obtenir le hash court (7 premiers caractères) ou "Not Initialized"
              const commitShort = commitHash.substring(0, 7);
              let description = "・";

              // Si le submodule n'est pas initialisé (le status commence par "-")
              if (parts[0].startsWith("-")) description += "Not Initialized";
              else description = description + commitShort;

              // Déterminer l'icône
              let icon = new vscode.ThemeIcon("check"); // Icône par défaut "ok"
              if (parts[0].startsWith("-")) {
                icon = new vscode.ThemeIcon("circle-slash"); // Non initialisé
              } else if (parts[0].startsWith("+")) {
                icon = new vscode.ThemeIcon("arrow-up"); // Ahead
              } else if (parts[2] && parts[2].includes("behind")) {
                icon = new vscode.ThemeIcon("arrow-down"); // Behind
              }

              return new SubmoduleItem(
                submodulePath, // Le nom du submodule est le label principal
                vscode.TreeItemCollapsibleState.None,
                {
                  command: "zegit-submodules-manager.openSubmodule",
                  title: "",
                  arguments: [submodulePath],
                },
                icon,
                description // Le commit hash ou "Not Initialized" comme description
              );
            });

          resolve(submodules);
        }
      );
    });
  }
}

module.exports = { SubmodulesProvider };
