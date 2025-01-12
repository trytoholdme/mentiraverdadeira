export interface Database {
  public: {
    Tables: {
      game_history: {
        Row: {
          id: string;
          user_id: string;
          result: 'win' | 'loss';
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          result: 'win' | 'loss';
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          result?: 'win' | 'loss';
          amount?: number;
          created_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string | null;
          code: string;
          status: 'pending' | 'completed';
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id?: string | null;
          code: string;
          status?: 'pending' | 'completed';
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referred_id?: string | null;
          code?: string;
          status?: 'pending' | 'completed';
          created_at?: string;
          completed_at?: string | null;
        };
      };
    };
  };
}