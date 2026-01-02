// // import { useState, useEffect, useContext } from 'react';
// // import { AuthContext } from '../../context/AuthContext';
// // import api from '../../api/axios';
// // import { CheckCircle, XCircle, FileText, LogOut, RefreshCw } from 'lucide-react';
// // import toast, { Toaster } from 'react-hot-toast';

// // export default function AgentDashboard() {
// //   const { logout } = useContext(AuthContext);
// //   const [claims, setClaims] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // Charger les données
// //   const fetchClaims = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await api.get('/claims');
// //       setClaims(res.data);
// //     } catch (error) {
// //       toast.error("Impossible de charger les dossiers.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchClaims();
// //   }, []);

// //   // Fonction pour changer le statut (Approuver/Rejeter)
// //   const handleStatusUpdate = async (id, newStatus) => {
// //     try {
// //       await api.put(`/claims/${id}`, { status: newStatus });
// //       toast.success(`Dossier ${newStatus === 'APPROVED' ? 'Approuvé' : 'Rejeté'} !`);
// //       fetchClaims();
// //     } catch (error) {
// //       toast.error("Erreur lors de la mise à jour.");
// //     }
// //   };

// //   // Fonction pour ouvrir le PDF
// //   const openDocument = (filename) => {
// //     if (!filename) {
// //       toast.error("Aucun fichier associé.");
// //       return;
// //     }
// //     window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-8">
// //       <Toaster position="top-right" />
      
// //       {/* En-tête */}
// //       <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-800">Espace Agent</h1>
// //           <p className="text-gray-500">Gestion et validation des sinistres</p>
// //         </div>
// //         <div className="flex gap-4">
// //           <button onClick={fetchClaims} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
// //             <RefreshCw size={20} /> Actualiser
// //           </button>
// //           <button 
// //             onClick={logout} 
// //             className="flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition"
// //           >
// //             <LogOut size={20} /> Déconnexion
// //           </button>
// //         </div>
// //       </div>

// //       {/* Tableau des dossiers */}
// //       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left border-collapse">
// //             <thead>
// //               <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
// //                 <th className="p-4 font-semibold">Date</th>
// //                 <th className="p-4 font-semibold">Police / Description</th>
// //                 <th className="p-4 font-semibold">Montant</th>
// //                 <th className="p-4 font-semibold">Preuve</th>
// //                 <th className="p-4 font-semibold">Statut Actuel</th>
// //                 <th className="p-4 font-semibold text-center">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-100">
// //               {loading ? (
// //                 <tr><td colSpan="6" className="p-8 text-center text-gray-500">Chargement...</td></tr>
// //               ) : claims.length === 0 ? (
// //                 <tr><td colSpan="6" className="p-8 text-center text-gray-500">Aucun dossier à traiter.</td></tr>
// //               ) : (
// //                 claims.map((claim) => (
// //                   <tr key={claim.id} className="hover:bg-gray-50 transition">
// //                     <td className="p-4 text-sm text-gray-600">{new Date(claim.incident_date).toLocaleDateString()}</td>
// //                     <td className="p-4">
// //                       <div className="font-medium text-gray-900">{claim.policy_number}</div>
// //                       <div className="text-sm text-gray-500 truncate w-64">{claim.description}</div>
// //                     </td>
// //                     <td className="p-4 font-medium text-gray-900">{claim.claim_amount} €</td>
// //                     <td className="p-4">
// //                       <button 
// //                         // --- CORRECTION MAJEURE ICI : document_path ---
// //                         onClick={() => openDocument(claim.document_path)}
// //                         className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
// //                       >
// //                         <FileText size={16} /> Voir PDF
// //                       </button>
// //                     </td>
// //                     <td className="p-4">
// //                       <span className={`px-3 py-1 rounded-full text-xs font-bold
// //                         ${claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
// //                           claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
// //                           'bg-yellow-100 text-yellow-700'}`}>
// //                         {claim.status}
// //                       </span>
// //                     </td>
// //                     <td className="p-4 flex justify-center gap-2">
// //                       {claim.status === 'ANALYZING' && (
// //                         <>
// //                           <button 
// //                             onClick={() => handleStatusUpdate(claim.id, 'APPROVED')}
// //                             className="bg-green-500 text-white p-2 rounded hover:bg-green-600 tooltip"
// //                             title="Approuver"
// //                           >
// //                             <CheckCircle size={18} />
// //                           </button>
// //                           <button 
// //                             onClick={() => handleStatusUpdate(claim.id, 'REJECTED')}
// //                             className="bg-red-500 text-white p-2 rounded hover:bg-red-600 tooltip"
// //                             title="Rejeter"
// //                           >
// //                             <XCircle size={18} />
// //                           </button>
// //                         </>
// //                       )}
// //                       {claim.status !== 'ANALYZING' && (
// //                         <span className="text-gray-400 text-xs italic">Traité</span>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // import { useState, useEffect, useContext } from 'react';
// // import { AuthContext } from '../../context/AuthContext';
// // import api from '../../api/axios';
// // import { 
// //   CheckCircle, XCircle, FileText, LogOut, RefreshCw, 
// //   ChevronDown, ChevronUp, ShieldAlert, AlertTriangle, 
// //   Car, MapPin, Siren, User, BrainCircuit 
// // } from 'lucide-react';
// // import toast, { Toaster } from 'react-hot-toast';

