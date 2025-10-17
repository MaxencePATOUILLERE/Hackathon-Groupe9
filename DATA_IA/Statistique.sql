--Top 10 des buteurs
SELECT
    p.player_id,
    pl.player_name,
    SUM(p.goals) AS total_goals
FROM performances p
JOIN players pl ON p.player_id = pl.player_id
GROUP BY p.player_id, pl.player_name
ORDER BY total_goals DESC
LIMIT 10;

--Top 5 des meilleurs défenseurs (par nombre de saves)
SELECT
    p.player_id,
    pl.player_name,
    SUM(p.save) AS total_saves
FROM performances p
JOIN players pl ON p.player_id = pl.player_id
GROUP BY p.player_id, pl.player_name
ORDER BY total_saves DESC
LIMIT 5;

--Pour comparer le taux de victoire des équipes rouges vs bleues :
SELECT
    winner_team,
    COUNT(*) AS games_won,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM games), 2) AS win_rate_percentage
FROM games
GROUP BY winner_team;

--Et pour vérifier si les équipes rouges ou bleues sont plus souvent choisies par les meilleurs joueurs :
SELECT
    team_color,
    COUNT(*) AS total_participations
FROM performances
GROUP BY team_color;

--➤ Classement complet des joueurs (score = buts + assists + saves)
SELECT
    p.player_id,
    pl.player_name,
    SUM(p.goals) AS total_goals,
    SUM(p.assist) AS total_assists,
    SUM(p.save) AS total_saves,
    (SUM(p.goals) + SUM(p.assist) + SUM(p.save)) AS performance_score
FROM performances p
JOIN players pl ON p.player_id = pl.player_id
GROUP BY p.player_id, pl.player_name
ORDER BY performance_score DESC;

--Joueurs les plus réguliers (nombre de matchs joués)
SELECT
    player_id,
    COUNT(*) AS total_games
FROM performances
GROUP BY player_id
ORDER BY total_games DESC
LIMIT 10;


--Joueurs les plus "propres" (peu de buts encaissés)
SELECT
    p.player_id,
    pl.player_name,
    SUM(p.own_goals) AS own_goals
FROM performances p
JOIN players pl ON p.player_id = pl.player_id
GROUP BY p.player_id, pl.player_name
ORDER BY own_goals ASC
LIMIT 5;

--Score moyen par partie
SELECT
    AVG(score_red + score_blue) AS avg_total_goals
FROM games;

--➤ Durée moyenne selon la saison
SELECT
    season,
    AVG(duration_seconds) AS avg_duration
FROM games
GROUP BY season
ORDER BY avg_duration DESC;

---Jours de la semaine les plus actifs
SELECT
    TO_CHAR(game_date, 'Day') AS weekday,
    COUNT(*) AS games_count
FROM games
GROUP BY weekday
ORDER BY games_count DESC;

--Impact du rôle sur la victoire (Atk vs Def)
SELECT
    p.role,
    COUNT(*) FILTER (WHERE g.winner_team = p.team_color) * 100.0 / COUNT(*) AS win_rate
FROM performances p
JOIN games g ON p.game_id = g.game_id
GROUP BY p.role;

--Joueur clutch (qui gagne le plus quand il est présent)

SELECT
    p.player_id,
    pl.player_name,
    COUNT(*) FILTER (WHERE g.winner_team = p.team_color) AS wins,
    COUNT(*) AS total_games,
    ROUND(COUNT(*) FILTER (WHERE g.winner_team = p.team_color) * 100.0 / COUNT(*), 2) AS win_rate
FROM performances p
JOIN games g ON p.game_id = g.game_id
JOIN players pl ON p.player_id = pl.player_id
GROUP BY p.player_id, pl.player_name
ORDER BY win_rate DESC
LIMIT 10;

