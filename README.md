# zegit-submodules-manager README <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->

1. [Description](#description)
2. [Fonctionnalités](#fonctionnalités)
3. [Installation](#installation)
4. [Utilisation](#utilisation)
5. [Commandes](#commandes)
6. [Développement](#développement)
	1. [Structure du projet](#structure-du-projet)
	2. [Lancer l'extension en mode développement](#lancer-lextension-en-mode-développement)
7. [Contribution](#contribution)

## Description

"zegit-submodules-manager" est une extension Visual Studio Code qui facilite la gestion des sous-modules Git dans vos projets. Cette extension vous permet de visualiser, initialiser, mettre à jour et gérer les sous-modules directement depuis l'interface de VS Code.

## Fonctionnalités

- **Visualisation des sous-modules** : Affichez la liste des sous-modules de votre projet avec leur état actuel.
- **Initialisation des sous-modules** : Initialisez les sous-modules non initialisés.
- **Mise à jour des sous-modules** : Mettez à jour les sous-modules pour qu'ils pointent vers les derniers commits.
- **Icônes d'état** : Visualisez l'état des sous-modules avec des icônes (initialisé, non initialisé, en avance, en retard).

## Installation

1. Ouvrez Visual Studio Code.
2. Allez dans l'onglet des extensions (`Ctrl+Shift+X` ou `Cmd+Shift+X` sur Mac).
3. Recherchez "zegit-submodules-manager".
4. Cliquez sur "Installer".

## Utilisation

1. Ouvrez un projet contenant des sous-modules Git.
2. Ouvrez la vue des sous-modules en utilisant la commande `Ctrl+Shift+P` (ou `Cmd+Shift+P` sur Mac) et en tapant `ZeGit Submodules: Refresh View`.
3. La liste des sous-modules s'affichera dans la barre latérale.

## Commandes

- `zegit-submodules-manager.openSubmodule` : Ouvre le sous-module sélectionné dans l'explorateur de fichiers.

## Développement

### Structure du projet

- `src/extension.js` : Fichier principal où l'extension est activée.
- `src/submodulesTreeView.js` : Implémentation de la vue des sous-modules.
- `test/extension.test.js` : Tests unitaires pour l'extension.

### Lancer l'extension en mode développement

1. Clonez le dépôt de l'extension.
2. Ouvrez le dossier du projet dans VS Code.
3. Appuyez sur `F5` pour lancer une nouvelle fenêtre VS Code avec l'extension chargée.
4. Utilisez la palette de commandes (`Ctrl+Shift+P` ou `Cmd+Shift+P` sur Mac) pour exécuter les commandes de l'extension.

## Contribution

Les contributions sont les bienvenues ! Veuillez soumettre des pull requests ou ouvrir des issues pour signaler des bugs ou proposer des améliorations.
