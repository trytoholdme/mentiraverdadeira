import React, { useState } from 'react';
import axios from 'axios';
import { Wallet } from 'lucide-react';
import type { User } from '../types';

interface DepositProps {
  onDepositSuccess?: () => void;
  user: User;
  onCreditChange: (newCredits: number) => void;
}

export default function Deposit({ onDepositSuccess, user, onCreditChange }: DepositProps) {
  const [depositAmount, setDepositAmount] = useState('20');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const calculateBonus = (amount: number) => {
    return amount * 0.5;
  };

  const checkPaymentStatus = async (transactionId: string, encodedSecretKey: string) => {
    try {
      const response = await axios.get(
        `https://api.everpaygateway.com/v1/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Basic ${encodedSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const transactionData = response.data;
      if (transactionData.paidAmount > 0) {
        console.log('Pagamento confirmado:', transactionData);
        setQrCode(transactionData.pix.qrcode);
        setPixGenerated(true);
        const bonus = calculateBonus(Number(depositAmount));
        const newCredits = user.credits + Number(depositAmount) + bonus;
        onCreditChange(newCredits);
        updateUserCredits(user.email, newCredits);
        if (onDepositSuccess) {
          onDepositSuccess();
        }
      } else if (transactionData.status === 'waiting_payment') {
        console.log('Pagamento aguardando:', transactionData);
        setPixCode(transactionData.pix.qrcode);
        setError(null);
      } else {
        console.log('Pagamento ainda não processado:', transactionData);
        setError('Pagamento não processado. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao verificar o status do pagamento:', error);
      setError('Erro ao verificar o status do pagamento. Tente novamente.');
    }
  };

  const generatePix = async (amount: number) => {
    setLoadingPix(true);
    setPixGenerated(false);
    setError(null);

    if (!user.name || !user.email || !user.phone || !user.document) {
      setError('Dados do cliente estão incompletos. Verifique nome, e-mail, telefone e documento.');
      setLoadingPix(false);
      return;
    }

    const isCpf = user.document.length === 11;
    const documentType = isCpf ? 'cpf' : 'cnpj';

    const requestData = {
      amount: amount * 100,
      paymentMethod: 'pix',
      customer: {
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
        phone: user.phone.trim().replace(/\D/g, ''),
        document: {
          number: user.document.trim().replace(/\D/g, ''),
          type: documentType,
        },
      },
      items: [
        {
          title: 'Depósito Mentira Verdadeira',
          unitPrice: amount * 100,
          quantity: 1,
          tangible: true,
        },
      ],
      pix: {
        expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
      metadata: {
        description: 'Depósito Mentira Verdadeira',
      },
    };

    console.log('Payload enviado à API:', JSON.stringify(requestData, null, 2));

    const secretKey = "sk_live_UvCzy852ZMMdg9XG8uTsu1AnJrBRjjXEMgRsVjUVOR";
    const encodedSecretKey = btoa(`${secretKey}:x`);

    try {
      const response = await axios.post(
        'https://api.everpaygateway.com/v1/transactions',
        requestData,
        {
          headers: {
            Authorization: `Basic ${encodedSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response Data:', response.data);

      if (response.data.paidAmount > 0) {
        setQrCode(response.data.pix.qrcode);
        setPixGenerated(true);
        const bonus = calculateBonus(amount);
        const newCredits = user.credits + amount + bonus;
        onCreditChange(newCredits);
        updateUserCredits(user.email, newCredits);
        if (onDepositSuccess) {
          onDepositSuccess();
        }
      } else if (response.data.status === 'waiting_payment') {
        setPixCode(response.data.pix.qrcode);
        setError(null);
        checkPaymentStatus(response.data.id, encodedSecretKey);
      } else {
        setError('Pagamento não foi processado. Tentando verificar status...');
        checkPaymentStatus(response.data.id, encodedSecretKey);
      }
    } catch (error: any) {
      console.error('Erro ao gerar PIX:', error);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        const apiErrors = error.response.data?.message || [];
        if (Array.isArray(apiErrors)) {
          setError(`Erro(s): ${apiErrors.join(' | ')}`);
        } else {
          setError('Erro desconhecido ao processar a requisição.');
        }
      } else {
        setError('Erro de rede ou configuração. Tente novamente.');
      }
    } finally {
      setLoadingPix(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (amount >= 20 && amount <= 1000) {
      await generatePix(amount);
    } else {
      setError('O valor do depósito deve estar entre R$ 20 e R$ 1.000.');
    }
  };

  const bonus = calculateBonus(Number(depositAmount));

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const updateUserCredits = (email: string, newCredits: number) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => {
      if (u.email === email) {
        return { ...u, credits: newCredits };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify({ ...user, credits: newCredits }));
  };

  return (
    <div className="glass-card p-6 rounded-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Wallet className="mr-2 text-green-400" />
        Realizar Depósito
      </h2>

      {error && (
        <div className="bg-pink-500/10 border border-pink-500 text-pink-500 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleDeposit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">
            Valor (R$ 20 - R$ 1.000)
          </label>
          <input
            type="number"
            min="20"
            max="1000"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
          />
        </div>

        <div className="bg-green-500/10 border border-green-500 p-4 rounded-lg">
          <p className="text-green-400">
            Bônus de Depósito: <strong>R$ {bonus.toFixed(2)}</strong>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Depositar
        </button>
      </form>

      {loadingPix && (
        <div className="mt-6 text-center">
          <p className="text-gray-300">Gerando QR Code PIX...</p>
        </div>
      )}

      {pixCode && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Pix Gerado</h3>
          {qrCode && <img src={qrCode} alt="QR Code Pix" className="w-64 h-64 mx-auto" />}
          <p className="mt-4 text-gray-300">Escaneie o código ou copie o código abaixo para pagar.</p>
          <div className="mt-4">
            <pre
              className="text-sm text-gray-300 bg-gray-800 p-4 rounded-lg cursor-pointer whitespace-pre-wrap break-words"
              onClick={() => copyToClipboard(pixCode)}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            >
              {pixCode}
            </pre>
            {copySuccess && (
              <p className="text-green-400 text-sm mt-2">Código copiado!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
