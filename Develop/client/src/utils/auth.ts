// client/src/utils/auth.ts

class AuthService {
  getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  }

  login(token: string): void {
    localStorage.setItem('id_token', token);
    window.location.assign('/');
  }

  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
