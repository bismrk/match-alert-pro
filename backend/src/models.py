from enum import Enum
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

class Urgency(str, Enum):
    critical = "critical"
    soon = "soon"
    later = "later"

class ReminderInterval(str, Enum):
    five_d = "5d"
    two_d = "2d"
    two_h = "2h"

class Team(BaseModel):
    id: str
    name: str
    league: str
    crestUrl: str

class Match(BaseModel):
    id: str
    homeTeam: str
    awayTeam: str
    competition: str
    venue: str
    kickoffAt: datetime
    crestUrl: str
    urgency: Urgency
    betPlaced: bool

class SubscriptionPayload(BaseModel):
    teamIds: List[str]
    reminderIntervals: List[ReminderInterval]

class Subscription(SubscriptionPayload):
    id: str
    telegramHandle: Optional[str] = None
    updatedAt: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str
