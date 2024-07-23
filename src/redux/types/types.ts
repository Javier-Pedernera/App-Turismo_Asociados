export enum UserActionTypes {
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAILURE = 'REGISTER_FAILURE',
  }
  
  // Definición del tipo de estado del usuario
  export interface UserState {
    userData: UserData | null; 
    loading: boolean; 
    error: string | null; 
  }
  export interface Category {
    category_id: number;
    name: string;
  }
  export interface UserCategory {
    id: number;
    name: string;
  }
  
  // Definición de la estructura de los datos del usuario
  export interface UserData {
    user_id?: number;
    public_id?: string;
    password?: string;
    role?: string;
    first_name: string;
    last_name: string;
    country: string;
    city: string;
    birth_date?: string;
    email: string;
    phone_number?: string;
    gender?: string;
    status?: string;
    subscribed_to_newsletter?: boolean;
    image_url?: string | null;
    categories?: number[];
  }


  export interface LoginResponse {
    token: string;
    user: UserData;
  }
