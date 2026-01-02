// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../api/axios';
// import { 
//   PlusCircle, FileText, Calendar, Euro, 
//   ChevronRight, Search, Filter, X 
// } from 'lucide-react';

// export default function ClientDashboard() {
//   const [claims, setClaims] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- NOUVEAUX ÉTATS POUR LES FILTRES ---
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'PENDING', 'APPROVED', 'REJECTED'
//   const [showFilterMenu, setShowFilterMenu] = useState(false); // Pour afficher/cacher le menu filtres

//   // Récupérer les dossiers depuis le backend
//   useEffect(() => {
//     const fetchClaims = async () => {
//       try {
//         const res = await api.get('/claims');
//         setClaims(res.data);
//       } catch (error) {
//         console.error("Erreur chargement dossiers", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchClaims();
//   }, []);

//   // --- LOGIQUE DE FILTRAGE ---
//   const filteredClaims = claims.filter(claim => {
//     // 1. Filtre par texte (Description ou Montant)
//     const matchesSearch = 
//         claim.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         claim.claim_amount?.toString().includes(searchTerm);

//     // 2. Filtre par statut
//     const matchesStatus = statusFilter === 'ALL' || claim.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   // Styles utilitaires
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
//       case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
//       case 'PENDING': 
//       default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//     }
//   };

//   const formatStatus = (status) => {
//     switch (status) {
//       case 'APPROVED': return 'Validé';
//       case 'REJECTED': return 'Refusé';
//       case 'PENDING': return 'En attente';
//       default: return status;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      
//       <div className="max-w-6xl mx-auto space-y-8">
        
//         {/* EN-TÊTE */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-800">Mes Sinistres</h1>
//             <p className="text-slate-500 mt-1">Gérez et suivez l'état de vos déclarations</p>
//           </div>
          
//           <Link 
//             to="/client/new" 
//             className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
//           >
//             <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" /> 
//             <span>Déclarer un sinistre</span>
//           </Link>
//         </div>

//         {/* STATS RAPIDES */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                 <span className="text-gray-400 text-sm font-medium uppercase">Total Dossiers</span>
//                 <p className="text-3xl font-bold text-slate-800 mt-1">{claims.length}</p>
//             </div>
//              {/* Vous pouvez ajouter d'autres stats ici dynamiquement si besoin */}
//         </div>

//         {/* LISTE DES DOSSIERS */}
//         <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
          
//           {/* --- BARRE D'OUTILS ET FILTRES --- */}
//           <div className="border-b border-gray-100">
//               <div className="p-6 flex items-center gap-4">
//                 {/* Champ Recherche */}
//                 <div className="relative flex-1 max-w-md">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input 
//                         type="text" 
//                         placeholder="Rechercher (description, montant)..." 
//                         className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-blue-100 text-sm transition-all"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)} 
//                     />
//                     {searchTerm && (
//                         <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                             <X size={14}/>
//                         </button>
//                     )}
//                 </div>

//                 {/* Bouton Toggle Filtres */}
//                 <button 
//                     onClick={() => setShowFilterMenu(!showFilterMenu)}
//                     className={`p-2 rounded-lg transition-colors border ${showFilterMenu ? 'bg-blue-50 text-blue-600 border-blue-100' : 'hover:bg-gray-50 text-gray-500 border-transparent'}`}
//                 >
//                     <Filter size={20}/>
//                 </button>
//               </div>

//               {/* Menu des Filtres (Affichage conditionnel) */}
//               {showFilterMenu && (
//                   <div className="px-6 pb-4 flex gap-2 overflow-x-auto">
//                       {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
//                           <button
//                               key={status}
//                               onClick={() => setStatusFilter(status)}
//                               className={`
//                                   px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
//                                   ${statusFilter === status 
//                                       ? 'bg-slate-800 text-white shadow-md' 
//                                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
//                               `}
//                           >
//                               {status === 'ALL' ? 'Tous' : formatStatus(status)}
//                           </button>
//                       ))}
//                   </div>
//               )}
//           </div>

//           {loading ? (
//             <div className="p-10 text-center text-gray-400 animate-pulse">Chargement des données...</div>
//           ) : filteredClaims.length === 0 ? (
            
//             // --- ETAT VIDE (Recherche sans résultat OU Pas de données du tout) ---
//             <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
//               <div className="bg-gray-50 p-6 rounded-full mb-4">
//                 {searchTerm || statusFilter !== 'ALL' ? (
//                      <Search size={48} className="text-gray-300" />
//                 ) : (
//                      <FileText size={48} className="text-blue-200" />
//                 )}
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2">
//                   {searchTerm || statusFilter !== 'ALL' ? 'Aucun résultat' : 'Aucun dossier'}
//               </h3>
//               <p className="text-gray-500 max-w-md mb-6">
//                   {searchTerm || statusFilter !== 'ALL' 
//                     ? "Essayez de modifier vos filtres ou votre recherche."
//                     : "Vous n'avez pas encore déclaré de sinistre."}
//               </p>
//               {!(searchTerm || statusFilter !== 'ALL') && (
//                   <Link to="/client/new" className="text-blue-600 font-semibold hover:underline">Commencer une déclaration</Link>
//               )}
//             </div>

