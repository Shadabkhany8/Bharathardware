import { Platform } from 'react-native';
import { Config } from '@/constants/config';
import { Storage } from '@/utils/storage';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string>;
  timestamp?: string;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

let activeApiUrl = Config.defaultApiUrl;

export const getApiBaseUrl = (): string => activeApiUrl;

export const setApiBaseUrl = async (newUrl: string): Promise<void> => {
  activeApiUrl = newUrl.replace(/\/+$/, '');
  await Storage.setItem(Config.storageKeys.customApiUrl, activeApiUrl);
};

// Initialize custom URL if previously saved
(async () => {
  const savedUrl = await Storage.getItem(Config.storageKeys.customApiUrl);
  if (savedUrl) {
    activeApiUrl = savedUrl;
  }
})();

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    requiresAuth = false,
  } = options;

  const url = `${activeApiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...customHeaders,
  };

  if (requiresAuth) {
    const token = await Storage.getItem(Config.storageKeys.authToken);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const fetchConfig: RequestInit = {
    method,
    headers,
  };

  if (body) {
    fetchConfig.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, fetchConfig);
  } catch {
    throw new ApiError(
      `Network error connecting to ${activeApiUrl}. Please verify server is running.`,
      0
    );
  }

  let json: any = null;
  const text = await response.text();
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (!response.ok) {
    const message = json?.message || `Request failed with status ${response.status}`;
    const errors = json?.errors;
    throw new ApiError(message, response.status, errors);
  }

  // If response wraps data in ApiResponse standard format
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }

  return json as T;
}

export async function uploadFile<T>(endpoint: string, fileUri: string, fieldName = 'file'): Promise<T> {
  const url = `${activeApiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const formData = new FormData();
  const filename = fileUri.split('/').pop() || 'product_photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase()}` : 'image/jpeg';

  if (Platform.OS === 'web') {
    const res = await fetch(fileUri);
    const blob = await res.blob();
    formData.append(fieldName, blob, filename);
  } else {
    formData.append(fieldName, {
      uri: fileUri,
      name: filename,
      type,
    } as any);
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  const token = await Storage.getItem(Config.storageKeys.authToken);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch {
    throw new ApiError(
      `Network error connecting to ${activeApiUrl}. Please verify server is running.`,
      0
    );
  }

  const text = await response.text();
  let json: any = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (!response.ok) {
    const message = json?.message || `Upload failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }

  return json as T;
}
