


# import os
# import pickle
# import pandas as pd
# import numpy as np
# import chromadb
# from langchain_groq import ChatGroq
# from dotenv import load_dotenv
# from langgraph.graph import StateGraph, END
# from typing import TypedDict, List
# from sentence_transformers import SentenceTransformer

# # --- CONFIGURATION ---
# load_dotenv()
# MODEL_PATH = "./fraud_model.pkl" # Assurez-vous que le chemin est bon
# CHROMA_PATH = "./chroma_db"

# # 1. Chargement des Modèles (ML & Embeddings)
# try:
#     # Chargement du modèle XGBoost/Sklearn entraîné
#     with open(MODEL_PATH, "rb") as f:
#         # On suppose que le pkl contient (classifier, feature_columns, et potentiellement un vieux tokenizer qu'on ignore)
#         loaded_data = pickle.load(f)
#         clf = loaded_data[0]
#         feature_columns = loaded_data[1]
    
#     print("✅ Modèle de fraude chargé.")

#     # Chargement du modèle de texte pour les embeddings (local)
#     print("🔄 Chargement du modèle d'embeddings (SentenceTransformer)...")
#     model_text = SentenceTransformer('all-MiniLM-L6-v2') 

# except FileNotFoundError:
#     raise Exception(f"❌ Modèle introuvable à {MODEL_PATH}. Vérifiez le chemin.")
# except Exception as e:
#     raise Exception(f"❌ Erreur lors du chargement des modèles : {e}")

# # 2. Config ChromaDB
# chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
# collection = chroma_client.get_or_create_collection(name="claims_embeddings")

# # 3. Config LLM (Groq)
# llm = ChatGroq(
#     temperature=0.5, # Température plus basse pour plus de rigueur analytique
#     groq_api_key=os.getenv("GROQ_API_KEY"),
#     model_name="llama-3.3-8b-versatile"
# )

# # --- AGENTS ---

# def fraud_scoring_agent(state):
#     """Calcule la probabilité mathématique de fraude via le modèle ML."""
#     print("🤖 Scoring Agent (ML)...")
#     claim = state["claim"]
    
#     # Préparation DataFrame
#     X_claim = pd.DataFrame([claim])
    
#     # Conversion dates - Utilisation sécurisée des scalaires
#     p_bind_date = pd.to_datetime(claim.get('policy_bind_date'), errors='coerce')
#     inc_date = pd.to_datetime(claim.get('incident_date'), errors='coerce')
    
#     # Calcul des jours (sur scalaires pour éviter erreurs Series)
#     if pd.notnull(inc_date) and pd.notnull(p_bind_date):
#         days_diff = (inc_date - p_bind_date).days
#     else:
#         days_diff = 0
        
#     X_claim['policy_bind_date'] = p_bind_date
#     X_claim['incident_date'] = inc_date
#     X_claim['days_since_policy_bind'] = days_diff

#     # Feature Engineering dates
#     if pd.notnull(inc_date):
#         X_claim['month_incident'] = inc_date.month
#         X_claim['day_of_week_incident'] = inc_date.dayofweek
#     else:
#         X_claim['month_incident'] = 0
#         X_claim['day_of_week_incident'] = 0
    
#     # --- CORRECTION ICI : Utilisation du dict 'claim' au lieu du DataFrame ---
#     months_cust = claim.get('months_as_customer', 0)
#     total_amount = claim.get('total_claim_amount', 0)
#     capital_gains = claim.get('capital_gains', 0)
    
#     # Éviter division par zéro
#     safe_months = months_cust if months_cust is not None and months_cust > 0 else 1
    
#     X_claim['claim_per_month'] = total_amount / safe_months
#     X_claim['capital-gains'] = capital_gains
#     X_claim['capital_gain_ratio'] = capital_gains / (total_amount + 1)

#     # Embeddings texte pour le modèle ML
#     try:
#         txt_for_emb = str(claim.get('incident_type', ''))
#         embedding = model_text.encode([txt_for_emb])[0]
#         for i in range(len(embedding)):
#             X_claim[f'incident_emb_{i}'] = embedding[i]
#     except Exception as e:
#         print(f"⚠️ Warning embedding ML: {e}")

#     # Remplir les colonnes manquantes attendues par le modèle avec 0
#     for col in feature_columns:
#         if col not in X_claim.columns:
#             X_claim[col] = 0

