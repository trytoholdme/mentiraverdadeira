import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, DollarSign, Wallet, CreditCard, Send, History, PlayCircle, LogOut, TrendingUp, AlertCircle, Share2, UserPlus, CheckCircle } from 'lucide-react';
import type { User } from '../types';
import { shuffleArray } from '../lib/utils';
import Deposit from './Deposit'; // Importar o componente Deposit

// Banco de perguntas e respostas fáceis
const easyQuestionBank = [
  {
    description: "Qual é a cor do céu em um dia ensolarado?",
    options: [
      { id: 'A', text: "Azul" },
      { id: 'B', text: "Verde" },
      { id: 'C', text: "Roxo" }
    ],
    correctAnswer: 'A'
  },
  {
    description: "Quantos dias tem uma semana?",
    options: [
      { id: 'A', text: "5 dias" },
      { id: 'B', text: "7 dias" },
      { id: 'C', text: "10 dias" }
    ],
    correctAnswer: 'B'
  }
];

// Banco de perguntas extremamente difíceis
const hardQuestionBank = [
  {
    description: "Qual é a constante de acoplamento da força forte em uma interação quântica específica?",
    options: [
      { id: 'A', text: "0.1181" },
      { id: 'B', text: "0.2319" },
      { id: 'C', text: "0.1427" }
    ],
    correctAnswer: 'D'
  },
  {
    description: "Qual é a solução da equação de Schrödinger para um potencial de poço infinito tridimensional?",
    options: [
      { id: 'A', text: "Ψ(x,y,z) = A sin(kx x) sin(ky y) sin(kz z)" },
      { id: 'B', text: "Ψ(x,y,z) = B cos(kx x) cos(ky y) cos(kz z)" },
      { id: 'C', text: "Ψ(x,y,z) = C exp(-kx x) exp(-ky y) exp(-kz z)" }
    ],
    correctAnswer: 'D'
  },
  {
    description: "Qual é a função de onda do estado fundamental de um oscilador harmônico quântico?",
    options: [
      { id: 'A', text: "Ψ(x) = (mω/πħ)^(1/4) exp(-mωx²/2ħ)" },
      { id: 'B', text: "Ψ(x) = (mω/πħ)^(1/4) exp(-mωx²/ħ)" },
      { id: 'C', text: "Ψ(x) = (mω/πħ)^(1/2) exp(-mωx²/2ħ)" }
    ],
    correctAnswer: 'D'
  },
  
  {
    description: "Qual é a solução da equação de Schrödinger para um potencial de poço infinito tridimensional?",
    options: [
      { id: 'A', text: "Ψ(x,y,z) = A sin(kx x) sin(ky y) sin(kz z)" },
      { id: 'B', text: "Ψ(x,y,z) = B cos(kx x) cos(ky y) cos(kz z)" },
      { id: 'C', text: "Ψ(x,y,z) = C exp(-kx x) exp(-ky y) exp(-kz z)" }
    ],
    correctAnswer: 'D'
  },
  
 {
  "description": "Qual é a função de onda associada a um estado excitado no potencial de poço infinito unidimensional?",
  "options": [
    { "id": "A", "text": "Ψ(x) = A sin(kx) exp(-αx)" },
    { "id": "B", "text": "Ψ(x) = A cos(kx) exp(-βx)" },
    { "id": "C", "text": "Ψ(x) = A sin(kx) + B cos(kx)" }
  ],
  "correctAnswer": "D"
},

 {
  "description": "Qual é a solução da equação de campo de Einstein para um espaço-tempo esférico simétrico, sem carga elétrica ou massa?",
  "options": [
    { "id": "A", "text": "Métrica de Schwarzschild" },
    { "id": "B", "text": "Métrica de Kerr" },
    { "id": "C", "text": "Métrica de Friedmann-Lemaître" }
  ],
  "correctAnswer": "d"
},

{
  "description": "Na teoria das cordas, qual é o número mínimo de dimensões necessárias para a consistência da teoria?",
  "options": [
    { "id": "A", "text": "10 dimensões" },
    { "id": "B", "text": "11 dimensões" },
    { "id": "C", "text": "26 dimensões" }
  ],
  "correctAnswer": "D"
},

{
  "description": "No contexto da mecânica estatística, qual é a expressão para a função de partição no modelo de Ising em duas dimensões?",
  "options": [
    { "id": "A", "text": "Z = sum(exp(-βE)) para todos os estados possíveis" },
    { "id": "B", "text": "Z = sum(exp(-Jβ)) para todas as orientações de spins" },
    { "id": "C", "text": "Z = exp(-βJsum(s1s2))" }
  ],
  "correctAnswer": "D"
},

{
  "description": "Qual é a solução da equação de Friedmann para um universo fechado, sem matéria escura, com constante cosmológica λ positiva?",
  "options": [
    { "id": "A", "text": "R(t) = R₀ exp(Ht)" },
    { "id": "B", "text": "R(t) = R₀ cos(ωt)" },
    { "id": "C", "text": "R(t) = R₀ (t₀ - t)^(1/2)" }
  ],
  "correctAnswer": "D"
},

{
  "description": "Qual é a expressão para a entropia de um sistema de partículas no limite de alta temperatura, usando a distribuição de Boltzmann?",
  "options": [
    { "id": "A", "text": "S = k_B ln(Ω)" },
    { "id": "B", "text": "S = -k_B sum(p_i ln p_i)" },
    { "id": "C", "text": "S = k_B ln(e^(-βH))" }
  ],
  "correctAnswer": "D"
},

{
  "description": "Qual é a expressão para a entropia de um sistema de partículas no limite de alta temperatura, usando a distribuição de Boltzmann?",
  "options": [
    { "id": "A", "text": "S = k_B ln(Ω)" },
    { "id": "B", "text": "S = -k_B sum(p_i ln p_i)" },
    { "id": "C", "text": "S = k_B ln(e^(-βH))" }
  ],
  "correctAnswer": "D"
}

{
  "description": "Qual é a razão para a existência da barreira de Coulomb na fusão nuclear?",
  "options": [
    { "id": "A", "text": "Devido à repulsão eletrostática entre os núcleos" },
    { "id": "B", "text": "Devido à interação nuclear forte" },
    { "id": "C", "text": "Devido à interação gravitacional entre os núcleos" }
  ],
  "correctAnswer": "D"
},







  
];

