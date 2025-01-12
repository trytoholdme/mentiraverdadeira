export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  credits: number;
  referralCode?: string;
  createdAt: string;
  inviteCode: string;
  document?: string; // Adicionar esta linha
}

export interface GameHistoryItem {
  date: string;
  result: 'win' | 'loss';
  amount: number;
}