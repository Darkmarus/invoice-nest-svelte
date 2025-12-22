// src/lib/apiClient.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private defaultHeaders: Record<string, string>;

  constructor(defaultHeaders: Record<string, string> = {}) {
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  private async request<T>(url: string, options: RequestInit = {}, retries: number = 3): Promise<T> {
    const config: RequestInit = {
      headers: this.defaultHeaders,
      ...options,
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const errorText = await response.text();
          throw new ApiError(response.status, errorText || response.statusText);
        }

        if (response.status === 204) {
          return undefined as T;
        }

        return await response.json();
      } catch (error) {
        if (attempt === retries || !(error instanceof TypeError)) {
          throw error;
        }
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }

    throw new Error('Max retries exceeded');
  }

  async get<T>(url: string, params?: Record<string, string | number | boolean>): Promise<T> {
    let fullUrl = url;
    if (params) {
      const urlObj = new URL(url, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          urlObj.searchParams.set(key, String(value));
        }
      });
      fullUrl = urlObj.href;
    }
    return this.request<T>(fullUrl, { method: 'GET' });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
