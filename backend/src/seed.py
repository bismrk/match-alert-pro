from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import db_models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hours_from_now(h: float) -> datetime:
    return datetime.now(timezone.utc) + timedelta(hours=h)

def seed_db(db: Session):
    # Check if we already have teams
    if db.query(db_models.DBTeam).first():
        return

    teams = [
        db_models.DBTeam(id="rma", name="Real Madrid", league="La Liga", crestUrl="/crest-navy.png"),
        db_models.DBTeam(id="bar", name="Barcelona", league="La Liga", crestUrl="/crest-green.png"),
        db_models.DBTeam(id="ars", name="Arsenal", league="Premier League", crestUrl="/crest-red.png"),
        db_models.DBTeam(id="liv", name="Liverpool", league="Premier League", crestUrl="/crest-red.png"),
        db_models.DBTeam(id="int", name="Inter", league="Serie A", crestUrl="/crest-green.png"),
        db_models.DBTeam(id="juv", name="Juventus", league="Serie A", crestUrl="/crest-black.png"),
        db_models.DBTeam(id="mil", name="AC Milan", league="Serie A", crestUrl="/crest-red.png"),
        db_models.DBTeam(id="bay", name="Bayern", league="Bundesliga", crestUrl="/crest-navy.png"),
        db_models.DBTeam(id="bvb", name="Dortmund", league="Bundesliga", crestUrl="/crest-black.png"),
        db_models.DBTeam(id="psg", name="PSG", league="Ligue 1", crestUrl="/crest-navy.png"),
    ]
    db.add_all(teams)

    matches = [
        db_models.DBMatch(
            id="m1", homeTeam="Real Madrid", awayTeam="Barcelona", competition="La Liga",
            venue="Estadio Bernabéu", kickoffAt=hours_from_now(1.4), crestUrl="/crest-navy.png", urgency="critical"
        ),
        db_models.DBMatch(
            id="m2", homeTeam="Arsenal", awayTeam="Liverpool", competition="Premier League",
            venue="Emirates", kickoffAt=hours_from_now(18), crestUrl="/crest-red.png", urgency="soon"
        ),
        db_models.DBMatch(
            id="m3", homeTeam="Inter", awayTeam="Juventus", competition="Serie A",
            venue="San Siro", kickoffAt=hours_from_now(30.4), crestUrl="/crest-green.png", urgency="soon"
        ),
        db_models.DBMatch(
            id="m4", homeTeam="Bayern", awayTeam="Dortmund", competition="Bundesliga",
            venue="Allianz", kickoffAt=hours_from_now(60.2), crestUrl="/crest-black.png", urgency="later"
        ),
    ]
    db.add_all(matches)

    # Add test user
    if not db.query(db_models.DBUser).filter(db_models.DBUser.username == "testuser").first():
        hashed = pwd_context.hash("password")
        test_user = db_models.DBUser(username="testuser", hashed_password=hashed)
        db.add(test_user)
        
        # Add test user subscription
        sub = db_models.DBSubscription(
            id="sub_testuser",
            user_id="testuser",
            telegramHandle="@bet_tracker",
            teamIds=["rma", "ars", "int", "bay"],
            reminderIntervals=["5d", "2d", "2h"]
        )
        db.add(sub)
    
    db.commit()
