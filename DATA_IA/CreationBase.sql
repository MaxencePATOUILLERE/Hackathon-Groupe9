CREATE TYPE team_color_enum AS ENUM ('red', 'blue');
CREATE TYPE attack_defense_enum AS ENUM ('def', 'atk');
CREATE TYPE aivailableor as ENUM('available','unavailable','maintenance')

CREATE TABLE babyfoots (
                           table_id VARCHAR(3) PRIMARY KEY,
                           nom VARCHAR(20),
                           aivailableor ,
                           table_condition VARCHAR(50)
);

CREATE TABLE players (
                         player_id VARCHAR(20) PRIMARY KEY,
                         player_name VARCHAR(10) NOT NULL,
                         age INT,
                         email VARCHAR(20),
                         mot_de_passe VARCHAR(200)
                         role VARCHAR(20),
                         date_inscription DATE
);

CREATE TABLE games (
                       game_id VARCHAR(10) PRIMARY KEY,
                       table_id VARCHAR(10) REFERENCES babyfoots(table_id),
                       game_date TIMESTAMP,
                       duration_seconds INT,
                       score_red INT,
                       score_blue INT,
                       winner_team VARCHAR(10),
                       location VARCHAR(100),
                       season VARCHAR(20),
                       ball_type VARCHAR(20),
                       music VARCHAR(50),
                       referent VARCHAR(20),
                       attendance INT,
                       recorded_by VARCHAR(20),
                       rating INT
);

CREATE TABLE performances (
                              game_id VARCHAR(10) REFERENCES games(game_id),
                              player_id VARCHAR(10) REFERENCES players(player_id),
                              team_color team_color_enum,
                              role attack_defense_enum,
                              is_substitute BOOLEAN,
                              goals INT,
                              own_goals INT,
                              created_at TIMESTAMP,
                              assist INT,
                              save INT,
                              possession_time INT,
                              PRIMARY KEY (game_id, player_id)
);

COPY babyfoots(table_id, nom, table_condition)
FROM '/Users/gmailgozzo/llamaproject/Hackathon-Groupe9/data/babyfoots.csv'
DELIMITER ',' CSV HEADER;


COPY players(player_id, player_name, age, created_at)
FROM '/Users/gmailgozzo/llamaproject/Hackathon-Groupe9/data/players.csv'
DELIMITER ',' CSV HEADER;

COPY games(game_id, game_date, table_id, duration, score_red, score_blue, winner_team)
FROM '/Users/gmailgozzo/llamaproject/Hackathon-Groupe9/data/games.csv'
DELIMITER ',' CSV HEADER;


COPY performances(game_id, player_id, team_color, role, is_substitute, goals, own_goals, created_at, assist, save, possession_time)
FROM '/Users/gmailgozzo/llamaproject/Hackathon-Groupe9/data/performances.csv'
DELIMITER ',' CSV HEADER;
