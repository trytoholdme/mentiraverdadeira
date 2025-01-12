import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Função para gerar código de indicação aleatório
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Função para salvar histórico de jogo
export async function saveGameHistory(userId: string, result: 'win' | 'loss', amount: number) {
  return await supabase
    .from('game_history')
    .insert([{ user_id: userId, result, amount }]);
}

// Função para buscar histórico de jogos do usuário
export async function getGameHistory(userId: string) {
  const { data } = await supabase
    .from('game_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

// Função para criar código de indicação
export async function createReferralCode(userId: string) {
  const code = generateReferralCode();
  await supabase
    .from('referrals')
    .insert([{ referrer_id: userId, code }]);
  return code;
}

// Função para buscar código de indicação do usuário
export async function getReferralCode(userId: string) {
  const { data } = await supabase
    .from('referrals')
    .select('code')
    .eq('referrer_id', userId)
    .single();
  return data?.code;
}

// Função para validar e usar código de indicação
export async function useReferralCode(code: string, newUserId: string) {
  const { data: referral } = await supabase
    .from('referrals')
    .select('*')
    .eq('code', code)
    .eq('status', 'pending')
    .single();

  if (referral) {
    await supabase
      .from('referrals')
      .update({ 
        referred_id: newUserId,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', referral.id);
    return true;
  }
  return false;
}