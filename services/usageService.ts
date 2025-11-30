// Usage tracking and subscription management service

export type PlanType = 'free' | 'pro' | 'lifetime';

export interface UserState {
  plan: PlanType;
  dailyUsage: number;
  lastUsageDate: string;
  email?: string;
  subscriptionId?: string;
}

const STORAGE_KEY = 'etsy_optimizer_user';
const DAILY_FREE_LIMIT = 3;

const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getUserState = (): UserState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as UserState;
      // Reset daily usage if it's a new day
      if (state.lastUsageDate !== getToday()) {
        state.dailyUsage = 0;
        state.lastUsageDate = getToday();
        saveUserState(state);
      }
      return state;
    }
  } catch (e) {
    console.error('Error reading user state:', e);
  }

  // Default state for new users
  return {
    plan: 'free',
    dailyUsage: 0,
    lastUsageDate: getToday()
  };
};

export const saveUserState = (state: UserState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving user state:', e);
  }
};

export const canGenerate = (): boolean => {
  const state = getUserState();
  if (state.plan === 'pro' || state.plan === 'lifetime') {
    return true;
  }
  return state.dailyUsage < DAILY_FREE_LIMIT;
};

export const getRemainingGenerations = (): number => {
  const state = getUserState();
  if (state.plan === 'pro' || state.plan === 'lifetime') {
    return Infinity;
  }
  return Math.max(0, DAILY_FREE_LIMIT - state.dailyUsage);
};

export const incrementUsage = (): void => {
  const state = getUserState();
  state.dailyUsage += 1;
  state.lastUsageDate = getToday();
  saveUserState(state);
};

export const isPremium = (): boolean => {
  const state = getUserState();
  return state.plan === 'pro' || state.plan === 'lifetime';
};

export const hasEmail = (): boolean => {
  const state = getUserState();
  return !!state.email;
};

export const getEmail = (): string | undefined => {
  const state = getUserState();
  return state.email;
};

export const setEmail = (email: string): void => {
  const state = getUserState();
  state.email = email;
  saveUserState(state);
};

export const upgradeToPlan = (plan: 'pro' | 'lifetime', email?: string): void => {
  const state = getUserState();
  state.plan = plan;
  if (email) {
    state.email = email;
  }
  saveUserState(state);
};

// Stripe Payment Links
// Redirect URLs configured in Stripe:
// Pro: https://etsy-design-optimizer.vercel.app/?plan=pro
// Lifetime: https://etsy-design-optimizer.vercel.app/?plan=lifetime
export const STRIPE_LINKS = {
  pro: 'https://buy.stripe.com/9B6fZa8AtcWIeZKfgQ3gk01',
  lifetime: 'https://buy.stripe.com/fZu9AM6slaOA3h27Oo3gk02'
};

// Stripe is now configured and ready
const USE_STRIPE = true;

export const initiateCheckout = (plan: 'pro' | 'lifetime'): void => {
  console.log(`Initiating checkout for ${plan} plan`);

  if (USE_STRIPE && STRIPE_LINKS[plan] && !STRIPE_LINKS[plan].includes('_HERE')) {
    // Production: Redirect to Stripe Payment Link
    window.location.href = STRIPE_LINKS[plan];
  } else {
    // Demo mode: instant upgrade for testing
    if (confirm(`Demo Mode: Upgrade to ${plan} plan?\n\nIn production, this will redirect to Stripe checkout.\n\nClick OK to simulate a successful purchase.`)) {
      upgradeToPlan(plan);
      // Redirect to success page with plan param
      window.location.href = `${window.location.origin}/?plan=${plan}`;
    }
  }
};
