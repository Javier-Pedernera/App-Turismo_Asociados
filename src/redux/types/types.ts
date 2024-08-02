export enum UserActionTypes {
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAILURE = 'REGISTER_FAILURE',
  }
  
  // Definición del tipo de estado del usuario
  export interface UserState {
    userData: UserData | {}; 
    loading: boolean; 
    error: string | null; 
  }
  export interface Category {
    category_id: number;
    name: string;
  }
  export interface UserCategory {
    id?: number;
    category_id?: number;
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
  export interface ImagePromotion {
    image_id: number;
    image_path: string;
    promotion_id: number;
  }
  export interface Promotion {
    promotion_id: number;
    title: string;
    description: string;
    start_date: string;
    expiration_date: string;
    qr_code: string;
    partner_id: number;
    categories: Category[];
    images: ImagePromotion[];
    latitude?: number,
    longitude?: number,
    discount_percentage?:number,
    branch_id?:number,
    available_quantity?: number
  }

  export interface Branch {
    branch_id: number;
    partner_id: number;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    status: 'active' | 'inactive' | 'paused';
    image_url: string;
  }
  export interface Favorite{
    created_at: string;
    promotion_id: number;
    user_id: number
  }