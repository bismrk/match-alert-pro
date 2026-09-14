from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .models import Team, Match, Subscription, SubscriptionPayload
from .auth import get_current_active_user
from .database import get_db
from . import db_models

router = APIRouter()

@router.get("/teams", response_model=List[Team])
def list_teams(db: Session = Depends(get_db)):
    return db.query(db_models.DBTeam).all()

@router.get("/subscriptions", response_model=Subscription)
def get_subscription(
    current_user: db_models.DBUser = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    sub = db.query(db_models.DBSubscription).filter(db_models.DBSubscription.user_id == current_user.username).first()
    if not sub:
        return Subscription(
            id=f"sub_{current_user.username}",
            teamIds=[],
            reminderIntervals=[],
            updatedAt=datetime.now(timezone.utc)
        )
    return sub

@router.post("/subscriptions", response_model=Subscription)
def save_subscription(
    payload: SubscriptionPayload, 
    current_user: db_models.DBUser = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    sub = db.query(db_models.DBSubscription).filter(db_models.DBSubscription.user_id == current_user.username).first()
    if not sub:
        sub = db_models.DBSubscription(
            id=f"sub_{current_user.username}",
            user_id=current_user.username,
            telegramHandle=None
        )
        db.add(sub)
    
    sub.teamIds = payload.teamIds
    sub.reminderIntervals = payload.reminderIntervals
    sub.updatedAt = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(sub)
    return sub

@router.get("/matches/urgency", response_model=List[Match])
def list_matches_by_urgency(
    current_user: db_models.DBUser = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Fetch all matches
    matches = db.query(db_models.DBMatch).order_by(db_models.DBMatch.kickoffAt).all()
    
    # Fetch user bets
    user_bets = db.query(db_models.DBUserBet).filter(db_models.DBUserBet.user_id == current_user.username).all()
    bet_match_ids = {b.match_id for b in user_bets}
    
    result = []
    for m in matches:
        # Convert SQLAlchemy object to dict to match Pydantic model structure
        m_dict = {
            "id": m.id,
            "homeTeam": m.homeTeam,
            "awayTeam": m.awayTeam,
            "competition": m.competition,
            "venue": m.venue,
            "kickoffAt": m.kickoffAt,
            "crestUrl": m.crestUrl,
            "urgency": m.urgency,
            "betPlaced": m.id in bet_match_ids
        }
        result.append(Match(**m_dict))
        
    return result

@router.post("/matches/{id}/bet-placed", response_model=Match)
def mark_bet_placed(
    id: str, 
    current_user: db_models.DBUser = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    match = db.query(db_models.DBMatch).filter(db_models.DBMatch.id == id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
        
    bet = db.query(db_models.DBUserBet).filter(
        db_models.DBUserBet.user_id == current_user.username,
        db_models.DBUserBet.match_id == id
    ).first()
    
    if bet:
        db.delete(bet)
        db.commit()
        bet_placed = False
    else:
        new_bet = db_models.DBUserBet(user_id=current_user.username, match_id=id)
        db.add(new_bet)
        db.commit()
        bet_placed = True
        
    m_dict = {
        "id": match.id,
        "homeTeam": match.homeTeam,
        "awayTeam": match.awayTeam,
        "competition": match.competition,
        "venue": match.venue,
        "kickoffAt": match.kickoffAt,
        "crestUrl": match.crestUrl,
        "urgency": match.urgency,
        "betPlaced": bet_placed
    }
    return Match(**m_dict)
