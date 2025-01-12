// Função para embaralhar array
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Função para gerar código de indicação
export function generateReferralCode(email: string): string {
  // Gera um código único baseado no email
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  const code = `${randomStr}${timestamp.slice(-3)}`.toUpperCase();
  
  // Salva o código no localStorage
  localStorage.setItem('referral-code-' + email, code);
  
  return code;
}