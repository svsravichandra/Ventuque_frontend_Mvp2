import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USER_ID = process.env.NEXT_PUBLIC_USER_ID || 'test-user-123';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': USER_ID
            },
            timeout: 10000
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: AxiosError): Error {
        if (error.response) {
            // Server responded with error
            const data = error.response.data as any;
            return new Error(data?.error?.message || 'An error occurred');
        } else if (error.request) {
            // Request made but no response
            return new Error('Network error. Please check your connection.');
        } else {
            // Something else happened
            return new Error(error.message || 'An unexpected error occurred');
        }
    }

    async get<T>(url: string, params?: any): Promise<T> {
        const response = await this.client.get(url, { params });
        return response.data.data;
    }

    async post<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.post(url, data);
        return response.data.data;
    }

    async patch<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.patch(url, data);
        return response.data.data;
    }

    async delete<T>(url: string): Promise<T> {
        const response = await this.client.delete(url);
        return response.data.data;
    }
}

export const apiClient = new ApiClient();
