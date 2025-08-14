# Prototype FPS Three.js + Rapier

Ce dépôt contient un petit prototype de jeu 3D utilisant [Three.js](https://threejs.org/) pour le rendu et [Rapier](https://rapier.rs/) pour la physique, construit avec [Vite](https://vitejs.dev/).

## Installation et lancement
```bash
npm install
npm run dev
```
Puis ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

## Contrôles
- **Z Q S D** (ou **W A S D**) : déplacement
- **Souris** : orientation de la caméra (Pointer Lock)
- **Espace** : saut

Rapier télécharge automatiquement son binaire WASM au premier lancement; Vite le sert sans configuration supplémentaire.
