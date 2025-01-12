import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Brain, LogIn, UserPlus, HelpCircle, Shield, Lock, Sparkles, Lightbulb, Coins, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import GameRules from './components/GameRules';
import Game from './components/Game';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { User } from './types';
import { saveUserState, loadUserState, clearUserState } from './lib/auth';

export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'login' | 'register' | 'rules' | 'game' | 'admin'>('welcome');
  const [credits, setCredits] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Adicionar usuário comum com saldo de 1200 reais ao localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const commonUser = users.find((user: User) => user.email === 'commonuser@example.com');
    if (!commonUser) {
      users.push({
        name: 'Common User',
        email: 'commonuser@example.com',
        password: 'commonpassword',
        credits: 1200,
        referralCode: 'common123',
        isAdmin: false,
      });
      localStorage.setItem('users', JSON.stringify(users));
    }

    const savedUser = loadUserState();
    if (savedUser) {
      setCurrentUser(savedUser);
      setCredits(savedUser.credits);
      setCurrentView('game');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCredits(user.credits);
    setCurrentView('game');
    saveUserState(user);
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
    setCredits(user.credits);
    setCurrentView('game');
    saveUserState(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCredits(0);
    setCurrentView('welcome');
    clearUserState();
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onBack={() => setCurrentView('welcome')} onSuccess={handleLogin} onAdminSuccess={() => setCurrentView('admin')} />;
      case 'register':
        return <Register onBack={() => setCurrentView('welcome')} onSuccess={handleRegister} />;
      case 'rules':
        return <GameRules onBack={() => setCurrentView('welcome')} />;
      case 'game':
        if (!currentUser) {
          setCurrentView('welcome');
          return null;
        }
        return (
          <Game 
            credits={credits} 
            onCreditChange={setCredits} 
            onBack={handleLogout}
            user={currentUser}
          />
        );
      case 'admin':
        return <AdminDashboard onBack={() => setCurrentView('welcome')} />;
      default:
        return (
          <div className="space-y-12 md:space-y-20 text-center relative z-10">
            <div className="relative px-4 pt-8 md:pt-16">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-500/20 blur-3xl"></div>
              <div className="relative max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="flex items-center justify-center space-x-4 animate-title">
                    <Brain size={48} className="text-green-400 animate-brain" />
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500 neon-text">
                      Mentira Verdadeira
                    </h1>
                  </div>
                  
                  <p className="text-lg md:text-xl text-gray-300 max-w-lg slide-in px-4">
                    Ganhe R$ 5,00 ao se cadastrar e mais R$ 1,00 por acerto! 
                    <span className="block text-sm md:text-base mt-2 text-green-400">
                      Use seu conhecimento para ganhar dinheiro de verdade!
                    </span>
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
                    <div className="flex items-center space-x-2 text-green-400 glass-card px-3 py-1.5 rounded-full text-sm">
                      <Shield size={16} />
                      <span>100% Seguro</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400 glass-card px-3 py-1.5 rounded-full text-sm">
                      <Sparkles size={16} />
                      <span>Pagamento Instantâneo</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400 glass-card px-3 py-1.5 rounded-full text-sm">
                      <Lock size={16} />
                      <span>Dados Protegidos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 max-w-md mx-auto px-4">
              <button
                onClick={() => setCurrentView('login')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-3 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center space-x-2 text-white">
                  <LogIn size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Entrar</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('register')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-3 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center space-x-2 text-white">
                  <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Ganhe R$ 5,00</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
              {[
                { icon: Lightbulb, title: "Ganhe Pensando", desc: "Use sua inteligência e conhecimento para ganhar dinheiro real enquanto se diverte!" },
                { icon: Shield, title: "Sistema Seguro", desc: "Plataforma 100% protegida com criptografia e pagamentos verificados!" },
                { icon: Coins, title: "Saque Rápido", desc: "Receba seus ganhos instantaneamente na sua conta após cada conquista!" }
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="glass-card hover-card p-5 md:p-6 rounded-xl">
                  <Icon className="mx-auto text-green-400 w-10 h-10 mb-3 animate-float" />
                  <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto glass-card p-5 md:p-6 animate-glow mx-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                <Brain className="mr-2 text-green-400" />
                Exemplo de Desafio
              </h3>
              <div className="text-left space-y-3">
                <p className="text-gray-300 text-base">Qual destas afirmações sobre o Brasil é verdadeira?</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-green-400 glass-card p-3 rounded-lg">
                    <CheckCircle size={18} />
                    <p className="text-sm">O Brasil é o maior país da América do Sul</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 bg-gray-700/20 p-3 rounded-lg">
                    <XCircle size={18} />
                    <p className="text-sm">O Brasil tem 27 estados</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 bg-gray-700/20 p-3 rounded-lg">
                    <XCircle size={18} />
                    <p className="text-sm">A capital do Brasil é São Paulo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Perguntas Frequentes</h2>
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card rounded-xl overflow-hidden">
                  <button
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-green-500/5 transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="font-medium text-white">{faq.question}</span>
                    <ChevronDown
                      className={`text-green-400 transition-transform ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`accordion-content ${
                      openFaqIndex === index ? 'block' : 'hidden'
                    }`}
                    data-open={openFaqIndex === index}
                  >
                    <p className="px-4 pb-4 text-gray-300 text-sm">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('rules')}
              className="flex items-center justify-center space-x-2 text-gray-300 mx-auto hover:text-green-400 transition-colors group mb-8"
            >
              <HelpCircle size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="group-hover:underline text-sm">Ver Regras Completas</span>
            </button>
          </div>
        );
    }
  };

  return (
    <Router>
      <Switch>
        <Route path="/register">
          <Register onBack={() => {}} onSuccess={handleRegister} />
        </Route>
        <Route path="/login">
          <Login onBack={() => {}} onSuccess={handleLogin} />
        </Route>
        <Route path="/admin/login">
          <AdminLogin onBack={() => {}} onSuccess={() => setCurrentView('admin')} />
        </Route>
        <Route path="/admin/dashboard">
          <AdminDashboard onBack={() => setCurrentView('welcome')} />
        </Route>
        <Route path="/">
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 relative">
            <div className="absolute inset-0 matrix-bg"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/5"></div>
            <div className="container mx-auto py-4 md:py-8 relative flex-grow">
              {renderView()}
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