//           ) : (
//             // --- GRILLE DES ITEMS FILTRÉS ---
//             <div className="divide-y divide-gray-50">
//               {filteredClaims.map((claim) => (
//                 <div 
//                   key={claim.id} 
//                   className="group p-6 hover:bg-blue-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
//                 >
                  
//                   {/* Info Principale */}
//                   <div className="flex items-start gap-4">
//                     <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mt-1">
//                         <FileText size={24} />
//                     </div>
//                     <div>
//                         <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">
//                             {claim.description ? claim.description.substring(0, 50) + (claim.description.length > 50 ? '...' : '') : 'Sinistre sans titre'}
//                         </h3>
//                         <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
//                             <span className="flex items-center gap-1"><Calendar size={14}/> {claim.incident_date}</span>
//                             <span className="flex items-center gap-1 font-medium text-gray-700"><Euro size={14}/> {claim.claim_amount}</span>
//                         </div>
//                     </div>
//                   </div>

//                   {/* Statut & Action */}
//                   <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
//                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(claim.status)}`}>
//                       {formatStatus(claim.status)}
//                     </span>
//                     <ChevronRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
//                   </div>

//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  PlusCircle, FileText, Calendar, Euro, 
  ChevronRight, ChevronDown, ChevronUp, Search, Filter, X,
  CheckCircle, AlertCircle, Clock, MapPin, Car, ExternalLink
} from 'lucide-react';

