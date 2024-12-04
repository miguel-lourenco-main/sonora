import { Database } from '@kit/supabase/database';

/**
 * TODO: fazer update automatico do file database types de forma a refletir os 
 * requerimentos da db no que toca a tabelas e colunas relacionadas a 
 * componentes de UI e logica reutilizaveis em varias aplicacoes comuns a var
 */
export type UpsertSubscriptionParams =
  Database['public']['Functions']['upsert_subscription']['Args'] & {
    line_items: Array<LineItem>;
  };

export interface LineItem {
  id: string;
  quantity: number;
  subscription_id: string;
  subscription_item_id: string;
  product_id: string;
  variant_id: string;
  price_amount: number | null | undefined;
  interval: string;
  interval_count: number;
  type: 'flat' | 'metered' | 'per_seat' | 'tiered' | undefined;
}

export type UpsertOrderParams =
  Database['public']['Functions']['upsert_order']['Args'];
