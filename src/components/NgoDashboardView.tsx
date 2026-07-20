import React, { useState, useEffect } from 'react';
import { 
  Building, LogOut, HeartHandshake, MapPin, ShieldCheck, 
  Sparkles, Calendar, Plus, Users, Clock, CheckCircle2 
} from 'lucide-react';

interface NgoDashboardViewProps {
  onLogout: () => void;
}

export default function NgoDashboardView({ onLogout }: NgoDashboardViewProps) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [campsCount, setCampsCount] = useState(2);
  
  // Camp Scheduler Form State
  const [showCampForm, setShowCampForm] = useState(false);
  const [campTitle, setCampTitle] = useState('');
  const [campOrg, setCampOrg] = useState('Red Cross Healthcare Org');
  const [campDate, setCampDate] = useState('');
  const [campVenue, setCampVenue] = useState('');
  const [campTime, setCampTime] = useState('09:00 AM - 04:00 PM');
  const [campBenefits, setCampBenefits] = useState('');
  const [campSuccess, setCampSuccess] = useState('');

  useEffect(() => {
    // Load registrations
    const savedRegs = localStorage.getItem('hb_camp_registrations');
    if (savedRegs) {
      setRegistrations(JSON.parse(savedRegs));
    } else {
      const defaultRegs = [
        { campId: 'camp1', campTitle: 'Free Diabetic & Eye Checkup', venue: 'Community Hall, Sector 4 Labour Colony', date: 'Sunday, July 26', workerName: 'Ramu S.', workerAge: '34', workerGender: 'Male', workerPhone: '9848012345', preferredLanguage: 'Telugu' },
        { campId: 'camp1', campTitle: 'Free Diabetic & Eye Checkup', venue: 'Community Hall, Sector 4 Labour Colony', date: 'Sunday, July 26', workerName: 'Sita Devi', workerAge: '29', workerGender: 'Female', workerPhone: '9177234567', preferredLanguage: 'Hindi' }
      ];
      setRegistrations(defaultRegs);
      localStorage.setItem('hb_camp_registrations', JSON.stringify(defaultRegs));
    }
  }, []);

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle || !campVenue || !campDate) {
      alert("Please fill camp details");
      return;
    }

    // Increment camps count visually
    setCampsCount(prev => prev + 1);
    setCampSuccess('Upcoming Free Medical Camp dispatched and published successfully!');
    
    setTimeout(() => {
      setCampSuccess('');
      setShowCampForm(false);
      setCampTitle('');
      setCampVenue('');
      setCampDate('');
      setCampBenefits('');
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 animate-fade-in" id="ngo-dashboard-container">
      
      {/* NGO Banner */}
      <div className="bg-sky-950 text-white p-6 rounded-3xl shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl translate-x-12 -translate-y-12"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1 bg-sky-500/25 text-sky-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-500/30 mb-2 uppercase tracking-widest font-sans">
              Verified NGO Partner Portal
            </div>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight">
              Red Cross Healthcare Org
            </h2>
            <p className="text-sky-200 text-xs sm:text-sm mt-1 max-w-md">
              Primary Medical Camps coordinator for Northern Labour Sectors.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
            id="ngo-logout-btn"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Campaign Summary layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <HeartHandshake size={16} className="text-sky-500" />
            <span>ACTIVE CAMPS</span>
          </div>
          <span className="text-3xl font-sans font-extrabold text-slate-800 block">
            {campsCount}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">2 construction sites, 1 farming hub</span>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>CAMP REGISTRATIONS</span>
          </div>
          <span className="text-3xl font-sans font-extrabold text-slate-800 block">
            {registrations.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">🟢 Synced from migrant patient forms</span>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <MapPin size={16} className="text-rose-500" />
            <span>VOLUNTEER DOCTORS</span>
          </div>
          <span className="text-3xl font-sans font-extrabold text-slate-800 block">12</span>
          <span className="text-[10px] text-slate-400 block mt-1">4 local hospitals sponsoring staff</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Camp Registrations (Directly Synced from Worker Actions) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-sans font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                Worker Registrations Live Tracker
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded font-bold">Live Feed</span>
            </div>

            {registrations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No worker registrations reported yet.</p>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs">
                          {reg.workerName} ({reg.workerAge} yrs, {reg.workerGender})
                        </h5>
                        <p className="text-[10px] text-slate-500 mt-1">📞 Contact: {reg.workerPhone}</p>
                        <p className="text-[10px] text-blue-600 font-semibold mt-1">🎯 Campaign: {reg.campTitle}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">📍 Venue: {reg.venue}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold uppercase">
                          {reg.preferredLanguage}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1.5">{reg.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Schedule Camp Form */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wide">
                Schedule Free Camp
              </h4>
              <button
                onClick={() => setShowCampForm(!showCampForm)}
                className="p-1 rounded bg-sky-50 text-sky-600 hover:bg-sky-100"
              >
                <Plus size={16} />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              NGO coordinators can dispatch medical campaigns near labor colonies.
            </p>

            {showCampForm ? (
              <form onSubmit={handleCreateCamp} className="space-y-3 text-xs">
                {campSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-[10px] font-bold rounded-lg mb-2">
                    {campSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Camp Title (e.g. Free Eye Checkup)</label>
                  <input
                    type="text"
                    value={campTitle}
                    onChange={(e) => setCampTitle(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                    placeholder="Enter camp title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Organizer</label>
                  <input
                    type="text"
                    value={campOrg}
                    onChange={(e) => setCampOrg(e.target.value)}
                    className="w-full bg-slate-100 text-slate-500 border rounded-lg p-2 outline-none"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Camp Date (e.g. Sunday, Aug 09)</label>
                  <input
                    type="text"
                    value={campDate}
                    onChange={(e) => setCampDate(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                    placeholder="e.g. Sunday, Aug 09"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Venue Location</label>
                  <input
                    type="text"
                    value={campVenue}
                    onChange={(e) => setCampVenue(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                    placeholder="e.g. Labour Camp West Hub"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Benefits Offered</label>
                  <input
                    type="text"
                    value={campBenefits}
                    onChange={(e) => setCampBenefits(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                    placeholder="e.g. Free vaccines and medicines"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                >
                  Publish Camp
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowCampForm(true)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                + Schedule Medical Camp
              </button>
            )}
          </div>

          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-xs text-sky-800 leading-relaxed font-semibold">
            <span className="block font-bold text-sky-950 mb-1">💡 NGO Guidelines:</span>
            Ensure to coordinate with local ASHA workers before scheduling. Published campaigns automatically display inside the worker's Patient Dashboard under Free Medical Camps.
          </div>
        </div>

      </div>

    </div>
  );
}
