import { get, writable } from 'svelte/store';
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
    const { apiUrl } = await apiClient.get<{ apiUrl: string }>('/config.json');
    configStore.set({ apiUrl, loading: false, error: null });
    loaded = true;
  } catch (e) {
    configStore.set({
      apiUrl: '',
      loading: false,
      error: e instanceof Error ? e.message : 'Config error',
    });
  }
};

export const apiUrl = (): string => {
  return get(configStore).apiUrl;
};
