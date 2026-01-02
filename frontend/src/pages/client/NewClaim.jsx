

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import axios from 'axios'; // N'oubliez pas l'import
import { 
  Upload, FileText, CheckCircle, Loader2, Calendar, 
  CreditCard, FileDigit, AlignLeft, X, CloudUpload, ArrowRight, ShieldAlert, Hash, Car, Siren, AlertTriangle, Edit, Paperclip 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api/axios'; 



const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default function NewClaim() {
  const navigate = useNavigate();
  
  // --- GÉNÉRATEUR PAR DÉFAUT ---
  const generatePolicyNumber = () => {
    return "POL-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 99);
  };

  // --- ÉTATS ---
  const [formData, setFormData] = useState({
    policy_number: generatePolicyNumber(),
    description: '',
    incident_date: '',
    claim_amount: '',
    incident_type: 'Single Vehicle Collision',
    collision_type: 'Front Collision',
    incident_severity: 'Minor Damage',
    authorities_contacted: 'None',
    city: 'Paris',
  });

  const [ocrFile, setOcrFile] = useState(null);
  const [finalFile, setFinalFile] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



const analyzeWithGroq = async (rawText) => {
  const cleanText = rawText
    .replace(/["]/g, "'")
    .replace(/\n+/g, " ")
    .substring(0, 3000);

  const prompt = `
Tu es un assistant expert en assurance.

Analyse le texte OCR ci-dessous et extrais les informations demandées.
Si une information est absente ou incertaine, utilise null.
Ne devine jamais.

TEXTE OCR :
${cleanText}

Retourne uniquement un objet JSON valide avec les champs suivants :

incident_type: ["Multi-vehicle Collision","Single Vehicle Collision","Vehicle Theft","Parked Car"]
collision_type: ["Front Collision","Rear Collision","Side Collision","?"]
incident_severity: ["Minor Damage","Major Damage","Total Loss"]
authorities_contacted: ["None","Police","Fire","Ambulance"]
claim_amount: number | null
incident_date: YYYY-MM-DD
policy_number: string
city: string | "Inconnue"
description: résumé en français (max 200 caractères)
`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let content = response.data.choices[0].message.content.trim();

    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');

    if (start !== -1 && end !== -1) {
      return JSON.parse(content.substring(start, end + 1));
    }

    return null;
  } catch (error) {
    console.error("Erreur Groq API:", error.response?.data || error);
    return null;
  }
};


  // --- LOGIQUE PRINCIPALE ---
  const handleOCR = async (file) => {
    if (!file) return;

    setOcrFile(file);
    setFinalFile(file); 

    if (file.type === 'application/pdf') {
        toast.success("PDF ajouté. L'analyse se fera côté serveur.");
        return;
    }

    setOcrLoading(true);
    setOcrProgress(0);

    try {
      // 1. EXTRACTION DU TEXTE (Tesseract)
      const result = await Tesseract.recognize(
        file, 'fra', 
        { logger: (m) => { if (m.status === 'recognizing text') setOcrProgress(Math.floor(m.progress * 100)); }}
      );

      const rawText = result.data.text;
      console.log("Texte Tesseract :", rawText);

      // Notification UX
      toast.loading("Analyse intelligente (LLM) en cours...", { id: "ai-processing" });

      // 2. COMPRÉHENSION (Appel Groq)
      const aiData = await analyzeWithGroq(rawText);

      toast.dismiss("ai-processing");

      if (aiData) {
        console.log("Données IA reçues :", aiData);
        
        // 3. REMPLISSAGE DU FORMULAIRE
        setFormData(prev => ({
          ...prev,
          description: aiData.description || prev.description,
          // On garde l'ancienne valeur si l'IA renvoie null
          claim_amount: aiData.claim_amount ? aiData.claim_amount.toString() : prev.claim_amount,
          incident_date: aiData.incident_date || prev.incident_date,
          policy_number: aiData.policy_number || prev.policy_number,
          city: aiData.city || prev.city,
          
          // Mapping des Enums
          incident_type: aiData.incident_type || "Single Vehicle Collision",
          collision_type: aiData.collision_type || "?",
          incident_severity: aiData.incident_severity || "Minor Damage",
          authorities_contacted: aiData.authorities_contacted || "None",
        }));

        toast.success("Formulaire rempli par l'IA !");
      } else {
        // Fallback si l'IA échoue
        setFormData(prev => ({ ...prev, description: rawText.substring(0, 300) }));
        toast.error("IA indisponible, mode texte brut.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Échec de l'analyse.");
      toast.dismiss("ai-processing");
    } finally {
      setOcrLoading(false);
    }
  };

  // --- SOUMISSION API ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!finalFile) {
        toast.error("Veuillez joindre le document justificatif final.");
        return;
    }

    setIsSubmitting(true);

    try {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        data.append('document', finalFile);

        const response = await api.post('/claims', data);

        if (response.data.status === 'VALIDATED') {
            toast.success("Dossier approuvé automatiquement !");
        } else {
            toast.success("Dossier soumis pour analyse.");
        }
        
        setTimeout(() => navigate('/client'), 2000);

    } catch (error) {
        console.error("Erreur soumission", error);
        toast.error("Erreur lors de l'envoi.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 font-sans bg-gray-50">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* COLONNE GAUCHE (Scanner OCR) */}
        <div className="w-full md:w-1/3 bg-slate-900 p-8 text-white flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>

           <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
                        <ShieldAlert className="text-blue-400" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold">Nouveau Sinistre</h1>
                </div>
                
                <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                    Déposez votre constat ou devis pour un remplissage automatique.
                </p>

                {/* ZONE DE DRAG & DROP */}
                <div 
                    className={`
                    border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative group h-64 flex flex-col justify-center items-center
                    ${isDragOver ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/50'}
                    `}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if(e.dataTransfer.files[0]) handleOCR(e.dataTransfer.files[0]); }}
                >
                    <input 
                        type="file" 
                        className="hidden" 
                        id="ocr-upload"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleOCR(e.target.files[0])}
                    />
                    <label htmlFor="ocr-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                        {ocrLoading ? (
                            <>
                                <Loader2 className="animate-spin text-blue-400 w-10 h-10 mb-3" />
                                <span className="text-sm font-medium text-blue-200">
                                    {ocrProgress < 100 ? `Lecture OCR... ${ocrProgress}%` : "Analyse..."}
                                </span>
                            </>
                        ) : (
                            <>
                                <CloudUpload className="w-12 h-12 text-slate-400 mb-3 group-hover:text-white transition-colors" />
                                <h3 className="font-semibold text-lg">Scanner un document</h3>
                                
                            </>
                        )}
                    </label>
                </div>
           </div>

           {/* PREVIEW */}
           {ocrFile && !ocrLoading && (
                <div className="mt-6">
                    <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Document Analysé</p>
                    <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-between border border-slate-700">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <FileText size={20} className="text-blue-400 flex-shrink-0" />
                            <span className="text-xs text-slate-300 truncate">{ocrFile.name}</span>
                        </div>
                    </div>
                </div>
           )}
        </div>

        {/* COLONNE DROITE (Formulaire) */}
        <div className="w-full md:w-2/3 p-8 bg-white relative overflow-y-auto max-h-[90vh]">
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Détails de l'incident</h2>
                    {/* {ocrProgress === 100 && !ocrLoading && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 flex gap-1 items-center"><CheckCircle size={12}/> IA Terminée</span>} */}
                </div>

                {/* --- LIGNE 1 : POLICE & DATE --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">N° Police</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3.5 text-blue-500" size={18} />
                            <input 
                                type="text" 
                                className="w-full bg-blue-50 pl-10 pr-4 py-3 rounded-xl border border-blue-100 text-gray-700 font-bold"
                                value={formData.policy_number}
                                onChange={(e) => setFormData({...formData, policy_number: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Date Incident</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input 
                                type="date" 
                                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white outline-none"
                                value={formData.incident_date}
                                onChange={(e) => setFormData({...formData, incident_date: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* --- LIGNE 2 : MONTANT & VILLE --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Montant Estimé (€)</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input 
                                type="number" 
                                placeholder="0.00"
                                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white outline-none font-medium"
                                value={formData.claim_amount}
                                onChange={(e) => setFormData({...formData, claim_amount: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ville de l'incident</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white outline-none"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                    </div>
                </div>

                {/* --- LIGNE 3 : TYPE & COLLISION --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type d'incident</label>
                        <div className="relative">
                            <Car className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <select 
                                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none appearance-none"
                                value={formData.incident_type}
                                onChange={(e) => setFormData({...formData, incident_type: e.target.value})}
                            >
                                <option value="Multi-vehicle Collision">Collision Multi-véhicules</option>
                                <option value="Single Vehicle Collision">Accident Seul</option>
                                <option value="Vehicle Theft">Vol de véhicule</option>
                                <option value="Parked Car">Véhicule Stationné</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type de Choc</label>
                        <select 
                            className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                            value={formData.collision_type}
                            onChange={(e) => setFormData({...formData, collision_type: e.target.value})}
                        >
                            <option value="Front Collision">Choc Avant</option>
                            <option value="Rear Collision">Choc Arrière</option>
                            <option value="Side Collision">Choc Latéral</option>
                            <option value="?">Inconnu</option>
                        </select>
                    </div>
                </div>

                {/* --- LIGNE 4 : SÉVÉRITÉ & AUTORITÉS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gravité</label>
                        <div className="relative">
                            <AlertTriangle className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <select 
                                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none appearance-none"
                                value={formData.incident_severity}
                                onChange={(e) => setFormData({...formData, incident_severity: e.target.value})}
                            >
                                <option value="Minor Damage">Dégâts Mineurs</option>
                                <option value="Major Damage">Dégâts Majeurs</option>
                                <option value="Total Loss">Perte Totale (Épave)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Autorités Contactées</label>
                        <div className="relative">
                            <Siren className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <select 
                                className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none appearance-none"
                                value={formData.authorities_contacted}
                                onChange={(e) => setFormData({...formData, authorities_contacted: e.target.value})}
                            >
                                <option value="None">Aucune</option>
                                <option value="Police">Police / Gendarmerie</option>
                                <option value="Fire">Pompiers</option>
                                <option value="Ambulance">Ambulance</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- DESCRIPTION --- */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description détaillée</label>
                    <div className="relative">
                        <AlignLeft className="absolute left-3 top-4 text-gray-400" size={18} />
                        <textarea 
                            rows="3"
                            placeholder="Circonstances de l'accident..."
                            className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-500 outline-none resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                        ></textarea>
                    </div>
                </div>

                {/* --- CHOIX FICHIER FINAL --- */}
                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Document Justificatif à joindre</label>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <Paperclip size={20} className="text-blue-500" />
                            <span className="text-sm text-gray-700 truncate font-medium">
                                {finalFile ? finalFile.name : "Aucun fichier sélectionné"}
                            </span>
                        </div>
                        
                        <input 
                            type="file" 
                            id="final-file-upload" 
                            className="hidden" 
                            onChange={(e) => setFinalFile(e.target.files[0])} 
                        />
                        <label 
                            htmlFor="final-file-upload" 
                            className="p-3 bg-white hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-200 cursor-pointer transition-colors shadow-sm"
                        >
                            <Edit size={20} />
                        </label>
                    </div>
                </div>

                {/* BOUTON SUBMIT */}
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99] flex justify-center items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Envoi en cours...</span>
                        </>
                    ) : (
                        <>
                            <span>Soumettre le dossier</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>

            </form>
        </div>
      </div>
    </div>
  );
}