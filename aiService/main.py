from fastapi import FastAPI, HTTPException
from schemas import ClaimInput, AIResponse
from workflow import run_analysis
import uvicorn

app = FastAPI(title="Insurance AI Engine", version="1.0")

@app.get("/")
def home():
    return {"status": "AI Engine is running 🚀"}

@app.post("/analyze", response_model=AIResponse)
def analyze_claim(claim: ClaimInput):
    """
    Reçoit les données d'un sinistre, exécute le workflow AI, 
    et retourne la décision et l'explication.
    """
    try:
        # Convertir Pydantic -> Dict pour le workflow
        claim_dict = claim.dict()
        
        print(f"📥 Reçu sinistre pour police: {claim.policy_number}")
        
        # Lancer le LangGraph
        result = run_analysis(claim_dict)
        
        # --- DEBUG (Optionnel) ---
        print(f"🔍 Clés reçues du Workflow : {result.keys()}")

        # Formater la réponse (CORRECTION ICI)
        # On mappe les clés du dictionnaire result vers les champs attendus par AIResponse
        response = AIResponse(
            policy_number=str(result.get("policy_number")),
            fraud_score=result.get("fraud_score", 0.0),
            nlp_score=result.get("nlp_score", 0.0),
            total_score=result.get("total_score", 0.0),
            
            # CORRECTION : On utilise 'status' (et on garde 'decision' en secours)
            status=result.get("status") or result.get("decision") or "ANALYZING",
            
            # CORRECTION : On utilise 'ai_analysis' (et on garde 'explanation' en secours)
            ai_analysis=result.get("ai_analysis") or result.get("explanation") or "Analyse indisponible.",
            
            requires_human=result.get("requires_human", True)
        )
        return response

    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)