// // export default function AgentDashboard() {
// //   const { logout } = useContext(AuthContext);
// //   const [claims, setClaims] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [expandedRow, setExpandedRow] = useState(null); // Pour gérer l'ouverture des lignes

// //   // Charger les données
// //   const fetchClaims = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await api.get('/claims');
// //       setClaims(res.data);
// //     } catch (error) {
// //       toast.error("Impossible de charger les dossiers.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchClaims();
// //   }, []);

// //   // Changer le statut
// //   const handleStatusUpdate = async (id, newStatus) => {
// //     try {
// //       await api.put(`/claims/${id}`, { status: newStatus });
// //       toast.success(`Dossier ${newStatus === 'VALIDATED' ? 'Validé' : 'Rejeté'} !`);
// //       fetchClaims();
// //     } catch (error) {
// //       toast.error("Erreur mise à jour.");
// //     }
// //   };

// //   // Ouvrir PDF
// //   const openDocument = (filename) => {
// //     if (!filename) return toast.error("Aucun fichier.");
// //     window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
// //   };

// //   // Basculer l'affichage des détails
// //   const toggleRow = (id) => {
// //     if (expandedRow === id) {
// //       setExpandedRow(null);
// //     } else {
// //       setExpandedRow(id);
// //     }
// //   };

// //   // Helper pour la couleur du Score IA
// //   const getScoreColor = (score) => {
// //     if (!score) return "text-gray-400";
// //     if (score >= 80) return "text-green-600"; // Haute confiance
// //     if (score >= 50) return "text-yellow-600"; // Moyen
// //     return "text-red-600"; // Risque fraude
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 font-sans">
// //       <Toaster position="top-right" />
      
// //       {/* HEADER */}
// //       <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
// //         <div className="flex items-center gap-4">
// //             <div className="bg-blue-600 p-3 rounded-xl text-white">
// //                 <ShieldAlert size={28} />
// //             </div>
// //             <div>
// //                 <h1 className="text-2xl font-bold text-gray-800">Espace Agent</h1>
// //                 <p className="text-gray-500 text-sm">Pilotage des sinistres et Analyse IA</p>
// //             </div>
// //         </div>
// //         <div className="flex gap-3">
// //           <button onClick={fetchClaims} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
// //             <RefreshCw size={18} /> Actualiser
// //           </button>
// //           <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
// //             <LogOut size={18} /> Déconnexion
// //           </button>
// //         </div>
// //       </div>

// //       {/* TABLEAU */}
// //       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left border-collapse">
// //             <thead>
// //               <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 uppercase text-xs tracking-wider font-bold">
// //                 <th className="p-5">Réf. & Date</th>
// //                 <th className="p-5">Assuré</th>
// //                 <th className="p-5">Montant</th>
// //                 <th className="p-5 text-center">Score IA</th>
// //                 <th className="p-5">Statut</th>
// //                 <th className="p-5 text-center">Actions</th>
// //                 <th className="p-5 w-10"></th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-100">
// //               {loading ? (
// //                 <tr><td colSpan="7" className="p-10 text-center text-gray-400">Chargement des données...</td></tr>
// //               ) : claims.length === 0 ? (
// //                 <tr><td colSpan="7" className="p-10 text-center text-gray-400">Aucun dossier en attente.</td></tr>
// //               ) : (
// //                 claims.map((claim) => (
// //                   <>
// //                     {/* LIGNE PRINCIPALE */}
// //                     <tr 
// //                         key={claim.id} 
// //                         className={`hover:bg-blue-50/50 transition cursor-pointer ${expandedRow === claim.id ? 'bg-blue-50/30' : ''}`}
// //                         onClick={() => toggleRow(claim.id)}
// //                     >
// //                       <td className="p-5">
// //                         <div className="font-bold text-gray-900">{claim.policy_number}</div>
// //                         <div className="text-xs text-gray-500">{new Date(claim.incident_date).toLocaleDateString()}</div>
// //                       </td>
// //                       <td className="p-5">
// //                         <div className="flex items-center gap-2">
// //                             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
// //                                 <User size={14}/>
// //                             </div>
// //                             <div>
// //                                 <div className="font-medium text-gray-800">{claim.user?.full_name || "Client Inconnu"}</div>
// //                                 <div className="text-xs text-gray-500">{claim.user?.email}</div>
// //                             </div>
// //                         </div>
// //                       </td>
// //                       <td className="p-5 font-bold text-slate-700">{claim.claim_amount} €</td>
                      
// //                       {/* SCORE IA */}
// //                       <td className="p-5 text-center">
// //                         {claim.ai_score ? (
// //                             <div className="flex flex-col items-center">
// //                                 <span className={`text-lg font-black ${getScoreColor(claim.ai_score)}`}>
// //                                     {Number(claim.ai_score).toFixed(2)}                                </span>
// //                                 <span className="text-[10px] uppercase font-bold text-gray-400">Confiance</span>
// //                             </div>
// //                         ) : (
// //                             <span className="text-xs text-gray-400">En attente</span>
// //                         )}
// //                       </td>

// //                       <td className="p-5">
// //                         <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1
// //                           ${claim.status === 'VALIDATED' ? 'bg-green-100 text-green-700' : 
// //                             claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
// //                             'bg-amber-100 text-amber-700'}`}>
// //                           {claim.status === 'VALIDATED' && <CheckCircle size={12}/>}
// //                           {claim.status === 'REJECTED' && <XCircle size={12}/>}
// //                           {claim.status}
// //                         </span>
// //                       </td>