interface GameProps {
  credits: number;
  onCreditChange: (newCredits: number) => void;
  onBack: () => void;
  user: User;
}

interface Question {
  description: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

export default function Game({ credits, onCreditChange, onBack, user }: GameProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'playing' | 'deposit' | 'withdraw' | 'history' | 'invite'>('dashboard');
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'completed'>('betting');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(() => shuffleArray(easyQuestionBank));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('30');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState<'cpf' | 'email' | 'telefone'>('cpf');
  const [pixName, setPixName] = useState('');
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [gameHistory, setGameHistory] = useState<{date: string; result: 'win' | 'loss'; amount: number}[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [gameAudio, setGameAudio] = useState<{ correct: HTMLAudioElement; wrong: HTMLAudioElement; coin: HTMLAudioElement } | null>(null);

  useEffect(() => {
    const correctSound = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3');
    const wrongSound = new Audio('https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3');
    const coinSound = new Audio('https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3');

    Promise.all([
      correctSound.load(),
      wrongSound.load(),
      coinSound.load()
    ]).then(() => {
      setGameAudio({
        correct: correctSound,
        wrong: wrongSound,
        coin: coinSound
      });
    });

    setInviteCode(`INVITE-${user.id}-${new Date().getTime()}`);

    return () => {
      correctSound.remove();
      wrongSound.remove();
      coinSound.remove();
    };
  }, [user.id]);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://mentiraverdadeira.com/invite?code=${inviteCode}`);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 3000);
  };

  const handleBetSubmit = () => {
    if (betAmount > 0 && betAmount <= credits) {
      setGameState('playing');
    }
  };

  const handleAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowResult(true);

    const isCorrect = answerId === questions[currentQuestionIndex].correctAnswer;
    const newGameHistoryItem = {
      date: new Date().toISOString(),
      result: isCorrect ? 'win' : 'loss',
      amount: isCorrect ? betAmount : -betAmount
    };

    setGameHistory(prev => [newGameHistoryItem, ...prev]);

    if (isCorrect) {
      gameAudio?.correct.play()
        .then(() => gameAudio?.coin.play())
        .catch(console.error);
      onCreditChange(credits + betAmount);
    } else {
      gameAudio?.wrong.play().catch(console.error);
      onCreditChange(Math.max(0, credits - betAmount));
    }

    if (currentQuestionIndex === questions.length - 1) {
      setGameState('completed');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setGameState('playing');
    } else {
      setGameState('completed');
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (amount >= 30 && amount <= credits) {
      setShowWithdrawConfirm(true);
    }
  };

  const confirmWithdraw = () => {
    const amount = Number(withdrawAmount);
    onCreditChange(credits - amount);
    setShowWithdrawConfirm(false);
    setCurrentView('dashboard');
  };

  const handleDepositSuccess = () => {
    // Lógica a ser executada após o sucesso do depósito
    console.log('Depósito realizado com sucesso!');
  };

  const renderGameContent = () => {
    if (gameState === 'betting') {
      return (
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Escolha o valor do seu prêmio</h3>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max={credits}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-gray-300">
              <span>R$ 1,00</span>
              <span>R$ {betAmount.toFixed(2)}</span>
              <span>R$ {credits.toFixed(2)}</span>
            </div>
            <div className="bg-green-500/10 border border-green-500 p-4 rounded-lg">
              <p className="text-green-400">
                Se acertar: <strong>+R$ {betAmount.toFixed(2)}</strong>
              </p>
              <p className="text-pink-400">
                Se errar: <strong>-R$ {betAmount.toFixed(2)}</strong>
              </p>
            </div>
            <button
              onClick={handleBetSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Confirmar Aposta
            </button>
          </div>
        </div>
      );
    }

    if (gameState === 'completed') {
      return (
        <div className="glass-card p-6 rounded-xl text-center">
          <div className="flex items-center justify-center mb-6">
            <Brain size={48} className="text-green-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Parabéns!</h2>
          </div>
          <p className="text-lg text-gray-300 mb-6">
            Você completou as perguntas iniciais! Para continuar jogando, faça um depósito mínimo de R$ 20,00.
          </p>
          <button
            onClick={() => setCurrentView('deposit')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Fazer Depósito
          </button>
        </div>
      );
    }

    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Brain size={32} className="text-green-400" />
          <h2 className="text-2xl font-bold text-white">{questions[currentQuestionIndex].description}</h2>
        </div>

        <div className="space-y-4">
          {questions[currentQuestionIndex].options.map((option) => (
            <button
              key={option.id}
              onClick={() => !showResult && handleAnswer(option.id)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-102 ${
                showResult
                  ? option.id === questions[currentQuestionIndex].correctAnswer
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : option.id === selectedAnswer
                    ? 'bg-pink-500/20 border-2 border-pink-500'
                    : 'bg-gray-900/50'
                  : 'bg-gray-900/50 hover:bg-green-500/10 hover:shadow-md border border-green-500/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center font-bold">
                  {option.id}
                </span>
                <span className="text-white font-medium">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-8 text-center">
            <p className={`text-lg font-semibold ${
              selectedAnswer === questions[currentQuestionIndex - 1]?.correctAnswer ? 'text-green-400' : 'text-pink-400'
            }`}>
              {selectedAnswer === questions[currentQuestionIndex - 1]?.correctAnswer
                ? `🎉 Parabéns! Você ganhou R$ ${betAmount.toFixed(2)}!`
                : `😢 Que pena! Você perdeu R$ ${betAmount.toFixed(2)}.`}
            </p>
            {currentQuestionIndex < questions.length && (
              <button
                onClick={handleNextQuestion}
                className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Próxima Pergunta
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSidebar = () => (
    <div className="md:w-64 glass-card rounded-xl">
      <div className="flex items-center justify-between p-4 glass-card rounded-lg md:mb-4">
        <span className="text-gray-300">Saldo</span>
        <span className="text-green-400 font-bold">R$ {credits.toFixed(2)}</span>
      </div>
      
      <nav className="grid grid-cols-3 md:grid-cols-1 gap-2 p-2">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-3 p-3 rounded-lg transition-colors ${
            currentView === 'dashboard' ? 'bg-green-500/20 text-green-400' : 'hover:bg-green-500/10 text-gray-300'
          }`}
        >
          <TrendingUp size={20} />
          <span className="text-xs md:text-base">Dashboard</span>
        </button>
        
        <button
          onClick={() => setCurrentView('playing')}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-3 p-3 rounded-lg transition-colors ${
            currentView === 'playing' ? 'bg-green-500/20 text-green-400' : 'hover:bg-green-500/10 text-gray-300'
          }`}
        >
          <PlayCircle size={20} />
          <span className="text-xs md:text-base">Jogar</span>
        </button>

        <button
          onClick={() => setCurrentView('deposit')}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-3 p-3 rounded-lg transition-colors ${
            currentView === 'deposit' ? 'bg-green-500/20 text-green-400' : 'hover:bg-green-500/10 text-gray-300'
          }`}
        >
          <Wallet size={20} />
          <span className="text-xs md:text-base">Depositar</span>
        </button>

        <button
          onClick={() => setCurrentView('withdraw')}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-3 p-3 rounded-lg transition-colors ${
            currentView === 'withdraw' ? 'bg-green-500/20 text-green-400' : 'hover:bg-green-500/10 text-gray-300'
          }`}
        >
          <Send size={20} />
          <span className="text-xs md:text-base">Sacar</span>
        </button>

        <button
          onClick={() => setCurrentView('history')}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-3 p-3 rounded-lg transition-colors ${
            currentView === 'history' ? 'bg-green-500/20 text-green-400' : 'hover:bg-green-500/10 text-gray-300'
          }`}
        >
          <History size={20} />
          <span className="text-xs md:text-base">Histórico</span>
        </button>

        <button
          onClick={() => setCurrentView('invite')}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-3 p-3 rounded-lg transition-colors ${
            currentView === 'invite' ? 'bg-green-500/20 text-green-400' : 'hover:bg-green-500/10 text-gray-300'
          }`}
        >
          <UserPlus size={20} />
          <span className="text-xs md:text-base">Indique</span>
        </button>

        <button
          onClick={onBack}
          className="flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-3 p-3 rounded-lg text-gray-300 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-xs md:text-base">Sair</span>
        </button>
      </nav>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="space-y-6 p-4">
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Saldo Atual</span>
                    <DollarSign className="text-green-400" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-white">R$ {credits.toFixed(2)}</p>
                </div>
                
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Ganhos Hoje</span>
                    <TrendingUp className="text-green-400" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    R$ {gameHistory
                      .filter(game => new Date(game.date).toDateString() === new Date().toDateString())
                      .reduce((acc, game) => acc + (game.result === 'win' ? game.amount : 0), 0)
                      .toFixed(2)}
                  </p>
                </div>
                
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Total de Jogos</span>
                    <Brain className="text-green-400" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-white">{gameHistory.length}</p>
                </div>
              </div>

              <div className="flex gap-4 md:hidden">
                <button
                  onClick={() => setCurrentView('playing')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl flex items-center justify-center space-x-2"
                >
                  <PlayCircle size={20} />
                  <span>Jogar Agora</span>
                </button>
                <button
                  onClick={() => setCurrentView('deposit')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl flex items-center justify-center space-x-2"
                >
                  <Wallet size={20} />
                  <span>Depositar</span>
                </button>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">Últimas Atividades</h3>
                <div className="space-y-3">
                  {gameHistory.map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass-card rounded-lg">
                      <div>
                        <p className="text-gray-300">{new Date(game.date).toLocaleDateString()}</p>
                        <p className={game.result === 'win' ? 'text-green-400' : 'text-pink-400'}>
                          {game.result === 'win' ? 'Vitória' : 'Derrota'}
                        </p>
                      </div>
                      <p className={`font-bold ${game.result === 'win' ? 'text-green-400' : 'text-pink-400'}`}>
                        {game.amount > 0 ? '+' : ''}{game.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">Indique e Ganhe</h3>
                <p className="text-gray-300 mb-4">Convide seus amigos para jogar e ganhe créditos!</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://mentiraverdadeira.com/invite?code=${inviteCode}`}
                    className="flex-1 p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Copiar
                  </button>
                </div>
                {showCopyMessage && (
                  <div className="flex items-center space-x-2 mt-2 text-green-400">
                    <CheckCircle size={20} />
                    <span>Link copiado!</span>
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'playing':
        return renderGameContent();

      case 'deposit':
        return <Deposit onDepositSuccess={handleDepositSuccess} user={user} onCreditChange={onCreditChange} />;

      case 'withdraw':
        return (
          <div className="glass-card p-6 rounded-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Send className="mr-2 text-green-400" />
              Realizar Saque
            </h2>

            {showWithdrawConfirm ? (
              <div className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-500 mb-2">
                    <AlertCircle size={20} />
                    <h3 className="font-semibold">Confirme seus dados</h3>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Valor:</strong> R$ {withdrawAmount}</p>
                    <p><strong>Chave PIX ({pixKeyType}):</strong> {pixKey}</p>
                    <p><strong>Nome:</strong> {pixName}</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowWithdrawConfirm(false)}
                    className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={confirmWithdraw}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Confirmar Saque
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Valor (Mínimo R$ 30)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max={credits}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Tipo de Chave PIX
                  </label>
                  <select
                    value={pixKeyType}
                    onChange={(e) => setPixKeyType(e.target.value as 'cpf' | 'email' | 'telefone')}
                    className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  >
                    <option value="cpf">CPF</option>
                    <option value="email">Email</option>
                    <option value="telefone">Telefone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Chave PIX
                  </label>
                  <input
                    type={pixKeyType === 'email' ? 'email' : 'text'}
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
                    placeholder={
                      pixKeyType === 'cpf' ? '000.000.000-00' :
                      pixKeyType === 'email' ? 'seu@email.com' :
                      '(00) 00000-0000'
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={pixName}
                    onChange={(e) => setPixName(e.target.value)}
                    className="w-full p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
                    placeholder="Nome completo igual ao CPF"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sacar
                </button>
              </form>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <History className="mr-2 text-green-400" />
              Histórico de Jogos
            </h2>

            <div className="space-y-3">
              {gameHistory.map((game, index) => (
                <div key={index} className="flex items-center justify-between p-4 glass-card rounded-lg">
                  <div>
                    <p className="text-gray-300">{new Date(game.date).toLocaleDateString()}</p>
                    <p className={game.result === 'win' ? 'text-green-400' : 'text-pink-400'}>
                      {game.result === 'win' ? 'Vitória' : 'Derrota'}
                    </p>
                  </div>
                  <p className={`font-bold ${game.result === 'win' ? 'text-green-400' : 'text-pink-400'}`}>
                    {game.amount > 0 ? '+' : ''}{game.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'invite':
        return (
          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-4">Indique e Ganhe</h3>
            <p className="text-gray-300 mb-4">Convide seus amigos para jogar e ganhe créditos!</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={`https://mentiraverdadeira.com/invite?code=${inviteCode}`}
                className="flex-1 p-3 bg-gray-900/50 border border-green-500/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
              />
              <button
                onClick={handleCopyInviteLink}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Copiar
              </button>
            </div>
            {showCopyMessage && (
              <div className="flex items-center space-x-2 mt-2 text-green-400">
                <CheckCircle size={20} />
                <span>Link copiado!</span>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {renderSidebar()}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}
