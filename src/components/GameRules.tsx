import React from 'react';
import { ArrowLeft, Brain, CheckCircle2, XCircle } from 'lucide-react';

interface GameRulesProps {
  onBack: () => void;
}

export default function GameRules({ onBack }: GameRulesProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-gray-300 hover:text-green-400 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Voltar
      </button>

      <div className="glass-card p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
          <Brain className="mr-2 text-green-400" />
          Como Jogar
        </h2>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <CheckCircle2 className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Objetivo</h3>
              <p className="text-gray-300">
                Em cada rodada, você verá três afirmações. Apenas uma delas é verdadeira!
                Sua missão é identificar a afirmação correta.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <Brain className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Como Funciona</h3>
              <p className="text-gray-300">
                Leia atentamente cada afirmação e use sua intuição e conhecimento
                para escolher a resposta correta. As respostas são projetadas para
                serem dedutíveis através do raciocínio lógico.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <XCircle className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Exemplo</h3>
              <div className="glass-card p-4 rounded-lg">
                <p className="font-medium text-white mb-2">Qual é o oposto de quente?</p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">A)</span> frio
                    <span className="ml-2 text-green-400">(Resposta correta)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">B)</span> morno
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">C)</span> gelado
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}