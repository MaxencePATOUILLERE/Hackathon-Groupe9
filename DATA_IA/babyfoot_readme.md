# 🏓 Babyfoot du Futur – Base de Données

## 🎯 Objectif

Cette base de données centralise et organise toutes les informations relatives aux matchs de **babyfoot connectés d'Ynov Toulouse**, dans le cadre du projet **Babyfoot du Futur (Hackathon 2025)**.  
Elle permet de suivre les **joueurs**, les **matchs**, leurs **performances**, ainsi que l'état des **babyfoots physiques** présents sur le campus.


# Normalisation Dataset Babyfoot

## 1. Contexte & Objectif
 
L’objectif du nettoyage et de la normalisation du dataset est de garantir :

- ✅ **La cohérence des formats de données** (ex. temps, scores, âges, valeurs numériques)
- ✅ **La suppression d’ambiguïtés liées aux variations d’écriture**
- ✅ **La préparation du dataset pour des analyses statistiques**

---

## 2. Méthodologie de Nettoyage

### 2.1 Normalisation des données numériques

| Variable | Action effectuée | Justification |
|----------|------------------|---------------|
| `final_score_red` / `final_score_blue` | Transformation via `normalize_scores_row_final_v2` | Uniformiser le format des scores (détection automatique des valeurs inversées ou mal saisies) |
| `rating_raw` | Conversion textuelle → numérique (`conversion_map`) | Rendre les évaluations exploitables dans des calculs/analyse de performance |
| `player_age` | Nettoyage des formats textuels (`"twenty"` → `20`) | Assurer une homogénéité pour tests statistiques |
| `player_assists`, `player_goals` | Suppression de caractères parasites (`"0�"` → `0`) | Éviter les erreurs de parsing |

---

### 2.2 Normalisation des données temporelles

| Variable | Action effectuée | Justification |
|----------|------------------|---------------|
| `game_duration` | `convert_to_seconds()` → conversion en secondes | Faciliter les comparaisons entre matchs |
| `possession_time` | Uniformisation via `convertir_en_secondes_cellule()` | Permettre des calculs de ratio et de performance |

---

### 2.3 Normalisation des données textuelles

| Variable | Action effectuée | Justification |
|----------|------------------|---------------|
| `location` | Harmonisation des libellés (`"Ynov Tls"` → `"Ynov Toulouse"`) | Éviter les doublons dans les regroupements |
| `table_condition` | Suppression des caractères spéciaux (`"good�"` → `"good"`) | Lisibilité + compatibilité |

---

### 2.4 Harmonisation des labels & catégories

| Variable | Action effectuée | Justification |
|----------|------------------|---------------|
| `player_role` | Regroupement des variantes (`"defence"`, `"Defense"` → `"def"`) | Réduction de la cardinalité des labels |
| `team_color` | Regroupement des écritures différentes | Faciliter les agrégations |
| `season` | Uniformisation (`"Season 24-25"` → `"2024/2025"`) | Standardiser les périodes pour les comparaisons |

---

## 3. Tableau récapitulatif global

| Catégorie | Variables concernées | Technique utilisée |
|-----------|----------------------|--------------------|
| Numérique | Scores, âge, stats | Mapping + parsing |
| Temporel | Durée de jeu, possession | Conversion en secondes |
| Textuel | Lieux, états de table | Nettoyage + remplacement |
| Catégoriel | Rôle, couleur équipe, saison | Regroupement + reformattage |

---

## 4. Schéma Global

La base repose sur une architecture **relationnelle** composée de **4 tables principales** :

| Table | Description |
|--------|-------------|
| `players` | Informations sur les joueurs inscrits |
| `games` | Détails des matchs joués |
| `performances` | Statistiques individuelles des joueurs par match |
| `babyfoots` | État et disponibilité des tables physiques |

---

## 5. Relations entre les Tables

| Source | Relation | Cible | Cardinalité | Description |
|---------|-----------|--------|---------------|--------------|
| `babyfoots` | → | `games` | 1–N | Un babyfoot héberge plusieurs matchs |
| `games` | → | `performances` | 1–N | Un match regroupe plusieurs performances |
| `players` | → | `performances` | 1–N | Un joueur réalise plusieurs performances |

**Règle d'intégrité :**
- Les suppressions sur une table parent provoquent la suppression en cascade (`ON DELETE CASCADE`) des lignes dépendantes.
- Les clés étrangères assurent la cohérence entre `game_id`, `player_id` et `table_id`.

---

## 6. Détail des Tables

### 🧑 `players`
Contient les informations sur les utilisateurs de la plateforme (joueurs et administrateurs).

