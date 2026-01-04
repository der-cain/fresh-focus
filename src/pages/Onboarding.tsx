import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { ArrowRight, Activity, Weight, Ruler, User as UserIcon } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const setUserPreferences = useStore((state) => state.setUserPreferences);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'female',
    activity: 'sedentary'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTDEE = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);
    
    // Miflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (formData.gender === 'male') bmr += 5;
    else bmr -= 161;

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    return Math.round(bmr * (activityMultipliers[formData.activity] || 1.2));
  };

  const handleFinish = () => {
    const tdee = calculateTDEE();
    const deficit = 500; // Standard weight loss deficit
    const target = tdee - deficit;
    
    setUserPreferences({
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      age: parseFloat(formData.age),
      activityLevel: formData.activity,
      dailyLimit: Math.max(1200, target) // Floor at 1200
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-oat-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full transform transition-all">
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-loam-800">Let's get started</h2>
            <span className="text-sm font-mono text-matcha-600 bg-matcha-50 px-2 py-1 rounded-full">Step {step}/2</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-sm font-bold text-loam-700 flex items-center gap-2">
                    <Weight className="w-4 h-4 text-matcha-500" /> Current Weight (kg)
                </label>
                <input 
                    type="number" 
                    name="weight" 
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full p-4 bg-oat-50 rounded-xl border-2 border-transparent focus:border-matcha-400 outline-none transition-all font-mono text-lg"
                    placeholder="e.g. 70"
                />
             </div>
             <div className="space-y-1">
                <label className="text-sm font-bold text-loam-700 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-matcha-500" /> Height (cm)
                </label>
                <input 
                    type="number" 
                    name="height" 
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full p-4 bg-oat-50 rounded-xl border-2 border-transparent focus:border-matcha-400 outline-none transition-all font-mono text-lg"
                    placeholder="e.g. 175"
                />
             </div>
             <div className="space-y-1">
                <label className="text-sm font-bold text-loam-700 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-matcha-500" /> Age
                </label>
                <input 
                    type="number" 
                    name="age" 
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full p-4 bg-oat-50 rounded-xl border-2 border-transparent focus:border-matcha-400 outline-none transition-all font-mono text-lg"
                    placeholder="e.g. 30"
                />
             </div>
             
             <button 
                onClick={() => setStep(2)}
                disabled={!formData.weight || !formData.height || !formData.age}
                className="w-full mt-6 bg-matcha-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-matcha-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
             >
                Next <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-bold text-loam-700">Gender</label>
                <div className="flex gap-2">
                    {['female', 'male'].map(g => (
                        <button
                            key={g}
                            onClick={() => setFormData({...formData, gender: g})}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-xl font-bold capitalize transition-all border-2",
                                formData.gender === g 
                                    ? "bg-matcha-100 border-matcha-500 text-matcha-800" 
                                    : "bg-oat-50 border-transparent text-loam-600 hover:bg-oat-100"
                            )}
                        >
                            {g}
                        </button>
                    ))}
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-sm font-bold text-loam-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-matcha-500" /> Activity Level
                </label>
                <select 
                    name="activity" 
                    value={formData.activity}
                    onChange={handleChange}
                    className="w-full p-4 bg-oat-50 rounded-xl border-2 border-transparent focus:border-matcha-400 outline-none transition-all font-sans text-base appearance-none cursor-pointer"
                >
                    <option value="sedentary">Sedentary (Office job)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very_active">Very Active (Physical job)</option>
                </select>
             </div>

             <button 
                onClick={handleFinish}
                className="w-full mt-6 bg-matcha-500 hover:bg-matcha-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
             >
                Create My Plan!
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
