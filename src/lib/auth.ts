import { User } from '../types';

// Simula um banco de dados local usando localStorage
const USERS_KEY = 'mentira-verdadeira-users';
const USER_STATE_KEY = 'mentira-verdadeira-user-state';
const adminEmail = 'admin@mentiraverdadeira.com';
const adminPassword = 'admin123';

export function getUsers(): User[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.email === email);
}

export function validateCredentials(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Remove a senha antes de retornar o usuário
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

export async function createUser(
  email: string,
  password: string,
  inviteCode?: string,
  additionalData?: {
    name: string;
    phone: string;
    document: string;
  }
): Promise<User | null> {
  const users = getUsers();
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    throw new Error('Usuário já existe');
  }

  let credits = 5;
  if (inviteCode) {
    const inviter = users.find(user => user.inviteCode === inviteCode);
    if (inviter) {
      inviter.credits += 5;
      credits += 5;
    }
  }

  const newUser: User = {
    id: `${users.length + 1}`,
    email,
    password,
    credits,
    name: additionalData?.name || '',
    phone: additionalData?.phone || '',
    document: additionalData?.document || '',
    createdAt: new Date().toISOString(),
    inviteCode: `INVITE-${users.length + 1}`,
  };

  saveUser(newUser);
  return newUser;
}

export function addCreditsToUser(email: string, amount: number): boolean {
  const users = getUsers();
  const user = users.find(user => user.email === email);
  if (user) {
    user.credits += amount;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  }
  return false;
}

export function isAdmin(email: string, password: string): boolean {
  return email === adminEmail && password === adminPassword;
}

export function validateReferralCode(code: string): boolean {
  // Verifica se o código existe em algum usuário
  const users = getUsers();
  for (const user of users) {
    const userCode = localStorage.getItem('referral-code-' + user.email);
    if (userCode === code) {
      return true;
    }
  }
  return false;
}

export function addReferralBonus(code: string, newUserEmail: string): void {
  const users = getUsers();
  
  // Encontra o usuário que fez a indicação
  for (const user of users) {
    const userCode = localStorage.getItem('referral-code-' + user.email);
    if (userCode === code) {
      // Adiciona o bônus
      user.credits = (user.credits || 0) + 5;
      
      // Salva a lista atualizada
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      break;
    }
  }
}

export function saveUserState(user: User): void {
  localStorage.setItem(USER_STATE_KEY, JSON.stringify(user));
}

export function loadUserState(): User | null {
  const userState = localStorage.getItem(USER_STATE_KEY);
  return userState ? JSON.parse(userState) : null;
}

export function clearUserState(): void {
  localStorage.removeItem(USER_STATE_KEY);
}