| Champ | Type | Description |
|--------|------|-------------|
| `player_id` | VARCHAR(10) | Identifiant unique du joueur |
| `player_name` | VARCHAR(100) | Nom complet du joueur |
| `age` | INT | Âge du joueur |
| `email` | VARCHAR(255) | Adresse e-mail du joueur |
| `mot_de_passe` | VARCHAR(255) | Mot de passe chiffré |
| `role` | ENUM('Admin', 'User') | Rôle dans le système |
| `date_inscription` | DATE | Date d'inscription |

**Contraintes :**
- `player_id` = **clé primaire**
- `email` = **unique** (un joueur par adresse mail)

---

### 🎮 `games`
Contient les informations de chaque match enregistré.

| Champ | Type | Description |
|--------|------|-------------|
| `game_id` | VARCHAR(10) | Identifiant unique du match |
| `table_id` | VARCHAR(10) | FK vers `babyfoots` |
| `game_date` | DATETIME | Date et heure du match |
| `duration` | INT | Durée du match (en secondes) |
| `score_red` | INT | Score de l'équipe rouge |
| `score_blue` | INT | Score de l'équipe bleue |
| `winner_team` | VARCHAR(100) | Équipe gagnante (`Red` ou `Blue`) |
| `location` | VARCHAR(100) | Lieu où le match a eu lieu |
| `season` | VARCHAR(20) | Saison (ex : `2024/2025`) |
| `ball_type` | VARCHAR(20) | Type de balle utilisée |
| `music` | VARCHAR(50) | Musique jouée pendant la partie |
| `referent` | VARCHAR(50) | Nom du référent ou arbitre |
| `attendance` | INT | Nombre de spectateurs |
| `recoded_by` | VARCHAR(50) | Personne ou système ayant enregistré le match |
| `rating` | INT | Évaluation globale du match (1 à 5) |

**Contraintes :**
- `game_id` = **clé primaire**
- `table_id` = **clé étrangère vers `babyfoots`**
- `score_red`, `score_blue`, `winner_team` sont **non nuls**

---

### 📊 `performances`
Table pivot entre `players` et `games`, contenant les statistiques détaillées de chaque joueur.

| Champ | Type | Description |
|--------|------|-------------|
| `game_id` | VARCHAR(10) | FK vers `games` |
| `player_id` | VARCHAR(10) | FK vers `players` |
| `team_color` | ENUM('Red','Blue') | Couleur de l'équipe du joueur |
| `role` | ENUM('attack','defense') | Poste du joueur |
| `substitute` | ENUM('yes','no','maybe') | Statut de remplaçant |
| `goals` | INT | Nombre de buts marqués |
| `assists` | INT | Nombre de passes décisives |
| `save` | INT | Nombre d'arrêts réalisés |
| `own_goals` | INT | Buts contre son camp |
| `possession_time` | TIME | Temps de possession du ballon |
| `created_at` | DATETIME | Date d'enregistrement |

**Contraintes :**
- Clé primaire composée (`game_id`, `player_id`)
- Les deux champs sont des **clés étrangères**
- `team_color`, `role`, `goals`, `save` sont **non nuls**

---

### ⚙️ `babyfoots`
Décrit l'état, la disponibilité et la maintenance des tables physiques.

| Champ | Type | Description |
|--------|------|-------------|
| `table_id` | VARCHAR(10) | Identifiant unique |
| `status` | ENUM('available','in_use','maintenance') | État du babyfoot |
| `condition` | VARCHAR(50) | État du matériel (ex: "good", "worn") |

**Contraintes :**
- `table_id` = **clé primaire**
- `status` par défaut = `'available'`

---

## 🔒 Clés et Contraintes

- Chaque table possède une **clé primaire (`PRIMARY KEY`)**
- Les relations sont définies par des **clés étrangères (`FOREIGN KEY`)**
- Les valeurs critiques (scores, équipes, etc.) sont **non nulles**
- **Suppression en cascade** sur les dépendances (`ON DELETE CASCADE`)
- `email` est unique dans `players`

---

## 7. Instructions d'Import SQL

Cette section décrit comment créer la base de données PostgreSQL, définir le schéma, puis importer les fichiers CSV contenant les données du projet **Babyfoot du Futur**.

---

### 🧩 Étape 1 – Créer la base de données

```sql
CREATE DATABASE babyfoot_db;
\c babyfoot_db;
```

### 🧩 Étape 2 – Création des types ENUM

```sql
CREATE TYPE team_color_enum AS ENUM ('red', 'blue');
CREATE TYPE attack_defense_enum AS ENUM ('def', 'atk');
CREATE TYPE availability_status_enum AS ENUM ('available', 'unavailable', 'maintenance');
```

### 🧩 Étape 3 – Création des tables

