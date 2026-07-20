import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, LogOut, Users, Calendar, ClipboardList, 
  Plus, Check, MessageSquareText, ShieldAlert, Sparkles, Activity
} from 'lucide-react';

interface DoctorDashboardViewProps {
  onLogout: () => void;
}

export default function DoctorDashboardView({ onLogout }: DoctorDashboardViewProps) {
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  
  // Prescription Form state
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFreq, setNewFreq] = useState('Morning & Night');
  const [newFood, setNewFood] = useState('After Food');
  const [newDuration, setNewDuration] = useState('5 Days');
  const [newInstruction, setNewInstruction] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Loaded from same localStorage
  useEffect(() => {
    const savedAppts = localStorage.getItem('hb_appointments');
    if (savedAppts) {
      setAppointmentsList(JSON.parse(savedAppts));
    }

    const savedPrescs = localStorage.getItem('hb_prescriptions');
    if (savedPrescs) {
      setPrescriptions(JSON.parse(savedPrescs));
    }
  }, []);

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newDosage) {
      alert("Please enter medicine details");
      return;
    }

    const newPresc = {
      id: Math.random().toString(),
      medicine: newMedName,
      dosage: newDosage,
      frequency: newFreq,
      foodRelation: newFood,
      duration: newDuration,
      instruction: newInstruction || `Take ${newMedName} as directed.`
    };

    const savedPrescs = localStorage.getItem('hb_prescriptions');
    const existing = savedPrescs ? JSON.parse(savedPrescs) : [];
    const updated = [newPresc, ...existing];

    setPrescriptions(updated);
    localStorage.setItem('hb_prescriptions', JSON.stringify(updated));

    setSuccessMsg('Prescription successfully dispatched directly to Patient Digital Prescriptions Wallet!');
    setTimeout(() => {
      setSuccessMsg('');
      setShowForm(false);
      // Reset form fields
      setNewMedName('');
      setNewDosage('');
      setNewInstruction('');
    }, 4000);
  };

  const handleApproveAppointment = (id: string) => {
    const updated = appointmentsList.map(appt => 
      appt.id === id ? { ...appt, status: 'Confirmed' } : appt
    );
    setAppointmentsList(updated);
    localStorage.setItem('hb_appointments', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 animate-fade-in" id="doctor-dashboard-container">
      
      {/* Clinician Welcome Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl translate-x-12 -translate-y-12"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-2 uppercase tracking-widest">
              Verified Clinician Portal
            </div>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight">
              Dr. Ramesh Kumar, MD
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md">
              Chief Resident Physician, City Civil Government Hospital.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
            id="doctor-logout-btn"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overview stats layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <Users size={16} className="text-sky-500" />
            <span>PATIENT QUEUE SIZE</span>
          </div>
          <span className="text-3xl font-sans font-extrabold text-slate-800 block">
            {appointmentsList.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Direct bookings synced from worker UI</span>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <Calendar size={16} className="text-emerald-500" />
            <span>ACTIVE PRESCRIPTIONS</span>
          </div>
          <span className="text-3xl font-sans font-extrabold text-slate-800 block">
            {prescriptions.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">🟢 Connected with multilingual TTS</span>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <HeartPulse size={16} className="text-red-500" />
            <span>EMERGENCY CHANNELS</span>
          </div>
          <span className="text-3xl font-sans font-extrabold text-slate-800 block">3</span>
          <span className="text-[10px] text-slate-400 block mt-1">Dispatched directly to workers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Appointments Queue (synced in real-time) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                Patient Consultations Queue
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">Live Synced</span>
            </div>

            {appointmentsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No patient bookings in queue currently.</p>
            ) : (
              <div className="space-y-3">
                {appointmentsList.map((appt) => (
                  <div key={appt.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs">Worker Patient</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                          appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">🏥 {appt.hospital}</p>
                      <p className="text-[11px] text-slate-600 mt-1">Reason: <strong className="text-slate-800">{appt.reason}</strong></p>
                      <div className="text-[10px] text-slate-400 mt-1.5">{appt.date} | {appt.time}</div>
                    </div>

                    {appt.status !== 'Confirmed' && (
                      <button
                        onClick={() => handleApproveAppointment(appt.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-all"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Written Prescriptions block */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                Active Digital Prescriptions Wallet
              </h3>
              <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-bold">Digital Dispatch</span>
            </div>

            <div className="space-y-2">
              {prescriptions.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 block">{p.medicine}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{p.dosage} — {p.frequency} ({p.duration})</span>
                  </div>
                  <span className="text-[9px] font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    TTS-Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Write Prescription Form */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wide">
                Dispatched prescription
              </h4>
              <button
                onClick={() => setShowForm(!showForm)}
                className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                <Plus size={16} />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Add custom prescription rows. This data will immediately synchronize and appear inside the worker's Patient Prescriptions tab!
            </p>

            {showForm ? (
              <form onSubmit={handleCreatePrescription} className="space-y-3 text-xs">
                {successMsg && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-[10px] font-bold rounded-lg mb-2">
                    {successMsg}
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Medicine Name (e.g. Paracetamol)</label>
                  <input
                    type="text"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                    placeholder="Enter medicine name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Dosage (e.g. 1 Tablet)</label>
                    <input
                      type="text"
                      value={newDosage}
                      onChange={(e) => setNewDosage(e.target.value)}
                      className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                      placeholder="e.g. 1 Tablet"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Duration</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                      placeholder="e.g. 5 Days"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Frequency</label>
                  <select
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                  >
                    <option value="Morning & Night">Morning & Night</option>
                    <option value="Morning, Afternoon & Night">Morning, Afternoon & Night</option>
                    <option value="Once a Day (Morning)">Once a Day (Morning)</option>
                    <option value="Once a Day (Night)">Once a Day (Night)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Food Relation</label>
                  <select
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none"
                  >
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                    <option value="With Food">With Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Patient instructions (Translate ready)</label>
                  <textarea
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 focus:border-blue-500 outline-none resize-none"
                    placeholder="e.g. Take one tablet with water after dinner."
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                >
                  Send Prescription
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                + Write Prescription
              </button>
            )}
          </div>

          {/* Clinician guidelines card */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-800 leading-relaxed font-semibold">
            <span className="block font-bold text-emerald-900 mb-1">💡 Professional Tip:</span>
            Write simple patient instructions. The SAHAAYA SETU accessibility framework will automatically translate and read it aloud to the migrant workers in their native language script.
          </div>
        </div>

      </div>

    </div>
  );
}
