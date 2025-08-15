from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class CompanyBase(BaseModel):
    symbol: str
    name: str
    sector: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    market_cap: Optional[float] = None
    current_price: Optional[float] = None
    last_updated: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class StockData(BaseModel):
    symbol: str
    current_price: float
    change: float
    change_percent: float
    volume: int
    market_cap: Optional[float] = None
    high_52_week: Optional[float] = None
    low_52_week: Optional[float] = None
    pe_ratio: Optional[float] = None
    dividend_yield: Optional[float] = None
    last_updated: datetime

class HistoricalData(BaseModel):
    symbol: str
    dates: List[str]
    prices: List[float]
    volumes: List[int]
    period: str

class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None
