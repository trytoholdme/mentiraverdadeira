import React, { useState } from 'react';
import axios from 'axios';
import { Wallet } from 'lucide-react'; // Importar o ícone wallet
import type { User } from '../types';

interface DepositProps {
  onDepositSuccess?: () => void; // Tornar opcional para evitar erro
  user: User; // Adicionar o usuário logado como prop
  onCreditChange: (newCredits: number) => void;
}

export default function Deposit({ onDepositSuccess, user, onCreditChange }: DepositProps) {
  const [depositAmount, setDepositAmount] = useState('20');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null); // Adicionar estado de erro

  const calculateBonus = (amount: number) => {
    return amount * 0.5;
  };

  const generatePix = async (amount: number) => {
    setLoadingPix(true);
    setPixGenerated(false);
    setError(null);

    // Verifica se os dados do cliente estão completos
    if (!user.name || !user.email || !user.phone || !user.document) {
      setError('Dados do cliente estão incompletos. Verifique nome, e-mail, telefone e documento.');
      setLoadingPix(false);
      return;
    }

    const requestData = {
      amount: amount * 100, // Valor em centavos
      paymentMethod: 'pix', // Corrigido para 'paymentMethod'
      customer: {
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
        phone: user.phone.trim().replace(/\D/g, ''),
        document: user.document.trim().replace(/\D/g, ''),
      },
      items: [
        {
          title: 'Depósito Mentira Verdadeira', // Adicionando o campo 'title'
          unitPrice: amount * 100, // 'unitPrice' deve ser o valor em centavos
          quantity: 1, // 'quantity' deve ser um inteiro
          tangible: true, // 'tangible' deve ser um valor booleano
        },
      ],
      pix: {
        expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Formato ISO 8601
      },
      metadata: {
        description: 'Depósito Mentira Verdadeira',
      },
    };

    console.log('Payload enviado à API:', JSON.stringify(requestData, null, 2));

    // Codificar a chave secreta com base64 (sem a necessidade de btoa)
    const secretKey = "sk_live_UvCzy852ZMMdg9XG8uTsu1AnJrBRjjXEMgRsVjUVOR";
    const encodedSecretKey = btoa(`${secretKey}:x`); // Adicionando ":x" conforme a documentação

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
      setQrCode(response.data.pix.qrcode);
      setPixGenerated(true);

      setTimeout(() => {
        const bonus = calculateBonus(amount);
        onCreditChange(user.credits + amount + bonus);
        if (onDepositSuccess) {
          onDepositSuccess();
        }
      }, 5000);
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

      {pixGenerated && qrCode && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-white mb-4">QR Code PIX</h3>
          <img src={qrCode} alt="QR Code PIX" className="mx-auto mb-4" />
          <p className="text-gray-300">Escaneie o QR code acima para realizar o pagamento.</p>
        </div>
      )}
    </div>
  );
}
