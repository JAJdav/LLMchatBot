from __future__ import annotations
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class RiskTier(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class TransactionEvent(BaseModel):
    timestamp: datetime
    from_account: str
    to_account: str
    amount_sar: float
    direction: str
    is_cross_border: bool = False
    destination_risk_tier: str | None = None


class ModelScores(BaseModel):
    supervised: float = Field(ge=0, le=1)
    anomaly: float = Field(ge=0, le=1)
    behavioral_z: float


class GraphFeatures(BaseModel):
    fan_in_ratio: float | None = None
    fan_out_concentration: float | None = None
    is_pass_through_account: bool | None = None
    pagerank_score: float | None = None
    unique_counterparties_72h: int | None = None


class ReasonCode(BaseModel):
    code: str
    description_ar: str


class CustomerEntity(BaseModel):
    customer_id: str
    name_masked: str
    segment: str | None = None


class StructuredCase(BaseModel):
    case_id: str
    customer: CustomerEntity
    risk_score: float = Field(ge=0, le=1)
    risk_tier: RiskTier
    reason_codes: list[ReasonCode]
    model_scores: ModelScores
    graph_features: GraphFeatures | None = None
    transactions: list[TransactionEvent]
    status: str = "PENDING_REVIEW"