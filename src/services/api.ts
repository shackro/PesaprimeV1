// services/api.ts

// Types
export interface WalletData {
  balance: number;
  equity: number;
  currency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserCreate {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserCreate {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
}

export interface DepositRequest {
  amount: number;
  phone_number: string;
}

export interface WithdrawRequest {
  amount: number;
  phone_number: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  new_balance: number;
  new_equity: number;
  transaction_id: string;
}

export interface ApiError {
  message: string;
  detail?: string;
}

export interface UserInvestment {
  id: string;
  user_phone: string;
  asset_id: string;
  asset_name: string;
  invested_amount: number;
  current_value: number;
  units: number;
  entry_price: number;
  current_price: number;
  profit_loss: number;
  profit_loss_percentage: number;
  status: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_phone: string;
  activity_type: string;
  amount: number;
  description: string;
  timestamp: string;
  status: string;
}

export interface InvestmentRequest {
  asset_id: string;
  amount: number;
  phone_number: string;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: 'forex' | 'crypto' | 'stock' | 'commodity';
  current_price: number;
  change_percentage: number;
  moving_average: number;
  trend: 'up' | 'down';
  chart_url: string;
}

export interface PnLData {
  profit_loss: number;
  percentage: number;
  trend: 'up' | 'down';
}


class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:8000';
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
        console.log(`Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            let errorMessage = 'Request failed';
            try {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
                
                // Try to parse as JSON, but fallback to text
                try {
                    const errorData = JSON.parse(errorText);
                    
                    // Handle Pydantic validation errors specifically
                    if (errorData.detail && Array.isArray(errorData.detail)) {
                        // This is a Pydantic validation error
                        const validationErrors = errorData.detail.map((err: any) => 
                            `${err.loc.join('.')}: ${err.msg}`
                        );
                        errorMessage = `Validation error: ${validationErrors.join(', ')}`;
                    } else {
                        errorMessage = errorData.detail || errorData.message || errorText;
                    }
                } catch {
                    errorMessage = errorText || `HTTP error! status: ${response.status}`;
                }
            } catch (parseError) {
                errorMessage = `HTTP error! status: ${response.status}`;
            }
            
            console.error('Throwing error:', errorMessage);
            throw new Error(errorMessage);
        }
        
        try {
            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            throw new Error('Invalid JSON response from server');
        }
    }


  // Auth methods
  async register(userData: UserCreate): Promise<AuthResponse> {
        try {
            console.log('Attempting registration with:', userData);
            
            // FIX: Create a clean, flat object
            const requestBody = {
                name: userData.name,
                email: userData.email,
                phone_number: userData.phone_number,
                password: userData.password
            };
            
            console.log('📤 Registration request body:', requestBody);
            
            const response = await fetch(`${this.baseURL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // Use the clean flat object
            });

            console.log('Registration response status:', response.status);
            
            const data = await this.handleResponse<AuthResponse>(response);
            console.log('Registration successful:', data);
            
            if (data.success && data.access_token) {
                localStorage.setItem('authToken', data.access_token);
            }
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }


  async login(loginData: UserLogin): Promise<AuthResponse> {
        try {
            console.log('🔐 Attempting login with:', loginData);
            console.log('📡 Sending request to:', `${this.baseURL}/api/auth/login`);
            
            // FIX: Create a clean, flat object without nested structure
            const requestBody = {
                email: loginData.email,
                password: loginData.password
            };
            
            console.log('📤 Request body:', requestBody);
            
            const response = await fetch(`${this.baseURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // Use the clean flat object
            });

            console.log('📨 Login response status:', response.status, response.statusText);
            
            const data = await this.handleResponse<AuthResponse>(response);
            console.log('✅ Login successful:', data);
            
            if (data.success && data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                console.log('💾 Token saved to localStorage');
            }
            
            return data;
        } catch (error) {
            console.error('❌ Login error:', error);
            // Make sure we're throwing a string, not an object
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unknown login error');
            }
        }
    }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(`${this.baseURL}/api/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserResponse>(response);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
  }


  async getPnL(): Promise<PnLData> {
    const response = await fetch(`${this.baseURL}/api/wallet/pnl`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PnLData>(response);
  }

  // Wallet methods
  async getWalletBalance(): Promise<WalletData> {
    const response = await fetch(`${this.baseURL}/api/wallet/balance`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<WalletData>(response);
  }

  async depositFunds(data: DepositRequest): Promise<TransactionResponse> {
    const response = await fetch(`${this.baseURL}/api/wallet/deposit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<TransactionResponse>(response);
  }

  async withdrawFunds(data: WithdrawRequest): Promise<TransactionResponse> {
    const response = await fetch(`${this.baseURL}/api/wallet/withdraw`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<TransactionResponse>(response);
  }

  // Investment methods
  async getMyInvestments(): Promise<UserInvestment[]> {
    const response = await fetch(`${this.baseURL}/api/investments/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserInvestment[]>(response);
  }

  async buyInvestment(investmentData: InvestmentRequest): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/investments/buy`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(investmentData),
    });
    return this.handleResponse(response);
  }

  // Market data methods
  async getAssets(): Promise<Asset[]> {
    const response = await fetch(`${this.baseURL}/api/assets/market`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Asset[]>(response);
  }

  // Activity methods
  async getMyActivities(): Promise<UserActivity[]> {
    const response = await fetch(`${this.baseURL}/api/activities/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserActivity[]>(response);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; timestamp: string }> {
    const response = await fetch(`${this.baseURL}/api/health`);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();