// //                       <td className="p-5">
// //                          <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
// //                             {claim.status === 'ANALYZING' || claim.status === 'IN_PROGRESS' ? (
// //                                 <>
// //                                     <button onClick={() => handleStatusUpdate(claim.id, 'VALIDATED')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95" title="Valider">
// //                                         <CheckCircle size={18} />
// //                                     </button>
// //                                     <button onClick={() => handleStatusUpdate(claim.id, 'REJECTED')} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95" title="Rejeter">
// //                                         <XCircle size={18} />
// //                                     </button>
// //                                 </>
// //                             ) : (
// //                                 <span className="text-gray-400 text-xs italic">Clôturé</span>
// //                             )}
// //                          </div>
// //                       </td>

// //                       <td className="p-5 text-gray-400">
// //                         {expandedRow === claim.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
// //                       </td>
// //                     </tr>

// //                     {/* LIGNE DÉTAILS (EXPANDABLE) */}
// //                     {expandedRow === claim.id && (
// //                         <tr className="bg-slate-50 border-b border-gray-100 animation-fade-in">
// //                             <td colSpan="7" className="p-6">
// //                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
// //                                     {/* BLOC 1 : ANALYSE IA */}
// //                                     <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
// //                                         <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-10 -mr-5 -mt-5"></div>
// //                                         <h3 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
// //                                             <BrainCircuit size={18}/> Analyse IA
// //                                         </h3>
// //                                         <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
// //                                             "{claim.ai_analysis || "Aucune analyse détaillée disponible pour le moment."}"
// //                                         </p>
// //                                         <div className="flex gap-2 mt-auto">
// //                                             <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-semibold">
// //                                                 Modèle v3.1
// //                                             </span>
// //                                         </div>
// //                                     </div>

// //                                     {/* BLOC 2 : DÉTAILS SINISTRE */}
// //                                     <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
// //                                         <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
// //                                             <Car size={18} className="text-gray-500"/> Détails Techniques
// //                                         </h3>
// //                                         <div className="space-y-3">
// //                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
// //                                                 <span className="text-gray-500">Type</span>
// //                                                 <span className="font-medium text-gray-800">{claim.incident_type || "N/A"}</span>
// //                                             </div>
// //                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
// //                                                 <span className="text-gray-500">Choc</span>
// //                                                 <span className="font-medium text-gray-800">{claim.collision_type || "N/A"}</span>
// //                                             </div>
// //                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
// //                                                 <span className="text-gray-500">Sévérité</span>
// //                                                 <span className={`font-medium ${claim.incident_severity === 'Total Loss' ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
// //                                                     {claim.incident_severity || "N/A"}
// //                                                 </span>
// //                                             </div>
// //                                             <div className="flex justify-between text-sm">
// //                                                 <span className="text-gray-500 flex items-center gap-1"><Siren size={12}/> Autorités</span>
// //                                                 <span className="font-medium text-gray-800">{claim.authorities_contacted || "None"}</span>
// //                                             </div>
// //                                         </div>
// //                                     </div>

// //                                     {/* BLOC 3 : DESCRIPTION & FICHIER */}
// //                                     <div className="space-y-4">
// //                                         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
// //                                             <h3 className="text-gray-800 font-bold mb-2 text-sm">Description du client</h3>
// //                                             <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg border border-gray-100">
// //                                                 "{claim.description}"
// //                                             </p>
// //                                         </div>
                                        
// //                                         <button 
// //                                             onClick={(e) => { e.stopPropagation(); openDocument(claim.document_path); }}
// //                                             className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white py-3 rounded-xl transition-colors shadow-lg shadow-gray-200"
// //                                         >
// //                                             <FileText size={18} /> 
// //                                             Voir le Justificatif (PDF/Img)
// //                                         </button>
// //                                     </div>

// //                                 </div>
// //                             </td>
// //                         </tr>
// //                     )}
// //                   </>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // import { useState, useEffect, useContext } from 'react';
// // import { AuthContext } from '../../context/AuthContext';
// // import api from '../../api/axios';
// // import { 
// //   CheckCircle, XCircle, FileText, LogOut, RefreshCw, 
// //   ChevronDown, ChevronUp, ShieldAlert, 
// //   Car, Siren, User, BrainCircuit 
// // } from 'lucide-react';
// // import toast, { Toaster } from 'react-hot-toast';

// // export default function AgentDashboard() {
// //   const { logout } = useContext(AuthContext);
// //   const [claims, setClaims] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [expandedRow, setExpandedRow] = useState(null);

// //   // Charger les données
// //   const fetchClaims = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await api.get('/claims');
// //       // DEBUG : Affiche les données dans la console du navigateur (F12)
// //       console.log("Données reçues du backend :", res.data);
// //       setClaims(res.data);
// //     } catch (error) {
// //       toast.error("Impossible de charger les dossiers.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchClaims();
// //   }, []);

// //   // Changer le statut
// //   const handleStatusUpdate = async (id, newStatus) => {
// //     try {
// //       await api.put(`/claims/${id}`, { status: newStatus });
// //       toast.success(`Dossier ${newStatus === 'VALIDATED' ? 'Validé' : 'Rejeté'} !`);
// //       fetchClaims();
// //     } catch (error) {
// //       toast.error("Erreur mise à jour.");
// //     }
// //   };

