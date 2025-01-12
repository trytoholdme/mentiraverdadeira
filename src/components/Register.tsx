import React, { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { createUser } from '../lib/auth';
import type { User } from '../types';

interface RegisterProps {
  onBack: () => void;
  onSuccess: (user: User) => void;
}

export default function Register({ onBack, onSuccess }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await createUser(email, password, inviteCode, {
        name,
        phone,
        document,
      });
      if (user) {
        onSuccess(user);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
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
          <UserPlus className="mr-2 text-green-400" />
          Criar Conta
        </h2>

        {error && (
          <div className="bg-pink-500/10 border border-pink-500 text-pink-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="name">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
              placeholder="Seu nome"
              required
              disabled={loading}
            />
          </div>

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
              placeholder="seu@email.com"
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
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="phone">
              Telefone
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
              placeholder="11999999999"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="document">
              Documento (CPF)
            </label>
            <input
              type="text"
              id="document"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
              placeholder="000.000.000-00"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="inviteCode">
              Código de Convite (opcional)
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
              placeholder="Código de Convite"
              maxLength={6}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Criando Conta...' : 'Criar Conta e Ganhar R$ 5,00'}
          </button>
        </form>
      </div>
    </div>
  );
}