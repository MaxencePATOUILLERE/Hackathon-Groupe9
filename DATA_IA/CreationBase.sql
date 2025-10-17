DROP TABLE IF EXISTS performances;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS babyfoots;

DROP TYPE IF EXISTS team_color_enum;
DROP TYPE IF EXISTS attack_defense_enum;
DROP TYPE IF EXISTS aivailableor;
DROP TYPE IF EXISTS substitute_enum;

SET datestyle = 'DMY';

CREATE TYPE team_color_enum AS ENUM ('red', 'blue');
CREATE TYPE attack_defense_enum AS ENUM ('def', 'atk');
CREATE TYPE aivailableor as ENUM('available','unavailable','maintenance')
CREATE TYPE substitute_enum AS ENUM ('yes', 'no','maybe');


CREATE TABLE babyfoots (
                           table_id VARCHAR(3) PRIMARY KEY,
                           nom VARCHAR(200),
                           status aivailableor,
                           table_condition VARCHAR(50)
);

CREATE TABLE players (
                         player_id VARCHAR(20) PRIMARY KEY,
                         player_name VARCHAR(200) NOT NULL,
                         age INT,
                         email VARCHAR(200),
                         mot_de_passe VARCHAR(200),
                        role VARCHAR(20),
                         date_inscription DATE
);

CREATE TABLE games (
                       game_id VARCHAR(10) PRIMARY KEY,
                       table_id VARCHAR(10) REFERENCES babyfoots(table_id),
                       game_date TEXT,
                       duration_seconds INT,
                       score_red INT,
                       score_blue INT,
                       winner_team VARCHAR(50),
                       location VARCHAR(100),
                       season VARCHAR(20),
                       ball_type VARCHAR(200),
                       music VARCHAR(200),
                       referent VARCHAR(200),
                       attendance DOUBLE PRECISION,
                       recorded_by VARCHAR(200),
                       rating INT
);

CREATE TABLE performances (
                              game_id VARCHAR(10) REFERENCES games(game_id),
                              player_id VARCHAR(10) REFERENCES players(player_id),
                              team_color team_color_enum,
                              role attack_defense_enum,
                              substitute substitute_enum,
                              goals INT,
                              own_goals INT,
                              created_at TEXT,
                              assist INT,
                              save INT,
                              possession_time DOUBLE PRECISION,
                              PRIMARY KEY (game_id, player_id)
);


COPY babyfoots(table_id,table_condition, nom, status)
    FROM '/data/babyfoots.csv'
    DELIMITER ',' CSV HEADER;


COPY players(player_id,age, player_name, email,role, date_inscription,mot_de_passe)
    FROM '/data/players.csv'
    DELIMITER ',' CSV HEADER;

COPY games(game_id,table_id,game_date,duration_seconds,score_red,score_blue,winner_team,location,season,ball_type,music,attendance,recorded_by,rating,referent)
    FROM '/data/games.csv'
    DELIMITER ',' CSV HEADER;


COPY performances(game_id,player_id,team_color,role,substitute,goals,own_goals,assist,save,possession_time,created_at)
    FROM '/data/performances.csv'
    DELIMITER ',' CSV HEADER;