// //   // Ouvrir PDF
// //   const openDocument = (filename) => {
// //     if (!filename) return toast.error("Aucun fichier.");
// //     // Assurez-vous que le port correspond à votre backend (ex: 5000 ou 3000)
// //     window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
// //   };

// //   const toggleRow = (id) => {
// //     if (expandedRow === id) setExpandedRow(null);
// //     else setExpandedRow(id);
// //   };

// //   // --- CORRECTION 1 : Logique couleur adaptée aux décimales (0.0 à 1.0) ---
// //   const getScoreColor = (score) => {
// //     if (score === null || score === undefined) return "text-gray-400";
// //     // Score bas (< 0.2) = Sûr = Vert
// //     if (score <= 0.2) return "text-green-600"; 
// //     // Score haut (> 0.8) = Fraude probable = Rouge
// //     if (score >= 0.8) return "text-red-600"; 
// //     // Entre les deux = Attention = Jaune
// //     return "text-yellow-600"; 
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 font-sans">
// //       <Toaster position="top-right" />
      
// //       {/* HEADER */}
// //       <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
// //         <div className="flex items-center gap-4">
// //             <div className="bg-blue-600 p-3 rounded-xl text-white">
// //                 <ShieldAlert size={28} />
// //             </div>
// //             <div>
// //                 <h1 className="text-2xl font-bold text-gray-800">Espace Agent</h1>
// //                 <p className="text-gray-500 text-sm">Pilotage des sinistres et Analyse IA</p>
// //             </div>
// //         </div>
// //         <div className="flex gap-3">
// //           <button onClick={fetchClaims} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
// //             <RefreshCw size={18} /> Actualiser
// //           </button>
// //           <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
// //             <LogOut size={18} /> Déconnexion
// //           </button>
// //         </div>
// //       </div>

// //       {/* TABLEAU */}
// //       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left border-collapse">
// //             <thead>
// //               <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 uppercase text-xs tracking-wider font-bold">
// //                 <th className="p-5">Réf. & Date</th>
// //                 <th className="p-5">Assuré</th>
// //                 <th className="p-5">Montant</th>
// //                 <th className="p-5 text-center">Score IA</th>
// //                 <th className="p-5">Statut</th>
// //                 <th className="p-5 text-center">Actions</th>
// //                 <th className="p-5 w-10"></th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-100">
// //               {loading ? (
// //                 <tr><td colSpan="7" className="p-10 text-center text-gray-400">Chargement des données...</td></tr>
// //               ) : claims.length === 0 ? (
// //                 <tr><td colSpan="7" className="p-10 text-center text-gray-400">Aucun dossier en attente.</td></tr>
// //               ) : (
// //                 claims.map((claim) => (
// //                   <>
// //                     {/* LIGNE PRINCIPALE */}
// //                     <tr 
// //                         key={claim.id} 
// //                         className={`hover:bg-blue-50/50 transition cursor-pointer ${expandedRow === claim.id ? 'bg-blue-50/30' : ''}`}
// //                         onClick={() => toggleRow(claim.id)}
// //                     >
// //                       <td className="p-5">
// //                         <div className="font-bold text-gray-900">{claim.policy_number}</div>
// //                         <div className="text-xs text-gray-500">{new Date(claim.incident_date).toLocaleDateString()}</div>
// //                       </td>
// //                       <td className="p-5">
// //                         <div className="flex items-center gap-2">
// //                             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
// //                                 <User size={14}/>
// //                             </div>
// //                             <div>
// //                                 <div className="font-medium text-gray-800">{claim.user?.full_name || "Client Inconnu"}</div>
// //                                 <div className="text-xs text-gray-500">{claim.user?.email}</div>
// //                             </div>
// //                         </div>
// //                       </td>
// //                       <td className="p-5 font-bold text-slate-700">{claim.claim_amount} €</td>
                      
// //                       {/* SCORE IA */}
// //                       <td className="p-5 text-center">
// //                         {claim.ai_score !== null ? (
// //                             <div className="flex flex-col items-center">
// //                                 <span className={`text-lg font-black ${getScoreColor(claim.ai_score)}`}>
// //                                     {Number(claim.ai_score).toFixed(2)}
// //                                 </span>
// //                                 <span className="text-[10px] uppercase font-bold text-gray-400">Risque</span>
// //                             </div>
// //                         ) : (
// //                             <span className="text-xs text-gray-400">En attente</span>
// //                         )}
// //                       </td>

// //                       <td className="p-5">
// //                         <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1
// //                           ${claim.status === 'VALIDATED' ? 'bg-green-100 text-green-700' : 
// //                             claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
// //                             'bg-amber-100 text-amber-700'}`}>
// //                           {claim.status === 'VALIDATED' && <CheckCircle size={12}/>}
// //                           {claim.status === 'REJECTED' && <XCircle size={12}/>}
// //                           {claim.status === 'ANALYZING' && <BrainCircuit size={12}/>}
// //                           {claim.status}
// //                         </span>
// //                       </td>

// //                       {/* --- CORRECTION 2 : Logique d'affichage des boutons --- */}
// //                       <td className="p-5">
// //                           <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
// //                             {/* On affiche les boutons SEULEMENT si le statut est ANALYZING */}
// //                             {claim.status === 'ANALYZING' ? (
// //                                 <>
// //                                     <button onClick={() => handleStatusUpdate(claim.id, 'VALIDATED')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95" title="Valider">
// //                                         <CheckCircle size={18} />
// //                                     </button>
// //                                     <button onClick={() => handleStatusUpdate(claim.id, 'REJECTED')} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95" title="Rejeter">
// //                                         <XCircle size={18} />
// //                                     </button>
// //                                 </>
// //                             ) : (
// //                                 /* Sinon : RIEN (case vide) */
// //                                 null
// //                             )}
// //                           </div>
// //                       </td>

