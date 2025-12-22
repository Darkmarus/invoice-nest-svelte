import { writable } from 'svelte/store';
import { apiClient } from '../api/fetch_wrapper';

export interface ConfigState {
  apiUrl: string;
  loading: boolean;
  error: string | null;
}

export const configStore = writable<ConfigState>({
  apiUrl: '',
  loading: true,
  error: null,
});

let loaded = false;

export const loadConfig = async () => {
  if (loaded) return;
  configStore.set({ apiUrl: '', loading: true, error: null });
  try {
    const res = await fetch('/config.json');
    if (!res.ok) throw new Error('Config not found');
    const { apiUrl } = await res.json();
    configStore.set({ apiUrl, loading: false, error: null });
    apiClient.setBaseURL(apiUrl);
    loaded = true;
  } catch (e) {
    configStore.set({
      apiUrl: '',
      loading: false,
      error: e instanceof Error ? e.message : 'Config error',
    });
  }
};