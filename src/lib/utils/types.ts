export type Note = {
    id: string;
    title: string;
    content: string;
    summary?: string;
    created_at: string;
    updated_at: string;
    user_id: string;
  };
  
  export type User = {
    id: string;
    email?: string;
    avatar_url?: string;
    user_name?: string;
  };
  
  export interface Database {
    public: {
      Tables: {
        notes: {
          Row: Note;
          Insert: Omit<Note, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Note, 'id' | 'created_at' | 'updated_at'>>;
        };
        profiles: {
          Row: User;
          Insert: Omit<User, 'id'>;
          Update: Partial<Omit<User, 'id'>>;
        };
      };
    };
  }