// //                       <td className="p-5 text-gray-400">
// //                         {expandedRow === claim.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
// //                       </td>
// //                     </tr>

// //                     {/* LIGNE DÉTAILS (EXPANDABLE) */}
// //                     {expandedRow === claim.id && (
// //                         <tr className="bg-slate-50 border-b border-gray-100 animation-fade-in">
// //                             <td colSpan="7" className="p-6">
// //                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
// //                                     {/* BLOC 1 : ANALYSE IA - CORRECTION ICI */}
// //                                     <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
// //                                         <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-10 -mr-5 -mt-5"></div>
// //                                         <h3 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
// //                                             <BrainCircuit size={18}/> Analyse IA
// //                                         </h3>
// //                                         <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
// //                                             {/* On affiche ai_analysis OU explanation OU le message par défaut */}
// //                                             "{claim.ai_analysis || claim.explanation || "Aucune analyse détaillée disponible."}"
// //                                         </p>
// //                                     </div>

// //                                     {/* BLOC 2 : DÉTAILS SINISTRE (Noms de champs DB vérifiés) */}
// //                                     <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
// //                                         <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
// //                                             <Car size={18} className="text-gray-500"/> Détails Techniques
// //                                         </h3>
// //                                         <div className="space-y-3">
// //                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
// //                                                 <span className="text-gray-500">Type</span>
// //                                                 <span className="font-medium text-gray-800">{claim.incident_type || "N/A"}</span>
// //                                             </div>
// //                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
// //                                                 <span className="text-gray-500">Choc</span>
// //                                                 <span className="font-medium text-gray-800">{claim.collision_type || "N/A"}</span>
// //                                             </div>
// //                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
// //                                                 <span className="text-gray-500">Sévérité</span>
// //                                                 <span className={`font-medium ${claim.incident_severity === 'Total Loss' ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
// //                                                     {claim.incident_severity || "N/A"}
// //                                                 </span>
// //                                             </div>
// //                                             <div className="flex justify-between text-sm">
// //                                                 <span className="text-gray-500 flex items-center gap-1"><Siren size={12}/> Autorités</span>
// //                                                 <span className="font-medium text-gray-800">{claim.authorities_contacted || "None"}</span>
// //                                             </div>
// //                                         </div>
// //                                     </div>

// //                                     {/* BLOC 3 : DESCRIPTION & FICHIER */}
// //                                     <div className="space-y-4">
// //                                         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
// //                                             <h3 className="text-gray-800 font-bold mb-2 text-sm">Description du client</h3>
// //                                             <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg border border-gray-100">
// //                                                 "{claim.description}"
// //                                             </p>
// //                                         </div>
                                        
// //                                         <button 
// //                                             onClick={(e) => { e.stopPropagation(); openDocument(claim.document_path); }}
// //                                             className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white py-3 rounded-xl transition-colors shadow-lg shadow-gray-200"
// //                                         >
// //                                             <FileText size={18} /> 
// //                                             Voir le Justificatif (PDF/Img)
// //                                         </button>
// //                                     </div>

// //                                 </div>
// //                             </td>
// //                         </tr>
// //                     )}
// //                   </>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';
// import api from '../../api/axios';
// import { 
//   CheckCircle, XCircle, FileText, LogOut, RefreshCw, 
//   ChevronDown, ChevronUp, ShieldAlert, 
//   Car, Siren, User, BrainCircuit, Filter // Ajout de l'icône Filter si besoin, sinon optionnel
// } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// export default function AgentDashboard() {
//   const { logout } = useContext(AuthContext);
//   const [claims, setClaims] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedRow, setExpandedRow] = useState(null);
  
//   // --- NOUVEAU : État pour le filtre ---
//   const [filter, setFilter] = useState('ALL');

//   // Charger les données
//   const fetchClaims = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/claims');
//       // DEBUG : Affiche les données dans la console du navigateur (F12)
//       console.log("Données reçues du backend :", res.data);
//       setClaims(res.data);
//     } catch (error) {
//       toast.error("Impossible de charger les dossiers.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClaims();
//   }, []);

//   // Changer le statut
//   const handleStatusUpdate = async (id, newStatus) => {
//     try {
//       await api.put(`/claims/${id}`, { status: newStatus });
//       toast.success(`Dossier ${newStatus === 'VALIDATED' ? 'Validé' : 'Rejeté'} !`);
//       fetchClaims();
//     } catch (error) {
//       toast.error("Erreur mise à jour.");
//     }
//   };

//   // Ouvrir PDF
//   const openDocument = (filename) => {
//     if (!filename) return toast.error("Aucun fichier.");
//     // Assurez-vous que le port correspond à votre backend (ex: 5000 ou 3000)
//     window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
//   };

//   const toggleRow = (id) => {
//     if (expandedRow === id) setExpandedRow(null);
//     else setExpandedRow(id);
//   };

//   // --- CORRECTION 1 : Logique couleur adaptée aux décimales (0.0 à 1.0) ---
//   const getScoreColor = (score) => {
//     if (score === null || score === undefined) return "text-gray-400";
//     // Score bas (< 0.2) = Sûr = Vert
//     if (score <= 0.2) return "text-green-600"; 
//     // Score haut (> 0.8) = Fraude probable = Rouge
//     if (score >= 0.8) return "text-red-600"; 
//     // Entre les deux = Attention = Jaune
//     return "text-yellow-600"; 
//   };