#     # Prédiction
#     try:
#         fraud_score = float(clf.predict_proba(X_claim[feature_columns])[:,1][0])
#     except Exception as e:
#         print(f"⚠️ Erreur prédiction ML, fallback 0.5: {e}")
#         fraud_score = 0.5
    
#     new_claim = claim.copy()
#     new_claim['fraud_score'] = fraud_score
#     return {"claim": new_claim}

# def nlp_vector_agent(state):
#     """Compare le sinistre avec l'historique ChromaDB pour trouver des patterns."""
#     print("🧠 NLP Agent (Vector)...")
#     claim = state["claim"]
#     k_neighbors = 5
    
#     # On concatène les infos textuelles clés
#     text = f"{claim.get('incident_type','')} {claim.get('collision_type','')} {claim.get('incident_severity','')} {claim.get('description', '')}"
#     embedding = model_text.encode([text])[0].astype('float32')
    
#     current_count = collection.count()
#     nlp_score = 0.5 # Neutre par défaut

#     if current_count > 5:
#         try:
#             results = collection.query(
#                 query_embeddings=[embedding.tolist()],
#                 n_results=min(k_neighbors, current_count),
#                 include=['metadatas']
#             )
            
#             if results['metadatas'] and len(results['metadatas'][0]) > 0:
#                 # On regarde combien de voisins étaient des refus (REJECT)
#                 reject_count = sum(1 for m in results['metadatas'][0] if m and 'REJECT' in str(m.get('decision', '')))
#                 total_found = len(results['metadatas'][0])
#                 nlp_score = reject_count / total_found
#         except Exception as e:
#             print(f"⚠️ Erreur ChromaDB: {e}")
    
#     new_claim = claim.copy()
#     new_claim['nlp_score'] = nlp_score
#     return {"claim": new_claim}

# def decision_agent(state):
#     """
#     Combine les scores, prend une décision et génère la justification.
#     """
#     print("⚖️ Decision Agent (GenAI)...")
#     claim = state["claim"]
    
#     fraud_score = claim.get('fraud_score', 0.5)
#     nlp_score = claim.get('nlp_score', 0.5)
    
#     # Logique de décision (Pondération)
#     total_score = (fraud_score * 0.6) + (nlp_score * 0.4)
    
#     if total_score > 0.80:
#         decision = "REJECT"
#         requires_human = False
#     elif total_score < 0.20:
#         decision = "VALIDATED"
#         requires_human = False
#     else:
#         decision = "ANALYZING"
#         requires_human = True
        
#     # --- PROMPT GÉNÉRATION JUSTIFICATION AGENT ---
#     prompt = f"""
#     Tu es un Analyste Expert en Fraude et Risque Assurance.
#     Ta mission : Rédiger une **Note de Synthèse Interne** destinée à l'agent gestionnaire (et qui peut etre envoyé directement au client) pour justifier la décision système.

#     DÉCISION DU SYSTÈME : {decision}
#     SCORES : Risque ML {(fraud_score*100):.1f}% | Risque Historique {(nlp_score*100):.1f}%

#     DONNÉES DU SINISTRE :
#     - Client : Ancienneté {claim.get('months_as_customer')} mois | Age {claim.get('age')} | Job {claim.get('insured_occupation')} | Éduc {claim.get('insured_education_level')}
#     - Véhicule : {claim.get('auto_make')} {claim.get('auto_model')} ({claim.get('auto_year')})
#     - Incident : {claim.get('incident_type')} | Gravité {claim.get('incident_severity')} | Collision {claim.get('collision_type')}
#     - DESCRIPTION CLIENT : "{claim.get('description', 'Aucune description fournie')}"
#     - PREUVES : Police {claim.get('police_report_available')} | Témoins {claim.get('witnesses')} | Dommages {claim.get('property_damage')}
#     - MONTANTS : Réclamé {claim.get('total_claim_amount')}€ (Véhicule {claim.get('vehicle_claim')}€)

#     ANALYSE LOGIQUE REQUISE :
#     Identifie les incohérences ou les points forts :
#     1. La description correspond-elle à la gravité/type de collision ?
#     2. Le montant est-il cohérent avec l'âge du véhicule et le type de dégâts ?
#     3. Y a-t-il des éléments manquants suspects (ex: incident grave sans rapport police) ?
#     4. Le profil client (ancienneté) justifie-t-il une confiance immédiate ou une méfiance ?

