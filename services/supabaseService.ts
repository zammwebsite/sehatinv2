
// This is a mocked Supabase client for demonstration purposes.
// It uses localStorage to simulate a database and authentication.

import { User, Session } from '../types';

// Mock types to avoid importing from a library that might not be present
export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'PASSWORD_RECOVERY' | 'TOKEN_REFRESHED';
export interface Session_ {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    user: User;
}

// Rename to avoid conflict with our app's Session type
export type SupabaseSession = Session_ | null;

const MOCK_DB_PREFIX = 'sehatin_mock_';
const SESSION_KEY = `${MOCK_DB_PREFIX}session`;

const getLocalStorage = (key: string) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage', error);
        return null;
    }
};

const setLocalStorage = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error writing to localStorage', error);
    }
};

const removeLocalStorage = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage', error);
    }
};

const listeners: ((event: AuthChangeEvent, session: Session | null) => void)[] = [];

const notifyListeners = (event: AuthChangeEvent, session: Session | null) => {
    listeners.forEach(listener => listener(event, session));
};

// Mock Supabase Client
export const supabase = {
    auth: {
        signUp: async ({ email, password, options }: any) => {
            const users = getLocalStorage(`${MOCK_DB_PREFIX}users`) || [];
            if (users.find((u: User) => u.email === email)) {
                return { error: { message: 'User already exists' }, data: { user: null } };
            }
            const newUser: User = {
                id: `user_${Date.now()}`,
                email,
                name: options?.data?.name || email.split('@')[0],
                age: 25, // default
                gender: 'Other', // default
            };
            users.push({ ...newUser, password }); // In a real app, hash the password
            setLocalStorage(`${MOCK_DB_PREFIX}users`, users);
            
            const session: Session = { access_token: `mock_token_${Date.now()}`, user: newUser };
            setLocalStorage(SESSION_KEY, session);
            notifyListeners('SIGNED_IN', session);
            
            return { error: null, data: { user: newUser, session } };
        },

        signInWithPassword: async ({ email, password }: any) => {
            const users = getLocalStorage(`${MOCK_DB_PREFIX}users`) || [];
            const user = users.find((u: any) => u.email === email && u.password === password);
            if (!user) {
                return { error: { message: 'Invalid credentials' }, data: { user: null } };
            }
            const { password: _, ...userData } = user;
            const session: Session = { access_token: `mock_token_${Date.now()}`, user: userData };
            setLocalStorage(SESSION_KEY, session);
            notifyListeners('SIGNED_IN', session);
            return { error: null, data: { user: userData, session } };
        },

        getSession: async () => {
            const session = getLocalStorage(SESSION_KEY);
            return { error: null, data: { session } };
        },

        signOut: async () => {
            removeLocalStorage(SESSION_KEY);
            notifyListeners('SIGNED_OUT', null);
            return { error: null };
        },

        onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
            listeners.push(callback);
            return {
                data: {
                    subscription: {
                        unsubscribe: () => {
                            const index = listeners.indexOf(callback);
                            if (index > -1) {
                                listeners.splice(index, 1);
                            }
                        },
                    },
                },
            };
        },
    },
    db: {
        from: (tableName: string) => {
            const tableKey = `${MOCK_DB_PREFIX}${tableName}`;
            let tableData = getLocalStorage(tableKey) || [];

            return {
                select: (columns = '*') => ({
                    eq: (column: string, value: any) => ({
                        order: (orderColumn: string, options: { ascending: boolean }) => {
                            let results = tableData.filter((row: any) => row[column] === value);
                            results.sort((a: any, b: any) => {
                                if (a[orderColumn] < b[orderColumn]) return options.ascending ? -1 : 1;
                                if (a[orderColumn] > b[orderColumn]) return options.ascending ? 1 : -1;
                                return 0;
                            });
                            return Promise.resolve({ data: results, error: null });
                        },
                    }),
                }),
                insert: (rowData: any) => {
                    const newRow = { ...rowData, id: `id_${Date.now()}`, timestamp: new Date().toISOString() };
                    tableData.push(newRow);
                    setLocalStorage(tableKey, tableData);
                    return Promise.resolve({ data: [newRow], error: null });
                },
            };
        },
    },
};