```sql
-- Table des babyfoots
CREATE TABLE babyfoots (
    table_id VARCHAR(10) PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    availability availability_status_enum DEFAULT 'available',
    table_condition VARCHAR(50)
);

-- Table des joueurs
CREATE TABLE players (
    player_id VARCHAR(20) PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    age INT,
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(200),
    role VARCHAR(20) DEFAULT 'User',
    date_inscription DATE DEFAULT CURRENT_DATE
);

-- Table des matchs
CREATE TABLE games (
    game_id VARCHAR(10) PRIMARY KEY,
    table_id VARCHAR(10) REFERENCES babyfoots(table_id) ON DELETE CASCADE,
    game_date TIMESTAMP,
    duration_seconds INT,
    score_red INT NOT NULL,
    score_blue INT NOT NULL,
    winner_team VARCHAR(10),
    location VARCHAR(100),
    season VARCHAR(20),
    ball_type VARCHAR(20),
    music VARCHAR(50),
    referent VARCHAR(50),
    attendance INT,
    recorded_by VARCHAR(50),
    rating INT
);

-- Table des performances des joueurs
CREATE TABLE performances (
    game_id VARCHAR(10) REFERENCES games(game_id) ON DELETE CASCADE,
    player_id VARCHAR(10) REFERENCES players(player_id) ON DELETE CASCADE,
    team_color team_color_enum NOT NULL,
    role attack_defense_enum,
    is_substitute BOOLEAN DEFAULT FALSE,
    goals INT DEFAULT 0,
    own_goals INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assist INT DEFAULT 0,
    save INT DEFAULT 0,
    possession_time INT DEFAULT 0,
    PRIMARY KEY (game_id, player_id)
);
```

### 🧩 Étape 4 – Import des données depuis CSV

```sql
-- Import des babyfoots
\COPY babyfoots(table_id, nom, table_condition)
FROM '/chemin/vers/data/babyfoots.csv'
DELIMITER ',' CSV HEADER;

-- Import des joueurs
\COPY players(player_id, player_name, age, email, mot_de_passe, role, date_inscription)
FROM '/chemin/vers/data/players.csv'
DELIMITER ',' CSV HEADER;

-- Import des matchs
\COPY games(game_id, table_id, game_date, duration_seconds, score_red, score_blue, winner_team, location, season)
FROM '/chemin/vers/data/games.csv'
DELIMITER ',' CSV HEADER;

-- Import des performances
\COPY performances(game_id, player_id, team_color, role, is_substitute, goals, own_goals, created_at, assist, save, possession_time)
FROM '/chemin/vers/data/performances.csv'
DELIMITER ',' CSV HEADER;
```

---

## 8. Statistiques du Projet

### 🏆 TOP 10 Joueurs (par score total)

| Classement | ID | Joueur | Score Total |
|------------|---------|----------------|-------------|
| 1 | P0514 | Leo Philippe | 446 |
| 2 | P0416 | Paul Philippe | 425 |
| 3 | P0234 | Hugo Garcia | 421 |
| 4 | P0217 | Emma Durand | 413 |
| 5 | P0237 | Julie Andre | 411 |
| 6 | P0191 | Lena Andre | 408 |
| 7 | P0245 | Julie Schmidt | 407 |
| 8 | P0405 | Mateo Martin | 407 |
| 9 | P0177 | Casey Nakamura | 407 |
| 10 | P0354 | Alex Kovacs | 405 |

### 🛡️ TOP 5 Gardiens (par nombre de saves)

| Classement | ID | Joueur | Saves |
|------------|---------|----------------|-------|
| 1 | P0405 | Mateo Martin | 846 |
| 2 | P0416 | Paul Philippe | 834 |
| 3 | P0241 | Lucas Nakamura | 817 |
| 4 | P0719 | Antoine Bernard | 817 |
| 5 | P0740 | Youssef Andre | 808 |

### ⚖️ Distribution des Victoires par Équipe

| Équipe | Victoires | Pourcentage |
|--------|-----------|-------------|
| **Red** | 11 466 | 45.86% |
| **Blue** | 11 286 | 45.14% |
| **Equal** | 2 248 | 8.99% |

**Total de matchs enregistrés :** 25 000

---


## 👥 Équipe du Projet

**🧠 Data/IA :** Ibrahim BADR - Giovanni GOZZO - Julien FROMONT 

---

## 📝 Notes

- Les statistiques présentées sont basées sur l'analyse des 25 000 matchs enregistrés dans la base de données.
- La compétition est très équilibrée entre les équipes rouge et bleue avec seulement 0.72% de différence.
- Le taux de matchs nuls (8.99%) indique un niveau de compétition élevé et équilibré.

---

*Document généré dans le cadre du **Hackathon 2025 - Babyfoot du Futur***