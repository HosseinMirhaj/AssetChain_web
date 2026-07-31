// API Client for AssetChain Express Backend

export const API_BASE = '/api';

export async function fetchAssetsFromBackend(category?: string) {
  try {
    const url = category && category !== 'all' ? `${API_BASE}/assets?category=${category}` : `${API_BASE}/assets`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch assets from backend');
    const data = await res.json();
    return data.assets;
  } catch (err) {
    console.warn('Backend connection warning, falling back to local dataset:', err);
    return null;
  }
}

export async function executeBuyOrder(assetId: string, shares: number, userEmail?: string) {
  try {
    const res = await fetch(`${API_BASE}/trades/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail || 'demo@assetchain.io'
      },
      body: JSON.stringify({ assetId, shares })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Buy order backend error:', err);
    return { success: false, error: 'Network connection error' };
  }
}

export async function executeSellOrder(assetId: string, shares: number, userEmail?: string) {
  try {
    const res = await fetch(`${API_BASE}/trades/sell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail || 'demo@assetchain.io'
      },
      body: JSON.stringify({ assetId, shares })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Sell order backend error:', err);
    return { success: false, error: 'Network connection error' };
  }
}

export async function getUserProfile(userEmail?: string) {
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: {
        'x-user-email': userEmail || 'demo@assetchain.io'
      }
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Get profile error:', err);
    return null;
  }
}
