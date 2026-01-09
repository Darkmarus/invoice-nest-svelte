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
  const [err, data] = await apiClient.get<{ apiUrl: string }>('/config.json');
  if (err) {
    configStore.set({
      apiUrl: '',
      loading: false,
      error: err.message,
    });
  } else {
    configStore.set({ apiUrl: data!.apiUrl, loading: false, error: null });
    loaded = true;
  }
};

export const apiUrl = (): string => {
  return get(configStore).apiUrl;
};

export const resolvedImages = (path: string) => {
  const filename = path.split('\\').pop()?.split('/').pop();
  return `${apiUrl()}/uploads/${filename}`;
};
