from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class DBUser(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    disabled = Column(Boolean, default=False)
    hashed_password = Column(String, nullable=False)
    
    # relationships
    subscription = relationship("DBSubscription", back_populates="user", uselist=False)
    bets = relationship("DBUserBet", back_populates="user")

class DBTeam(Base):
    __tablename__ = "teams"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    league = Column(String, nullable=False)
    crestUrl = Column(String, nullable=False)

class DBMatch(Base):
    __tablename__ = "matches"

    id = Column(String, primary_key=True, index=True)
    homeTeam = Column(String, nullable=False)
    awayTeam = Column(String, nullable=False)
    competition = Column(String, nullable=False)
    venue = Column(String, nullable=False)
    kickoffAt = Column(DateTime, nullable=False)
    crestUrl = Column(String, nullable=False)
    urgency = Column(String, nullable=False)

    bets = relationship("DBUserBet", back_populates="match")

class DBSubscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.username"), unique=True, nullable=False)
    telegramHandle = Column(String, nullable=True)
    updatedAt = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    
    teamIds = Column(JSON, default=list, nullable=False)
    reminderIntervals = Column(JSON, default=list, nullable=False)

    user = relationship("DBUser", back_populates="subscription")

class DBUserBet(Base):
    __tablename__ = "user_bets"

    user_id = Column(String, ForeignKey("users.username"), primary_key=True)
    match_id = Column(String, ForeignKey("matches.id"), primary_key=True)

    user = relationship("DBUser", back_populates="bets")
    match = relationship("DBMatch", back_populates="bets")
