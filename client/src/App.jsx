import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import logo from './logo.png';

const wilayas = [
  'Adrar', 'Assaba', 'Brakna', 'Dakhlet Nouadhibou', 'Gorgol',
  'Guidimaka', 'Hodh Ech Chargui', 'Hodh El Gharbi', 'Inchiri', 'Nouakchott-Nord',
  'Nouakchott-Ouest', 'Nouakchott-Sud', 'Tagant', 'Tiris Zemmour', 'Trarza'
];

function App() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    nni: '',
    wilaya: ''
  });
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des stats:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { prenom, nom, telephone, nni, wilaya } = formData;
    if (prenom.length < 2 || prenom.length > 50 || !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(prenom)) {
      setMessage('Le prénom doit contenir entre 2 et 50 lettres.');
      return false;
    }
    if (nom.length < 2 || nom.length > 50 || !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(nom)) {
      setMessage('Le nom doit contenir entre 2 et 50 lettres.');
      return false;
    }
    if (!/^\d{8,15}$/.test(telephone)) {
      setMessage('Le numéro de téléphone doit contenir entre 8 et 15 chiffres.');
      return false;
    }
    if (!/^\d{10}$/.test(nni)) {
      setMessage('Le NNI doit contenir exactement 10 chiffres.');
      return false;
    }
    if (!wilaya) {
      setMessage('Veuillez sélectionner une wilaya.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await axios.post('/api/participants', formData);
      setMessage(res.data.message);
      setFormData({ prenom: '', nom: '', telephone: '', nni: '', wilaya: '' });
      fetchStats();
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      setMessage('Erreur lors de l\'envoi du formulaire.');
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get('/api/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'participants.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header façon Facebook */}
      <header className="header-fb w-full">
        <img src={logo} alt="Logo Initiative" className="header-fb-logo" />
        <span className="header-fb-title">مبادرة المليون توقيع ضد خطاب الكراهية</span>
      </header>

      {/* Main Content */}
      <main className="flex main-flex flex-row justify-center items-start gap-10 px-4 py-10 w-full max-w-5xl mx-auto">
        {/* Formulaire */}
        <section className="flex-1 fb-card max-w-lg w-full">
          <h2 className="text-lg font-bold text-[#1877f2] mb-6 text-center font-[Inter]">Je participe</h2>
          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Formulaire de participation">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-[#1877f2] mb-1">Prénom</label>
              <input id="prenom" type="text" name="prenom" value={formData.prenom} onChange={handleChange} autoComplete="given-name" required aria-required="true" />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-[#1877f2] mb-1">Nom</label>
              <input id="nom" type="text" name="nom" value={formData.nom} onChange={handleChange} autoComplete="family-name" required aria-required="true" />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-[#1877f2] mb-1">Téléphone</label>
              <input id="telephone" type="text" name="telephone" value={formData.telephone} onChange={handleChange} autoComplete="tel" required aria-required="true" />
            </div>
            <div>
              <label htmlFor="nni" className="block text-sm font-medium text-[#1877f2] mb-1">NNI</label>
              <input id="nni" type="text" name="nni" value={formData.nni} onChange={handleChange} required aria-required="true" />
            </div>
            <div>
              <label htmlFor="wilaya" className="block text-sm font-medium text-[#1877f2] mb-1">Wilaya</label>
              <select id="wilaya" name="wilaya" value={formData.wilaya} onChange={handleChange} required aria-required="true">
                <option value="">Sélectionner une wilaya</option>
                {wilayas.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="fb-btn w-full">Soumettre</button>
          </form>
          {message && (
            <div className="mt-6 text-center animate-bounce-in">
              <span className="inline-block bg-[#e7f3ff] text-[#1877f2] px-4 py-2 rounded-lg shadow font-semibold border border-[#b6d7fa] transition text-base">{message}</span>
            </div>
          )}
        </section>

        {/* Tableau de bord */}
        <section className="flex-1 fb-card max-w-lg w-full">
          <h2 className="text-lg font-bold text-[#1877f2] mb-6 text-center font-[Inter]">Tableau de bord</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full dashboard-table border border-[#1877f2] rounded-lg overflow-hidden text-center text-base">
              <caption className="sr-only">Statistiques par wilaya</caption>
              <thead className="bg-[#1877f2]">
                <tr>
                  <th scope="col" className="text-xs font-bold text-white uppercase tracking-wider">Wilaya</th>
                  <th scope="col" className="text-xs font-bold text-white uppercase tracking-wider">Nombre de participants</th>
                </tr>
              </thead>
              <tbody>
                {stats.length === 0 ? (
                  <tr><td colSpan={2} className="py-6 text-gray-400">Aucune participation pour l'instant</td></tr>
                ) : stats.map((stat) => (
                  <tr key={stat.wilaya}>
                    <td className="font-medium text-[#1877f2]">{stat.wilaya}</td>
                    <td className="text-[#222]">{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleExport} className="fb-btn w-full mt-6">Exporter en Excel</button>
        </section>
      </main>

      {/* Footer */}
      <footer>
        INITIATIVE D'UN MILLION DE SIGNATURES CONTRE LES DISCOURS DE HAINE
      </footer>
    </div>
  );
}

export default App; 