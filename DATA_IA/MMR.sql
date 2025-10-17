
-- ajout du MMR pour chaque joueur


ALTER TABLE players ADD COLUMN MMR INT DEFAULT 1000;

UPDATE players
SET MMR = (
    SELECT 
        SUM(
            CASE
                WHEN perf.team_color = g.winner THEN 30
                ELSE -25
            END
            + (perf.goals * 4)
            + (perf.assist * 2)
            + (perf.player_saves * 2)
            - (perf.own_goals * 5)
            + (ABS(g.score_red - g.score_blue) / 3.0)
        )
    FROM performances perf
    JOIN games g ON perf.game_id = g.game_id
    WHERE perf.player_id = players.player_id
)
WHERE EXISTS (
    SELECT 1
    FROM performances perf
    WHERE perf.player_id = players.player_id
);



-- Pour voir qui as le meilleurs MMR


SELECT 
    p.player_id,
    p.player_name,
    SUM(
        CASE
            WHEN perf.team_color = g.winner THEN 30
            ELSE -25
        END
        + (perf.goals * 4)
        + (perf.assist * 2)
        + (perf.player_saves * 2)
        - (perf.own_goals * 5)
        + (ABS(g.score_red - g.score_blue) / 3.0)
    ) AS MMR
FROM players p
JOIN performances perf ON p.player_id = perf.player_id
JOIN games g ON perf.game_id = g.game_id
GROUP BY p.player_id, p.player_name
ORDER BY MMR DESC;