#     FORMAT DE RÉPONSE (Strictement en Français) :
#     Ne fais pas d'intro type "Voici l'analyse". Donne directement le contenu.
#     Utilise un ton professionnel, direct et factuel (style rapport d'audit).
    
#     Structure :
#     * **Motif Principal** : Une phrase résumant la cause de la décision.
#     * **Points d'attention** : 2 ou 3 tirets (-) détaillant les éléments clés (incohérences relevées SI REJET/ENQUETE, ou éléments rassurants SI VALIDATION).
    
#     Exemple de ton si REJET : "Incohérence majeure détectée : absence de rapport de police pour une collision frontale majeure. Montant réclamé disproportionné par rapport à la valeur vénale estimée."
#     """

#     try:
#         ai_analysis = llm.invoke(prompt).content
#     except Exception as e:
#         ai_analysis = "Analyse indisponible momentanément."
#         print(f"Erreur LLM: {e}")

#     # Mise à jour ChromaDB (Apprentissage continu)
#     try:
#         text_vector = f"{claim.get('incident_type','')} {claim.get('collision_type','')} {claim.get('incident_severity','')} {claim.get('description', '')}"
#         emb = model_text.encode([text_vector])[0].astype('float32')
#         unique_id = f"{claim.get('policy_number', 'unk')}_{pd.Timestamp.now().timestamp()}"
        
#         collection.add(
#             embeddings=[emb.tolist()],
#             metadatas=[{"decision": decision, "policy_number": str(claim.get("policy_number", "unknown"))}],
#             ids=[unique_id]
#         )
#     except Exception as e:
#         print(f"⚠️ Erreur sauvegarde ChromaDB: {e}")

#     final_claim = claim.copy()
#     final_claim.update({
#         "fraud_score": float(fraud_score),
#         "nlp_score": float(nlp_score),
#         "total_score": float(total_score),
#         "status": decision,           # ✅ NOMMAGE CORRECT
#         "ai_analysis": ai_analysis,   # ✅ NOMMAGE CORRECT
#         "requires_human": requires_human
#     })
#     return {"claim": final_claim}

# # --- CONSTRUCTION DU GRAPHE ---

# class GraphState(TypedDict):
#     claim: dict

# workflow = StateGraph(GraphState)

# workflow.add_node("fraud_scoring", fraud_scoring_agent)
# workflow.add_node("nlp_vector", nlp_vector_agent)
# workflow.add_node("decision", decision_agent)

# workflow.set_entry_point("fraud_scoring")
# workflow.add_edge("fraud_scoring", "nlp_vector")
# workflow.add_edge("nlp_vector", "decision")
# workflow.add_edge("decision", END)

# app_graph = workflow.compile()

# def run_analysis(claim_data: dict):
#     """Fonction principale à appeler depuis votre API Flask/FastAPI"""
#     print(f"🚀 Démarrage analyse pour police {claim_data.get('policy_number')}...")
#     result = app_graph.invoke({"claim": claim_data})
#     return result["claim"]

import os
import pickle
import pandas as pd
import numpy as np
import re
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from sentence_transformers import SentenceTransformer

# --- CONFIGURATION ---
load_dotenv()
MODEL_PATH = "./fraud_model.pkl" # Vérifiez votre chemin
# CHROMA_PATH n'est plus nécessaire car on remplace nlp_vector

# 1. Chargement des Modèles (ML & Embeddings pour features ML)
try:
    # Chargement du modèle XGBoost/Sklearn entraîné
    with open(MODEL_PATH, "rb") as f:
        loaded_data = pickle.load(f)
        clf = loaded_data[0]
        feature_columns = loaded_data[1]
    
    print("✅ Modèle de fraude chargé.")

    # On garde SentenceTransformer car le modèle ML l'utilise probablement 
    # pour créer les features 'incident_emb_...'
    print("🔄 Chargement du modèle d'embeddings (pour features ML)...")
    model_text = SentenceTransformer('all-MiniLM-L6-v2') 

except FileNotFoundError:
    # Fallback pour le développement si pas de modèle
    print(f"⚠️ Modèle introuvable à {MODEL_PATH}. Mode Mock activé.")
    clf = None
    feature_columns = []
    model_text = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    raise Exception(f"❌ Erreur lors du chargement des modèles : {e}")