//   // --- NOUVEAU : Calcul des données filtrées ---
//   const filteredClaims = filter === 'ALL' 
//     ? claims 
//     : claims.filter(claim => claim.status === filter);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <Toaster position="top-right" />
      
//       {/* HEADER */}
//       <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//         <div className="flex items-center gap-4">
//             <div className="bg-blue-600 p-3 rounded-xl text-white">
//                 <ShieldAlert size={28} />
//             </div>
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Espace Agent</h1>
//                 <p className="text-gray-500 text-sm">Pilotage des sinistres et Analyse IA</p>
//             </div>
//         </div>
//         <div className="flex gap-3">
//           {/* --- NOUVEAU : Sélecteur de filtre --- */}
//           <div className="relative">
//             <select 
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="appearance-none bg-white border border-gray-200 text-gray-700 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer h-full font-medium text-sm"
//             >
//                 <option value="ALL">Tous les statuts</option>
//                 <option value="ANALYZING">En cours (Analyzing)</option>
//                 <option value="VALIDATED">Validés</option>
//                 <option value="REJECTED">Rejetés</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
//                 <Filter size={14} />
//             </div>
//           </div>

//           <button onClick={fetchClaims} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
//             <RefreshCw size={18} /> Actualiser
//           </button>
//           <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
//             <LogOut size={18} /> Déconnexion
//           </button>
//         </div>
//       </div>

//       {/* TABLEAU */}
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 uppercase text-xs tracking-wider font-bold">
//                 <th className="p-5">Réf. & Date</th>
//                 <th className="p-5">Assuré</th>
//                 <th className="p-5">Montant</th>
//                 <th className="p-5 text-center">Score IA</th>
//                 <th className="p-5">Statut</th>
//                 <th className="p-5 text-center">Actions</th>
//                 <th className="p-5 w-10"></th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr><td colSpan="7" className="p-10 text-center text-gray-400">Chargement des données...</td></tr>
//               ) : filteredClaims.length === 0 ? (
//                 <tr><td colSpan="7" className="p-10 text-center text-gray-400">Aucun dossier trouvé pour ce filtre.</td></tr>
//               ) : (
//                 // --- MODIFIÉ : On boucle sur filteredClaims au lieu de claims ---
//                 filteredClaims.map((claim) => (
//                   <>
//                     {/* LIGNE PRINCIPALE */}
//                     <tr 
//                         key={claim.id} 
//                         className={`hover:bg-blue-50/50 transition cursor-pointer ${expandedRow === claim.id ? 'bg-blue-50/30' : ''}`}
//                         onClick={() => toggleRow(claim.id)}
//                     >
//                       <td className="p-5">
//                         <div className="font-bold text-gray-900">{claim.policy_number}</div>
//                         <div className="text-xs text-gray-500">{new Date(claim.incident_date).toLocaleDateString()}</div>
//                       </td>
//                       <td className="p-5">
//                         <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
//                                 <User size={14}/>
//                             </div>
//                             <div>
//                                 <div className="font-medium text-gray-800">{claim.user?.full_name || "Client Inconnu"}</div>
//                                 <div className="text-xs text-gray-500">{claim.user?.email}</div>
//                             </div>
//                         </div>
//                       </td>
//                       <td className="p-5 font-bold text-slate-700">{claim.claim_amount} €</td>
                      
//                       {/* SCORE IA */}
//                       <td className="p-5 text-center">
//                         {claim.ai_score !== null ? (
//                             <div className="flex flex-col items-center">
//                                 <span className={`text-lg font-black ${getScoreColor(claim.ai_score)}`}>
//                                     {Number(claim.ai_score).toFixed(2)}
//                                 </span>
//                                 <span className="text-[10px] uppercase font-bold text-gray-400">Risque</span>
//                             </div>
//                         ) : (
//                             <span className="text-xs text-gray-400">En attente</span>
//                         )}
//                       </td>

//                       <td className="p-5">
//                         <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1
//                           ${claim.status === 'VALIDATED' ? 'bg-green-100 text-green-700' : 
//                             claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
//                             'bg-amber-100 text-amber-700'}`}>
//                           {claim.status === 'VALIDATED' && <CheckCircle size={12}/>}
//                           {claim.status === 'REJECTED' && <XCircle size={12}/>}
//                           {claim.status === 'ANALYZING' && <BrainCircuit size={12}/>}
//                           {claim.status}
//                         </span>
//                       </td>

//                       {/* --- CORRECTION 2 : Logique d'affichage des boutons --- */}
//                       <td className="p-5">
//                           <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
//                             {/* On affiche les boutons SEULEMENT si le statut est ANALYZING */}
//                             {claim.status === 'ANALYZING' ? (
//                                 <>
//                                     <button onClick={() => handleStatusUpdate(claim.id, 'VALIDATED')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95" title="Valider">
//                                         <CheckCircle size={18} />
//                                     </button>
//                                     <button onClick={() => handleStatusUpdate(claim.id, 'REJECTED')} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95" title="Rejeter">
//                                         <XCircle size={18} />
//                                     </button>
//                                 </>
//                             ) : (
//                                 /* Sinon : RIEN (case vide) */
//                                 null
//                             )}
//                           </div>
//                       </td>