export default function ClientDashboard() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState('');
  // NOTE: On utilise ici les valeurs exactes de la BDD pour le filtre
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'ANALYZING', 'VALIDATED', 'REJECTED'
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Accordéon
  const [expandedClaimId, setExpandedClaimId] = useState(null);

  // Récupérer les dossiers
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get('/claims');
        setClaims(res.data);
      } catch (error) {
        console.error("Erreur chargement dossiers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  // --- LOGIQUE FILTRES ---
  const filteredClaims = claims.filter(claim => {
    // 1. Recherche Textuelle
    const matchesSearch = 
        claim.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claim_amount?.toString().includes(searchTerm);
    
    // 2. Filtre par Statut (Verif exacte avec la BDD)
    const matchesStatus = statusFilter === 'ALL' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // --- HELPERS D'AFFICHAGE (Mapping BDD -> Visuel) ---
  const toggleExpanded = (id) => {
    if (expandedClaimId === id) setExpandedClaimId(null);
    else setExpandedClaimId(id);
  };

  // Couleur du badge selon le statut BDD
  const getStatusBadge = (status) => {
    switch (status) {
      case 'VALIDATED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'ANALYZING': 
      case 'IN_PROGRESS': // Au cas où vous utilisez aussi ce statut
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  // Texte affiché à l'utilisateur selon le statut BDD
  const formatStatusText = (status) => {
    switch (status) {
      case 'VALIDATED': return 'Validé';
      case 'REJECTED': return 'Refusé';
      case 'ANALYZING': return 'En analyse';
      case 'IN_PROGRESS': return 'En cours';
      default: return 'En attente';
    }
  };

  // Ouvrir le document
  const openDocument = (filename) => {
    if (!filename) return;
    // Vérifiez bien que le port correspond à votre backend (ex: 5000)
    window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EN-TÊTE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Mes Sinistres</h1>
            <p className="text-slate-500 mt-1">Gérez et suivez l'état de vos déclarations</p>
          </div>
          
          <Link 
            to="/client/new" 
            className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" /> 
            <span>Déclarer un sinistre</span>
          </Link>
        </div>

        {/* LISTE DES DOSSIERS */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
          
          {/* --- BARRE D'OUTILS --- */}
          <div className="border-b border-gray-100">
              <div className="p-6 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-blue-100 text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={14}/>
                        </button>
                    )}
                </div>
                <button 
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className={`p-2 rounded-lg transition-colors border ${showFilterMenu ? 'bg-blue-50 text-blue-600 border-blue-100' : 'hover:bg-gray-50 text-gray-500 border-transparent'}`}
                >
                    <Filter size={20}/>
                </button>
              </div>

              {/* MENU FILTRES AVEC NOMS BDD CORRECTS */}
              {showFilterMenu && (
                  <div className="px-6 pb-4 flex gap-2 overflow-x-auto">
                      {['ALL', 'ANALYZING', 'VALIDATED', 'REJECTED'].map((status) => (
                          <button
                              key={status}
                              onClick={() => setStatusFilter(status)}
                              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${statusFilter === status ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                              {status === 'ALL' ? 'Tous' : formatStatusText(status)}
                          </button>
                      ))}
                  </div>
              )}
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">Chargement des données...</div>
          ) : filteredClaims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <FileText size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun dossier trouvé</h3>
              <p className="text-gray-500 max-w-md mb-6">Vous n'avez aucun sinistre correspondant à vos critères.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="group transition-colors">
                  
                  {/* --- LIGNE PRINCIPALE (Clickable) --- */}
                  <div 
                    onClick={() => toggleExpanded(claim.id)}
                    className={`p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 
                      ${expandedClaimId === claim.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl mt-1 ${expandedClaimId === claim.id ? 'bg-blue-200 text-blue-700' : 'bg-blue-100 text-blue-600'}`}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                            {claim.description ? (claim.description.length > 50 ? claim.description.substring(0, 50) + '...' : claim.description) : 'Sinistre sans titre'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(claim.incident_date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 font-medium text-gray-700"><Euro size={14}/> {claim.claim_amount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusBadge(claim.status)}`}>
                        {formatStatusText(claim.status)}
                      </span>
                      <div className="text-gray-400">
                        {expandedClaimId === claim.id ? <ChevronUp size={20} /> : <ChevronRight size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* --- ZONE DÉTAILS DÉPLIABLE --- */}
                  {expandedClaimId === claim.id && (
                    <div className="px-6 pb-6 pt-2 bg-blue-50/30 border-t border-blue-50/50 animation-fade-in">
                      
                      {/* 1. MESSAGE DE STATUT DÉTAILLÉ (Check des valeurs BDD exactes) */}
                      <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
                        
                        {/* CAS VALIDATED */}
                        {claim.status === 'VALIDATED' && (
                            <div className="bg-green-50 border border-green-100 p-4 flex items-start gap-3">
                                <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={24} />
                                <div>
                                    <h4 className="font-bold text-green-800">Félicitations ! Votre dossier est approuvé.</h4>
                                    <p className="text-green-700 text-sm mt-1">
                                        Notre IA et nos agents ont validé votre déclaration. Le virement de l'indemnisation a été ordonné.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* CAS REJECTED */}
                        {claim.status === 'REJECTED' && (
                            <div className="bg-red-50 border border-red-100 p-4 flex items-start gap-3">
                                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                                <div>
                                    <h4 className="font-bold text-red-800">Dossier refusé</h4>
                                    <p className="text-red-700 text-sm mt-1 mb-2">
                                        Nous ne pouvons pas donner suite à votre demande.
                                    </p>
                                    <div className="bg-white/60 p-3 rounded-lg text-sm text-red-800 italic border border-red-100">
                                        " {claim.ai_analysis || "Critères de garantie non respectés."} "
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CAS ANALYZING / DEFAULT */}
                        {(claim.status === 'ANALYZING' || claim.status === 'IN_PROGRESS' || !['VALIDATED', 'REJECTED'].includes(claim.status)) && (
                            <div className="bg-blue-50 border border-blue-100 p-4 flex items-start gap-3">
                                <Clock className="text-blue-600 shrink-0 mt-0.5" size={24} />
                                <div>
                                    <h4 className="font-bold text-blue-800">Analyse en cours...</h4>
                                    <p className="text-blue-700 text-sm mt-1">
                                        Nous avons bien reçu votre déclaration. Notre système intelligent analyse actuellement vos pièces justificatives.
                                    </p>
                                </div>
                            </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 2. DÉTAILS SAISIS */}
                          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                  <Car size={18} className="text-gray-400"/> Détails de l'incident
                              </h4>
                              <div className="space-y-3 text-sm">
                                  <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-500">Type</span>
                                      <span className="font-medium text-gray-800">{claim.incident_type || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-500">Collision</span>
                                      <span className="font-medium text-gray-800">{claim.collision_type || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-500">Gravité</span>
                                      <span className="font-medium text-gray-800">{claim.incident_severity || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-gray-500 flex items-center gap-1"><MapPin size={12}/> Ville</span>
                                      <span className="font-medium text-gray-800">{claim.city || "Non spécifiée"}</span>
                                  </div>
                              </div>
                          </div>

                          {/* 3. DOCUMENT JOINT */}
                          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                              <div>
                                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                      <FileText size={18} className="text-gray-400"/> Justificatif
                                  </h4>
                                  <p className="text-sm text-gray-500 mb-4">
                                      Le document que vous avez fourni pour prouver le sinistre (Constat, photo, rapport police...).
                                  </p>
                              </div>
                              <button 
                                  onClick={(e) => { e.stopPropagation(); openDocument(claim.document_path); }}
                                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl border border-gray-200 transition-all font-medium"
                              >
                                  <ExternalLink size={16} /> Voir le document
                              </button>
                          </div>
                      </div>

                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}