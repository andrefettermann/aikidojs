// server/utils/tokenManager.ts

interface TokenData {
  token: string;
  expiresAt: number;
}

class TokenManager {
  private tokenData: TokenData | null = null;
  private refreshPromise: Promise<string> | null = null;
  private apiUrl: string;
  private credentials: { username: string; password: string };

  constructor(apiUrl: string, credentials: { username: string; password: string }) {
    this.apiUrl = apiUrl;
    this.credentials = credentials;
  }

  private async fetchNewToken(): Promise<TokenData> {
    try {
      const credentials = Buffer.from(
        `${this.credentials.username}:${this.credentials.password}`
      ).toString('base64');

      const response = await $fetch<{ token: string; expiresIn: number }>(
        `${this.apiUrl}/gera-token`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`
          }
        }
      );

      const { token, expiresIn } = response;
      const expiresAt = Date.now() + (expiresIn * 1000) - (5 * 60 * 1000);

      return { token, expiresAt };
    } catch (error) {
      console.error('Erro ao obter token:', error);
      throw new Error('Falha ao obter token de autenticação');
    }
  }

  private isTokenValid(): boolean {
    if (!this.tokenData) return false;
    return Date.now() < this.tokenData.expiresAt;
  }

  async getToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (this.isTokenValid()) {
      return this.tokenData!.token;
    }

    this.refreshPromise = (async () => {
      try {
        this.tokenData = await this.fetchNewToken();
        return this.tokenData.token;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  invalidateToken(): void {
    this.tokenData = null;
  }
}

// Instância singleton
const tokenManager = new TokenManager(
  process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/',
  {
    username: process.env.API_USERNAME || '',
    password: process.env.API_PASSWORD || ''
  }
);

export { tokenManager };
