import React, { useState } from 'react';
import { ArrowLeft, LogIn, DollarSign } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

function addCreditsToUser(email: string, amount: number): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((user: { email: string }) => user.email === email);

  if (user) {
    user.credits = (user.credits || 0) + amount;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  return false;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email === 'admin@gmail.com' && password === 'delas7') {
      setError(null);
      setIsAdmin(true);
    } else {
      setError('Email ou senha inválidos. Tente novamente.');
    }

    setLoading(false);
  };

  const handleAddCredits = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('Valor inválido');
      return;
    }

    const success = addCreditsToUser(userEmail, amountNumber);
    if (success) {
      setMessage(`R$ ${amountNumber} adicionados à conta de ${userEmail}`);
    } else {
      setError('Usuário não encontrado');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setEmail('');
    setPassword('');
  };

  if (isAdmin) {
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
            <DollarSign className="mr-2 text-green-400" />
            Admin Dashboard
          </h2>

          {error && (
            <div className="bg-pink-500/10 border border-pink-500 text-pink-500 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleAddCredits} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="userEmail">
                Email do Usuário
              </label>
              <input
                type="email"
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2" htmlFor="amount">
                Valor (R$)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
                placeholder="Valor"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Adicionar Saldo
            </button>
          </form>

          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity mt-4"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

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
              placeholder="admin@gmail.com"
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
