from datetime import datetime, timedelta
from typing import Dict, List
from .models import Team, Match, Subscription, Urgency, ReminderInterval

def hours_from_now(h: float) -> str:
    return (datetime.utcnow() + timedelta(hours=h)).isoformat() + "Z"

teams_db: List[Team] = [
    Team(id="rma", name="Real Madrid", league="La Liga", crestUrl="/src/assets/crest-navy.png"),
    Team(id="bar", name="Barcelona", league="La Liga", crestUrl="/src/assets/crest-green.png"),
    Team(id="ars", name="Arsenal", league="Premier League", crestUrl="/src/assets/crest-red.png"),
    Team(id="liv", name="Liverpool", league="Premier League", crestUrl="/src/assets/crest-red.png"),
    Team(id="int", name="Inter", league="Serie A", crestUrl="/src/assets/crest-green.png"),
    Team(id="juv", name="Juventus", league="Serie A", crestUrl="/src/assets/crest-black.png"),
    Team(id="mil", name="AC Milan", league="Serie A", crestUrl="/src/assets/crest-red.png"),
    Team(id="bay", name="Bayern", league="Bundesliga", crestUrl="/src/assets/crest-navy.png"),
    Team(id="bvb", name="Dortmund", league="Bundesliga", crestUrl="/src/assets/crest-black.png"),
    Team(id="psg", name="PSG", league="Ligue 1", crestUrl="/src/assets/crest-navy.png"),
]

matches_db: List[Match] = [
    Match(
        id="m1",
        homeTeam="Real Madrid",
        awayTeam="Barcelona",
        competition="La Liga",
        venue="Estadio Bernabéu",
        kickoffAt=hours_from_now(1.4), # type: ignore
        crestUrl="/src/assets/crest-navy.png",
        urgency=Urgency.critical,
        betPlaced=False,
    ),
    Match(
        id="m2",
        homeTeam="Arsenal",
        awayTeam="Liverpool",
        competition="Premier League",
        venue="Emirates",
        kickoffAt=hours_from_now(18), # type: ignore
        crestUrl="/src/assets/crest-red.png",
        urgency=Urgency.soon,
        betPlaced=False,
    ),
    Match(
        id="m3",
        homeTeam="Inter",
        awayTeam="Juventus",
        competition="Serie A",
        venue="San Siro",
        kickoffAt=hours_from_now(30.4), # type: ignore
        crestUrl="/src/assets/crest-green.png",
        urgency=Urgency.soon,
        betPlaced=False,
    ),
    Match(
        id="m4",
        homeTeam="Bayern",
        awayTeam="Dortmund",
        competition="Bundesliga",
        venue="Allianz",
        kickoffAt=hours_from_now(60.2), # type: ignore
        crestUrl="/src/assets/crest-black.png",
        urgency=Urgency.later,
        betPlaced=False,
    ),
]

# We need a per-user store for subscriptions and bet statuses.
# user_id -> Subscription
subscriptions_db: Dict[str, Subscription] = {
    "testuser": Subscription(
        id="sub_testuser",
        teamIds=["rma", "ars", "int", "bay"],
        reminderIntervals=[ReminderInterval.five_d, ReminderInterval.two_d, ReminderInterval.two_h],
        telegramHandle="@bet_tracker",
        updatedAt=datetime.utcnow(),
    )
}

# user_id -> set of match ids where bet is placed
bets_db: Dict[str, set[str]] = {
    "testuser": set()
}
