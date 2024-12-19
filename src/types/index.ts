export interface User {
    name: string;
    email: string;
}

export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

export interface Location {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    county: string;
}

export interface SearchFilters {
    breeds: string[];
    ageMin?: number;
    ageMax?: number;
    sort: string;
}


export interface AuthContextType {
    isAuthenticated: boolean;
    userData: User | null;
    login: (name: string, email: string) => Promise<boolean>;
    logout: () => Promise<void>;
}