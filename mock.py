from datetime import datetime
from enum import Enum
from pydantic import BaseModel
from typing import List, Optional

class RiskTier(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class CustomerEntity(BaseModel):
    customer_id: str
    name_masked: str
    segment: str

class ReasonCode(BaseModel):
    code: str
    description: str

class ModelScores(BaseModel):
    supervised: float
    anomaly: float
    behavioral_z: float

class GraphFeatures(BaseModel):
    fan_in_ratio: float
    fan_out_concentration: float
    is_pass_through_account: bool

class TransactionEvent(BaseModel):
    timestamp: datetime
    from_account: str
    to_account: str
    amount_sar: float
    direction: str
    is_cross_border: Optional[bool] = False
    destination_risk_tier: Optional[str] = "LOW"

class StructuredCase(BaseModel):
    case_id: str
    customer: CustomerEntity
    risk_score: float
    risk_tier: RiskTier
    reason_codes: List[ReasonCode]
    model_scores: ModelScores
    graph_features: Optional[GraphFeatures] = None
    transactions: List[TransactionEvent]

CASES_DB = {
    "CASE-2026-08-0341": StructuredCase(
        case_id="CASE-2026-08-0341",
        customer=CustomerEntity(customer_id="CUST-10432", name_masked="M. Al-Shahri", segment="SME - Import/Export"),
        risk_score=0.86,
        risk_tier=RiskTier.CRITICAL,
        reason_codes=[
            ReasonCode(code="RC-001", description="Rapid aggregation of funds from multiple sources (Fan-in)"),
            ReasonCode(code="RC-014", description="Immediate transfer to high-risk jurisdiction post-aggregation"),
        ],
        model_scores=ModelScores(supervised=0.83, anomaly=0.91, behavioral_z=4.2),
        graph_features=GraphFeatures(fan_in_ratio=0.94, fan_out_concentration=0.96, is_pass_through_account=True),
        transactions=[
            TransactionEvent(timestamp=datetime(2026, 8, 10, 9, 14), from_account="ACC_9931", to_account="ACC_1042", amount_sar=78500, direction="inbound"),
            TransactionEvent(timestamp=datetime(2026, 8, 12, 21, 3), from_account="ACC_1042", to_account="ACC_9911", amount_sar=460000, direction="outbound", is_cross_border=True, destination_risk_tier="HIGH"),
        ],
    ),
    "CASE-2026-08-0512": StructuredCase(
        case_id="CASE-2026-08-0512",
        customer=CustomerEntity(customer_id="CUST-20891", name_masked="K. Al-Otaibi", segment="Retail Banking"),
        risk_score=0.72,
        risk_tier=RiskTier.HIGH,
        reason_codes=[
            ReasonCode(code="RC-008", description="Frequent cash deposits below regulatory threshold (Structuring)"),
        ],
        model_scores=ModelScores(supervised=0.70, anomaly=0.75, behavioral_z=3.1),
        transactions=[
            TransactionEvent(timestamp=datetime(2026, 8, 14, 10, 0), from_account="CASH", to_account="ACC_3011", amount_sar=49000, direction="inbound"),
            TransactionEvent(timestamp=datetime(2026, 8, 14, 11, 30), from_account="CASH", to_account="ACC_3011", amount_sar=48500, direction="inbound"),
        ],
    )
}
# 
def get_case_by_id(case_id: str) -> StructuredCase:
    return CASES_DB.get(case_id, CASES_DB["CASE-2026-08-0341"])