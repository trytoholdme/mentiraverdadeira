import React, { useState } from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';
import type { User } from '../types';

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: (user: User) => void;
}

export default function AdminLogin({ onBack, onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Erro ao fazer login. Tente novamente.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', data.token);
      setError(null);
      onSuccess(data.user);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-gray-300 hover:text-green-400 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Voltar
      </button>

      <div className="glass-card p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
          <LogIn className="mr-2 text-green-400" />
          Admin Login
        </h2>

        {error && (
          <div className="bg-pink-500/10 border border-pink-500 text-pink-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
