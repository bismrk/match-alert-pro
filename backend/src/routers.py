from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException

from .models import Team, Match, Subscription, SubscriptionPayload, User
from .auth import get_current_active_user
from .store import teams_db, matches_db, subscriptions_db, bets_db

router = APIRouter()

@router.get("/teams", response_model=List[Team])
def list_teams():
    return teams_db

@router.get("/subscriptions", response_model=Subscription)
def get_subscription(current_user: User = Depends(get_current_active_user)):
    user_id = current_user.username
    if user_id not in subscriptions_db:
        # Return a default empty subscription if none exists yet
        return Subscription(
            id=f"sub_{user_id}",
            teamIds=[],
            reminderIntervals=[],
            updatedAt=datetime.utcnow()
        )
    return subscriptions_db[user_id]

@router.post("/subscriptions", response_model=Subscription)
def save_subscription(payload: SubscriptionPayload, current_user: User = Depends(get_current_active_user)):
    user_id = current_user.username
    sub = Subscription(
        id=f"sub_{user_id}",
        teamIds=payload.teamIds,
        reminderIntervals=payload.reminderIntervals,
        updatedAt=datetime.utcnow(),
        telegramHandle=None
    )
    if user_id in subscriptions_db:
        sub.telegramHandle = subscriptions_db[user_id].telegramHandle
    
    subscriptions_db[user_id] = sub
    return sub

@router.get("/matches/urgency", response_model=List[Match])
def list_matches_by_urgency(current_user: User = Depends(get_current_active_user)):
    user_id = current_user.username
    
    # Normally we would filter by the user's subscribed teams
    # For now, we return all matches from the mock store and update betPlaced status.
    user_bets = bets_db.get(user_id, set())
    
    result = []
    for match in matches_db:
        # Create a copy so we don't modify the global mock object
        m = match.model_copy()
        m.betPlaced = m.id in user_bets
        result.append(m)
        
    # Sort by kickoffAt ascending
    result.sort(key=lambda m: m.kickoffAt)
    return result

@router.post("/matches/{id}/bet-placed", response_model=Match)
def mark_bet_placed(id: str, current_user: User = Depends(get_current_active_user)):
    user_id = current_user.username
    
    match = next((m for m in matches_db if m.id == id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
        
    user_bets = bets_db.setdefault(user_id, set())
    
    if id in user_bets:
        user_bets.remove(id)
        bet_placed = False
    else:
        user_bets.add(id)
        bet_placed = True
        
    m = match.model_copy()
    m.betPlaced = bet_placed
    return m
