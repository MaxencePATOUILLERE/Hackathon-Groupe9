# 🧩 Projet Hackathon – Documentation Infrastructure & Déploiement

## 📁 Structure du projet

.
├── ansible/
│   ├── inventories/
│   │   └── host.ini                 # Inventaire Ansible : liste des serveurs
│   ├── playbooks/
│   │   ├── install-docker.yml       # Installe Docker sur les nœuds
│   │   ├── init-swarm.yml           # Initialise le cluster Docker Swarm
│   │   └── pg_deploy.yml            # Déploie PostgreSQL (build + run)
│   └── deployment_process.md        # Documentation technique
│
├── hackathon/
│   ├── dockerfile/
│   │   └── dockerfile_pg            # Dockerfile pour l’image PostgreSQL
│   ├── init.sql                     # Script SQL : création des tables + import CSV
│   └── db/
│       ├── babyfoots.csv
│       ├── games.csv
│       ├── performances.csv
│       └── players.csv              # Données importées dans la base
│
└── README.md                        # Ce document

---

## 🏗️ Architecture de l’infrastructure

| Composant | Rôle | Localisation | Description |
|------------|------|---------------|--------------|
| **Ansible Controller** | Gestion du déploiement | Ton Mac (machine de dev) | C’est depuis ici que tu exécutes les playbooks Ansible. |
| **Serveur Docker / Node Swarm** | Exécution des conteneurs | Serveur distant (`manager` ou `worker`) | Contient Docker et héberge le conteneur PostgreSQL. |
| **Dossier `/home/hack-usr/hackathon/`** | Source du projet sur le serveur | Serveur distant | Contient le Dockerfile, le SQL et les CSV utilisés pour le déploiement. |
| **Docker Swarm (optionnel)** | Orchestrateur de conteneurs | Réseau de nœuds | Permet de gérer plusieurs serveurs (scalabilité, redondance). |

---

## ⚙️ Principe du déploiement

1. **Installation Docker**
    - `install-docker.yml` installe Docker et le SDK Python nécessaire à Ansible (`python3-docker`).

2. **Initialisation du Swarm**
    - `init-swarm.yml` configure un cluster Docker Swarm (1 manager + plusieurs workers si besoin).

3. **Déploiement PostgreSQL**
    - `pg_deploy.yml` est le playbook principal :
        1. **Build** de l’image Docker à partir du Dockerfile :
           ```
           /hackathon/dockerfile/dockerfile_pg
           ```
        2. **Création d’un volume persistant** :
           ```
           /srv/postgres/hackathon/data
           ```
        3. **Lancement du conteneur PostgreSQL** :
            - Image : `hackathon-postgres:latest`
            - Nom : `hackaton_db`
            - Port exposé : `5432`
        4. **Montage des répertoires** :
           | Hôte (serveur) | Conteneur | Rôle |
           |----------------|------------|------|
           | `/home/hack-usr/hackathon/init.sql` | `/docker-entrypoint-initdb.d/init.sql` | Script d’initialisation exécuté au premier démarrage |
           | `/home/hack-usr/hackathon/db/` | `/import/` | Données CSV importées par le script SQL |
           | `/srv/postgres/hackathon/data` | `/var/lib/postgresql/data/` | Volume persistant pour la base |

        5. **Exécution automatique du SQL**
            - Au premier lancement (volume vide), Postgres exécute `init.sql` :
                - Création des tables,
                - Définition des ENUMs,
                - Importation des CSV depuis `/import`.

4. **Vérification automatique**
    - Le playbook attend que Postgres soit prêt (`pg_isready`)
    - Puis exécute :
      ```bash
      docker exec hackaton_db psql -U admin -d hackaton_db -c "\dt"
      ```
      pour vérifier que les tables existent.

---

## 🧰 Fichiers clés

### 🐳 Dockerfile
`/hackathon/dockerfile/dockerfile_pg`
```Dockerfile
FROM postgres:16-alpine

ENV POSTGRES_DB=hackaton_db \
    POSTGRES_USER=admin \
    POSTGRES_PASSWORD=admin \
    PGDATA=/var/lib/postgresql/data/pgdata

🗃️ Script SQL

/home/hack-usr/hackathon/init.sql
	•	Crée les tables et importe les CSV.
	•	Exécuté automatiquement par le conteneur Postgres au premier démarrage.

📦 CSV

/home/hack-usr/hackathon/db/*.csv
	•	Importés automatiquement via les commandes COPY du script SQL :

COPY players(...) FROM '/import/players.csv' CSV HEADER;


⸻

🚀 Commandes de déploiement

1️⃣ Installer Docker

ansible-playbook -i ansible/inventories/host.ini ansible/playbooks/install-docker.yml

2️⃣ Initialiser le cluster Swarm (optionnel)

ansible-playbook -i ansible/inventories/host.ini ansible/playbooks/init-swarm.yml

3️⃣ Déployer PostgreSQL

ansible-playbook -i ansible/inventories/host.ini ansible/playbooks/pg_deploy.yml


⸻

🔍 Vérifications

Conteneur en cours :

docker ps

Tables créées :

docker exec hackaton_db psql -U admin -d hackaton_db -c "\dt"

Tester la connexion :

psql -h 127.0.0.1 -p 5432 -U admin -d hackaton_db


⸻

🔁 Réinitialiser la base

Pour réimporter les CSV depuis zéro :

docker rm -f hackaton_db
sudo rm -rf /srv/postgres/hackathon/data
ansible-playbook -i ansible/inventories/host.ini ansible/playbooks/pg_deploy.yml


⸻

🧱 Points forts de cette infrastructure

✅ Idempotente : relancer le playbook ne casse rien.
✅ Reproductible : tout est défini par code (Ansible + Dockerfile + SQL).
✅ Simple à maintenir : une commande pour tout déployer.
✅ Évolutive : extensible à Docker Swarm ou à un futur service web connecté à la DB.

⸻

📊 Diagramme simplifié

        ┌────────────────────┐
        │  Poste Dev (Mac)   │
        │  ────────────────  │
        │  Ansible Controller│
        │  Repo Git local    │
        └─────────┬──────────┘
                  │ SSH + Ansible
                  ▼
        ┌──────────────────────────┐
        │ Serveur Docker / Manager │
        │  ─────────────────────── │
        │  /home/hack-usr/hackathon│
        │   ├── Dockerfile         │
        │   ├── init.sql           │
        │   └── db/*.csv           │
        │                          │
        │  → Build image Docker    │
        │  → Run container         │
        │  → Mount data & import   │
        └──────────────────────────┘

---