//                       <td className="p-5 text-gray-400">
//                         {expandedRow === claim.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                       </td>
//                     </tr>

//                     {/* LIGNE DÉTAILS (EXPANDABLE) */}
//                     {expandedRow === claim.id && (
//                         <tr className="bg-slate-50 border-b border-gray-100 animation-fade-in">
//                             <td colSpan="7" className="p-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
//                                     {/* BLOC 1 : ANALYSE IA - CORRECTION ICI */}
//                                     <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
//                                         <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-10 -mr-5 -mt-5"></div>
//                                         <h3 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
//                                             <BrainCircuit size={18}/> Analyse IA
//                                         </h3>
//                                         <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
//                                             {/* On affiche ai_analysis OU explanation OU le message par défaut */}
//                                             "{claim.ai_analysis || claim.explanation || "Aucune analyse détaillée disponible."}"
//                                         </p>
//                                     </div>

//                                     {/* BLOC 2 : DÉTAILS SINISTRE (Noms de champs DB vérifiés) */}
//                                     <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                                         <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
//                                             <Car size={18} className="text-gray-500"/> Détails Techniques
//                                         </h3>
//                                         <div className="space-y-3">
//                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
//                                                 <span className="text-gray-500">Type</span>
//                                                 <span className="font-medium text-gray-800">{claim.incident_type || "N/A"}</span>
//                                             </div>
//                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
//                                                 <span className="text-gray-500">Choc</span>
//                                                 <span className="font-medium text-gray-800">{claim.collision_type || "N/A"}</span>
//                                             </div>
//                                             <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
//                                                 <span className="text-gray-500">Sévérité</span>
//                                                 <span className={`font-medium ${claim.incident_severity === 'Total Loss' ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
//                                                     {claim.incident_severity || "N/A"}
//                                                 </span>
//                                             </div>
//                                             <div className="flex justify-between text-sm">
//                                                 <span className="text-gray-500 flex items-center gap-1"><Siren size={12}/> Autorités</span>
//                                                 <span className="font-medium text-gray-800">{claim.authorities_contacted || "None"}</span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* BLOC 3 : DESCRIPTION & FICHIER */}
//                                     <div className="space-y-4">
//                                         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                                             <h3 className="text-gray-800 font-bold mb-2 text-sm">Description du client</h3>
//                                             <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg border border-gray-100">
//                                                 "{claim.description}"
//                                             </p>
//                                         </div>
                                        
//                                         <button 
//                                             onClick={(e) => { e.stopPropagation(); openDocument(claim.document_path); }}
//                                             className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white py-3 rounded-xl transition-colors shadow-lg shadow-gray-200"
//                                         >
//                                             <FileText size={18} /> 
//                                             Voir le Justificatif (PDF/Img)
//                                         </button>
//                                     </div>

