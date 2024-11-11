import { Tables } from './tables';
import { Views } from './views';

export type Database = {
  public: {
    Tables: Tables;
    Views: Views;
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

export type { Tables, Views };