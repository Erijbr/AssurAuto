from pydantic import BaseModel
from typing import Optional

class ClaimInput(BaseModel):
    # --- CHAMPS PRINCIPAUX ---
    policy_number: Optional[str] = "UNKNOWN"
    incident_date: str
    incident_type: str
    collision_type: Optional[str] = "?"
    incident_severity: str
    
    # ✅ AJOUT DU CHAMP DESCRIPTION ICI
    description: Optional[str] = "Aucune description fournie"
    
    authorities_contacted: Optional[str] = "None"
    total_claim_amount: float
    
    # --- CHAMPS POUR LE MODÈLE ML ---
    months_as_customer: int = 0
    age: int = 30
    policy_state: str = "OH"
    policy_csl: str = "100/300"
    policy_deductable: int = 500
    umbrella_limit: int = 0
    insured_sex: str = "FEMALE"
    insured_education_level: str = "MD"
    insured_occupation: str = "sales"
    insured_hobbies: str = "reading"
    insured_relationship: str = "husband"
    capital_gains: int = 0
    capital_loss: int = 0
    vehicle_claim: float = 0
    auto_make: str = "Saab"
    auto_model: str = "92x"
    auto_year: int = 2004
    property_damage: str = "NO"
    bodily_injuries: int = 0
    witnesses: int = 0
    police_report_available: str = "NO"
    policy_bind_date: str = "2020-01-01"

class AIResponse(BaseModel):
    policy_number: str
    fraud_score: float
    nlp_score: float
    total_score: float
    
    # ✅ MISE À JOUR pour correspondre au workflow.py
    status: str          # Contiendra "VALIDATED", "REJECTED" ou "ANALYZING"
    ai_analysis: str     # Contiendra la justification générée par le LLM
    
    requires_human: bool