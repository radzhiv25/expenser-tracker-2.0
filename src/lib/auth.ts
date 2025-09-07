import { account, ID } from './appwrite';
import { Models, OAuthProvider } from 'appwrite';

export interface User extends Models.User<Models.Preferences> {
    $id: string;
    name: string;
    email: string;
}

export class AuthService {
    // Get current user
    static async getCurrentUser(): Promise<User | null> {
        try {
            return await account.get();
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // Create account
    static async createAccount(email: string, password: string, name: string) {
        try {
            return await account.create(ID.unique(), email, password, name);
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    // Login
    static async login(email: string, password: string) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    // Google OAuth
    static async loginWithGoogle() {
        try {
            return await account.createOAuth2Session(OAuthProvider.Google, `${window.location.origin}/dashboard`, `${window.location.origin}/login`);
        } catch (error) {
            console.error('Error with Google OAuth:', error);
            throw error;
        }
    }

    // GitHub OAuth
    static async loginWithGitHub() {
        try {
            return await account.createOAuth2Session(OAuthProvider.Github, `${window.location.origin}/dashboard`, `${window.location.origin}/login`);
        } catch (error) {
            console.error('Error with GitHub OAuth:', error);
            throw error;
        }
    }

    // Logout
    static async logout() {
        try {
            return await account.deleteSession('current');
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }

    // Check if user is logged in
    static async isLoggedIn(): Promise<boolean> {
        try {
            const user = await this.getCurrentUser();
            return user !== null;
        } catch (error) {
            return false;
        }
    }
}