//                                 </div>
//                             </td>
//                         </tr>
//                     )}
//                   </>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import { 
  CheckCircle, XCircle, FileText, LogOut, RefreshCw, 
  ChevronDown, ChevronUp, ShieldAlert, 
  Car, Siren, User, BrainCircuit, Filter, Edit3 // Ajout de Edit3
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AgentDashboard() {
  const { logout } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [filter, setFilter] = useState('ALL');

  // --- NOUVEAU : États pour la modale de rejet ---
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await api.get('/claims');
      setClaims(res.data);
    } catch (error) {
      toast.error("Impossible de charger les dossiers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // --- MODIFIÉ : Fonction générique de mise à jour ---
  // Accepte maintenant un argument optionnel "customAnalysis"
  const handleStatusUpdate = async (id, newStatus, customAnalysis = null) => {
    try {
      const payload = { status: newStatus };
      
      // Si on a une nouvelle analyse (cas du rejet édité), on l'ajoute
      if (customAnalysis) {
        payload.ai_analysis = customAnalysis;
      }

      await api.put(`/claims/${id}`, payload);
      
      toast.success(`Dossier ${newStatus === 'VALIDATED' ? 'Validé' : 'Rejeté'} !`);
      
      // Fermer la modale si elle est ouverte
      setRejectModalOpen(false);
      setSelectedClaim(null);
      
      fetchClaims();
    } catch (error) {
      toast.error("Erreur mise à jour.");
    }
  };

  // --- NOUVEAU : Ouvre la modale de rejet ---
  const openRejectModal = (claim) => {
    setSelectedClaim(claim);
    // On pré-remplit avec l'analyse actuelle pour ne pas tout réécrire
    setRejectReason(claim.ai_analysis || "Le dossier présente des incohérences..."); 
    setRejectModalOpen(true);
  };

  const openDocument = (filename) => {
    if (!filename) return toast.error("Aucun fichier.");
    window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
  };

  const toggleRow = (id) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return "text-gray-400";
    if (score <= 0.2) return "text-green-600"; 
    if (score >= 0.8) return "text-red-600"; 
    return "text-yellow-600"; 
  };

  const filteredClaims = filter === 'ALL' 
    ? claims 
    : claims.filter(claim => claim.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans relative">
      <Toaster position="top-right" />
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white">
                <ShieldAlert size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Espace Agent</h1>
                <p className="text-gray-500 text-sm">Pilotage des sinistres et Analyse IA</p>
            </div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer h-full font-medium text-sm"
            >
                <option value="ALL">Tous les statuts</option>
                <option value="ANALYZING">En cours (Analyzing)</option>
                <option value="VALIDATED">Validés</option>
                <option value="REJECTED">Rejetés</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <Filter size={14} />
            </div>
          </div>

          <button onClick={fetchClaims} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
            <RefreshCw size={18} /> Actualiser
          </button>
          <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 uppercase text-xs tracking-wider font-bold">
                <th className="p-5">Réf. & Date</th>
                <th className="p-5">Assuré</th>
                <th className="p-5">Montant</th>
                <th className="p-5 text-center">Score IA</th>
                <th className="p-5">Statut</th>
                <th className="p-5 text-center">Actions</th>
                <th className="p-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400">Chargement des données...</td></tr>
              ) : filteredClaims.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400">Aucun dossier trouvé pour ce filtre.</td></tr>
              ) : (
                filteredClaims.map((claim) => (
                  <>
                    <tr 
                        key={claim.id} 
                        className={`hover:bg-blue-50/50 transition cursor-pointer ${expandedRow === claim.id ? 'bg-blue-50/30' : ''}`}
                        onClick={() => toggleRow(claim.id)}
                    >
                      <td className="p-5">
                        <div className="font-bold text-gray-900">{claim.policy_number}</div>
                        <div className="text-xs text-gray-500">{new Date(claim.incident_date).toLocaleDateString()}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                <User size={14}/>
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">{claim.user?.full_name || "Client Inconnu"}</div>
                                <div className="text-xs text-gray-500">{claim.user?.email}</div>
                            </div>
                        </div>
                      </td>
                      <td className="p-5 font-bold text-slate-700">{claim.claim_amount} €</td>
                      
                      <td className="p-5 text-center">
                        {claim.ai_score !== null ? (
                            <div className="flex flex-col items-center">
                                <span className={`text-lg font-black ${getScoreColor(claim.ai_score)}`}>
                                    {Number(claim.ai_score).toFixed(2)}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Risque</span>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400">En attente</span>
                        )}
                      </td>

                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1
                          ${claim.status === 'VALIDATED' ? 'bg-green-100 text-green-700' : 
                            claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                            'bg-amber-100 text-amber-700'}`}>
                          {claim.status === 'VALIDATED' && <CheckCircle size={12}/>}
                          {claim.status === 'REJECTED' && <XCircle size={12}/>}
                          {claim.status === 'ANALYZING' && <BrainCircuit size={12}/>}
                          {claim.status}
                        </span>
                      </td>

                      <td className="p-5">
                          <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {claim.status === 'ANALYZING' ? (
                                <>
                                    {/* BOUTON VALIDER : Direct */}
                                    <button 
                                        onClick={() => handleStatusUpdate(claim.id, 'VALIDATED')} 
                                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95" 
                                        title="Valider"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                    
                                    {/* BOUTON REJETER : Ouvre la modale */}
                                    <button 
                                        onClick={() => openRejectModal(claim)} 
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95" 
                                        title="Rejeter avec motif"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                </>
                            ) : null}
                          </div>
                      </td>

                      <td className="p-5 text-gray-400">
                        {expandedRow === claim.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </td>
                    </tr>

                    {expandedRow === claim.id && (
                        <tr className="bg-slate-50 border-b border-gray-100 animation-fade-in">
                            <td colSpan="7" className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-10 -mr-5 -mt-5"></div>
                                        <h3 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
                                            <BrainCircuit size={18}/> Analyse IA
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
                                            "{claim.ai_analysis || claim.explanation || "Aucune analyse détaillée disponible."}"
                                        </p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
                                            <Car size={18} className="text-gray-500"/> Détails Techniques
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                                <span className="text-gray-500">Type</span>
                                                <span className="font-medium text-gray-800">{claim.incident_type || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                                <span className="text-gray-500">Choc</span>
                                                <span className="font-medium text-gray-800">{claim.collision_type || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                                <span className="text-gray-500">Sévérité</span>
                                                <span className={`font-medium ${claim.incident_severity === 'Total Loss' ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
                                                    {claim.incident_severity || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 flex items-center gap-1"><Siren size={12}/> Autorités</span>
                                                <span className="font-medium text-gray-800">{claim.authorities_contacted || "None"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                            <h3 className="text-gray-800 font-bold mb-2 text-sm">Description du client</h3>
                                            <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                "{claim.description}"
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); openDocument(claim.document_path); }}
                                            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white py-3 rounded-xl transition-colors shadow-lg shadow-gray-200"
                                        >
                                            <FileText size={18} /> 
                                            Voir le Justificatif (PDF/Img)
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALE DE REJET (POPUP) --- */}
      {isRejectModalOpen && selectedClaim && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
                {/* Header Modale */}
                <div className="bg-red-50 p-5 border-b border-red-100 flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-900">Confirmer le Rejet</h3>
                        <p className="text-sm text-red-600">Dossier n° {selectedClaim.policy_number}</p>
                    </div>
                </div>

                {/* Corps Modale */}
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motif du rejet (Visible par le client)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        L'IA a suggéré le texte ci-dessous. Modifiez-le pour qu'il soit clair et justifié.
                    </p>
                    <textarea 
                        className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-gray-800 leading-relaxed shadow-inner"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-100">
                    <button 
                        onClick={() => setRejectModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={() => handleStatusUpdate(selectedClaim.id, 'REJECTED', rejectReason)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium shadow-md transition-transform active:scale-95 flex items-center gap-2"
                    >
                        <XCircle size={16} /> Rejeter définitivement
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}