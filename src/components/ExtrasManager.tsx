import { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';

export default function ExtrasManager() {
  const { extras, saveExtras } = useMenu();
  const [jsonStr, setJsonStr] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setJsonStr(JSON.stringify(extras, null, 2));
  }, [extras]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonStr);
      saveExtras(parsed);
      setMsg('Extras saved successfully! Menu is updated.');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg('Error: Invalid JSON format. Please check your syntax.');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleReset = () => {
    setJsonStr(JSON.stringify(extras, null, 2));
    setMsg('Reverted to current saved state.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="mt-16 bg-[#2b1200] border border-white/10 rounded-xl p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">Global Customization Extras</h2>
          <p className="font-inter text-sm text-white/50 mt-1">
            Edit the JSON below to add, remove, or update the global pizza extras (toppings, sauces, etc.).
          </p>
        </div>
        <div className="flex items-center gap-4">
          {msg && (
            <span className={`font-inter text-sm ${msg.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {msg}
            </span>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-white/20 rounded font-barlow font-bold text-white hover:bg-white/5 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#d4a017] text-black rounded font-barlow font-bold hover:bg-yellow-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <textarea
        value={jsonStr}
        onChange={(e) => setJsonStr(e.target.value)}
        className="w-full h-[500px] bg-[#1a0a00] border border-white/10 rounded-lg p-4 font-mono text-sm text-white outline-none focus:border-[#d4a017] resize-y"
        spellCheck={false}
      />
    </div>
  );
}