# 2. Config LLM (Groq)
llm = ChatGroq(
    temperature=0.1, # Température basse pour l'analyse logique
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

# --- AGENTS ---

def fraud_scoring_agent(state):
    """Calcule la probabilité mathématique de fraude via le modèle ML."""
    print("🤖 Scoring Agent (ML)...")
    claim = state["claim"]
    
    # Préparation DataFrame (une seule ligne)
    X_claim = pd.DataFrame([claim])
    
    # --- 1. GESTION DES DATES ---
    p_bind_date = pd.to_datetime(claim.get('policy_bind_date'), errors='coerce')
    inc_date = pd.to_datetime(claim.get('incident_date'), errors='coerce')
    
    # Feature Engineering : Jours écoulés
    if pd.notnull(inc_date) and pd.notnull(p_bind_date):
        X_claim['days_since_policy_bind'] = (inc_date - p_bind_date).days
    else:
        X_claim['days_since_policy_bind'] = 0
        
    # Feature Engineering : Mois de l'incident
    if pd.notnull(inc_date):
        X_claim['month_incident'] = inc_date.month
    else:
        X_claim['month_incident'] = 0
    
    # --- 2. GESTION DES COLONNES NUMÉRIQUES (CORRECTION ICI) ---
    numeric_cols = ['months_as_customer', 'total_claim_amount', 'capital_gains']
    
    for col in numeric_cols:
        # Si la colonne n'existe pas dans le JSON d'entrée, on l'initialise à 0
        if col not in X_claim.columns:
            X_claim[col] = 0
            
        # CORRECTION : On convertit la SÉRIE (la colonne entière) et non la valeur scalaire.
        # Une Série Pandas possède la méthode .fillna(), contrairement à un int/float python.
        X_claim[col] = pd.to_numeric(X_claim[col], errors='coerce').fillna(0)

    # --- 3. EMBEDDINGS TEXTE (Si requis par le modèle) ---
    try:
        if 'model_text' in globals() and model_text:
            txt_for_emb = str(claim.get('incident_type', ''))
            # On encode
            embedding = model_text.encode([txt_for_emb])[0]
            for i in range(len(embedding)):
                X_claim[f'incident_emb_{i}'] = embedding[i]
    except Exception as e:
        # Ce n'est pas critique si l'embedding échoue, le modèle utilisera des 0
        pass 

    # --- 4. ALIGNEMENT AVEC LE MODÈLE ---
    # On s'assure que toutes les colonnes attendues par le pickle sont présentes
    # 'feature_columns' doit être défini globalement lors du chargement du pickle
    if 'feature_columns' in globals():
        for col in feature_columns:
            if col not in X_claim.columns:
                X_claim[col] = 0
        # On ne garde que les colonnes utiles et dans le bon ordre
        X_final = X_claim[feature_columns]
    else:
        # Fallback si feature_columns n'est pas chargé
        X_final = X_claim.select_dtypes(include=[np.number])

    # --- 5. PRÉDICTION ---
    score = 0.5
    if 'clf' in globals() and clf:
        try:
            # predict_proba renvoie [[proba_0, proba_1]] -> on prend proba_1 (fraude)
            score = float(clf.predict_proba(X_final)[:,1][0])
        except Exception as e:
            print(f"⚠️ Erreur lors de la prédiction ML : {e}")
            score = 0.5
    
    # Retour du résultat
    new_claim = claim.copy()
    new_claim['fraud_score'] = score
    return {"claim": new_claim}


def llm_analysis_agent(state):
    """
    REMPLACE NLP_VECTOR.
    Analyse la cohérence logique du récit via LLM (Forensic).
    """
    print("🕵️ LLM Analysis Agent (Detective)...")
    claim = state["claim"]
    
    # Préparation des données pour le prompt
    incident = claim.get('incident_type', 'Inconnu')
    severity = claim.get('incident_severity', 'Inconnu')
    authorities = claim.get('authorities_contacted', 'Aucune')
    damage_amt = claim.get('total_claim_amount', '0')
    desc = claim.get('description', 'Pas de description')

    # PROMPT D'ANALYSE LOGIQUE
    prompt = f"""
    Tu es un auditeur expert en fraude à l'assurance.
    Analyse la cohérence de ce dossier.
    
    FAITS :
    - Incident : {incident}
    - Gravité déclarée : {severity}
    - Police contactée : {authorities}
    - Montant réclamé : {damage_amt}
    - Description : {desc}
    
    RÈGLES DE SUSPICION :
    1. Grave accident ("Major Damage", "Total Loss") SANS police ("None") = TRÈS SUSPECT (Score > 0.8).
    2. Incident mineur ("Minor Damage") avec gros montant (>50000) = SUSPECT (Score > 0.7).
    3. Cohérence générale : Est-ce que l'histoire tient debout ?
    
    TACHE :
    Donne moi un score de suspicion entre 0.0 (Sûr) et 1.0 (Fraude certaine).
    
    RÉPONSE ATTENDUE (Format strict) :
    SCORE: 0.XX
    """
    
    try:
        response = llm.invoke(prompt).content
        # Extraction du score via Regex
        match = re.search(r"SCORE:\s*(\d+(\.\d+)?)", response, re.IGNORECASE)
        if match:
            nlp_score = float(match.group(1))
        else:
            nlp_score = 0.5 
            
        nlp_score = min(max(nlp_score, 0.0), 1.0)
        
    except Exception as e:
        print(f"⚠️ Erreur LLM Analysis: {e}")
        nlp_score = 0.5

    new_claim = claim.copy()
    new_claim['nlp_score'] = nlp_score # On garde la clé 'nlp_score' pour la compatibilité
    print(f"   ✓ Score LLM Logic: {nlp_score:.2f}")
    
    return {"claim": new_claim}

def decision_agent(state):
    """
    Combine les scores (ML + LLM Logic), prend une décision et génère la justification.
    """
    print("⚖️ Decision Agent (GenAI)...")
    claim = state["claim"]
    
    fraud_score = claim.get('fraud_score', 0.5)
    nlp_score = claim.get('nlp_score', 0.5) # Vient maintenant de l'agent LLM
    
    # Logique de décision (Pondération ajustée : Logique 60%, Stats 40%)
    total_score = (fraud_score * 0.4) + (nlp_score * 0.6)
    
    if total_score > 0.75:
        decision = "REJECT"
        requires_human = False
        state_label = "REFUSÉ"
    elif total_score < 0.35:
        decision = "VALIDATED"
        requires_human = False
        state_label = "VALIDÉ"
    else:
        decision = "ANALYZING"
        requires_human = True
        state_label = "EN_QUÊTE"
        
    # --- PROMPT GÉNÉRATION JUSTIFICATION ---
    prompt = f"""
    Tu es un Analyste Expert en Fraude. Rédige une note de synthèse pour le dossier {claim.get('policy_number')}.

    DÉCISION : {decision} (Score Global: {total_score:.2f})
    CONTEXTE : {claim.get('incident_type')} | {claim.get('incident_severity')}
    
    CONSIGNES :
    - Si VALIDATED : Ton rassurant. Confirme que les vérifications sont OK.
    - Si REJECT : Ton formel. Pointe l'incohérence logique (ex: gravité vs absence de police) ou le risque statistique élevé.
    - Si ANALYZING : Ton neutre. Demande des infos complémentaires.

    Structure :
    * **Décision** : ...
    * **Analyse** : ...
    """

    try:
        ai_analysis = llm.invoke(prompt).content
    except Exception as e:
        ai_analysis = "Analyse indisponible."

    final_claim = claim.copy()
    final_claim.update({
        "fraud_score": float(fraud_score),
        "nlp_score": float(nlp_score),
        "total_score": float(total_score),
        "status": state_label,
        "decision": decision,
        "ai_analysis": ai_analysis,
        "requires_human": requires_human
    })
    return {"claim": final_claim}

# --- CONSTRUCTION DU GRAPHE ---

class GraphState(TypedDict):
    claim: dict

workflow = StateGraph(GraphState)

# Ajout des noeuds
workflow.add_node("fraud_scoring", fraud_scoring_agent)
workflow.add_node("llm_scoring", llm_analysis_agent) # Nouveau nom de noeud
workflow.add_node("decision", decision_agent)

# Définition du flux
workflow.set_entry_point("fraud_scoring")
workflow.add_edge("fraud_scoring", "llm_scoring") # ML -> LLM
workflow.add_edge("llm_scoring", "decision")      # LLM -> Decision
workflow.add_edge("decision", END)

app_graph = workflow.compile()

def run_analysis(claim_data: dict):
    """Fonction principale à appeler depuis votre API"""
    print(f"🚀 Démarrage analyse pour police {claim_data.get('policy_number')}...")
    # On s'assure que l'entrée est un dict
    if not isinstance(claim_data, dict):
        raise ValueError("run_analysis attend un dictionnaire")
        
    result = app_graph.invoke({"claim": claim_data})
    return result["claim"]