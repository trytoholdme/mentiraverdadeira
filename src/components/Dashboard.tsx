import React, { useState } from 'react';
import { ArrowLeft, DollarSign } from 'lucide-react';
import type { User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  isAdmin: boolean;
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

export default function Dashboard({ user, onLogout, isAdmin }: DashboardProps) {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('Valor inválido');
      return;
    }

    const success = addCreditsToUser(email, amountNumber);
    if (success) {
      setMessage(`R$ ${amountNumber} adicionados à conta de ${email}`);
    } else {
      setError('Usuário não encontrado');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Bem-vindo, {user.name}!</h2>
        <p className="text-gray-300 mb-4">Saldo: R$ {user.credits.toFixed(2)}</p>
        <p className="text-gray-300 mb-4">Código de Indicação: {user.referralCode}</p>

        {isAdmin && (
          <>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email do Usuário
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
          </>
        )}

        <button
          onClick={onLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity mt-4"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
