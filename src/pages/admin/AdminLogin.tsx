import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#E8D8C8] rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-[#1A1A1A] p-8 text-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8201A] rounded-bl-full opacity-20 -mr-10 -mt-10 blur-2xl" />
          <div className="w-16 h-16 bg-[#2A2A2A] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner relative z-10 border border-white/10">
            <ShieldCheck className="w-8 h-8 text-[#D4952A]" />
          </div>
          <h2 className="font-bebas text-[36px] tracking-wider leading-none mb-2 z-10 relative">Admin Portal</h2>
          <p className="font-inter text-[13px] text-[#AAAAAA] z-10 relative">
            Secure access required to manage Brent Street Pizza.
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-[#EB001B]/10 border border-[#EB001B]/20 rounded-xl p-4 text-[#EB001B] font-inter text-[13px] text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FDFAF6] border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors"
                placeholder="admin@brentstreetpizza.com.au"
              />
            </div>

            <div>
              <label className="block font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#FDFAF6] border border-[#E8D8C8] rounded-xl pl-10 pr-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-[#AAAAAA] absolute left-3.5 top-[14px]" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow font-800 text-[14px] uppercase tracking-[0.1em] px-6 py-4 rounded-xl transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-8 font-inter text-[13px] text-[#888888] hover:text-[#1A1A1A] transition-colors"
      >
        &larr; Return to main site
      </button>
    </div>
  );
}
