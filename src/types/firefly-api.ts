/**
 * Firefly III API Response Types
 * Based on the official API documentation: https://api-docs.firefly-iii.org/
 */

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
  links?: {
    self: string;
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

export interface ApiError {
  message: string;
  exception?: string;
  line?: number;
  file?: string;
  trace?: string[];
}

export interface ApiErrorResponse {
  message: string;
  exception?: string;
  errors?: Record<string, string[]>;
}

export interface Account {
  type: string;
  id: string;
  attributes: {
    created_at: string;
    updated_at: string;
    active: boolean;
    order: number;
    name: string;
    type: string;
    account_role?: string;
    currency_id: string;
    currency_code: string;
    currency_symbol: string;
    currency_decimal_places: number;
    current_balance: string;
    current_balance_date: string;
    notes?: string;
    monthly_payment_date?: string;
    credit_card_type?: string;
    account_number?: string;
    iban?: string;
    bic?: string;
    virtual_balance?: string;
    opening_balance?: string;
    opening_balance_date?: string;
    liability_type?: string;
    liability_direction?: string;
    interest?: string;
    interest_period?: string;
    include_net_worth: boolean;
  };
}

export interface Transaction {
  type: string;
  id: string;
  attributes: {
    created_at: string;
    updated_at: string;
    user: string;
    group_title?: string;
    transactions: TransactionSplit[];
  };
}

export interface TransactionSplit {
  user: string;
  transaction_journal_id: string;
  type: string;
  date: string;
  order: number;
  currency_id: string;
  currency_code: string;
  currency_symbol: string;
  currency_name: string;
  currency_decimal_places: number;
  foreign_currency_id?: string;
  foreign_currency_code?: string;
  foreign_currency_symbol?: string;
  foreign_currency_decimal_places?: number;
  amount: string;
  foreign_amount?: string;
  description: string;
  source_id: string;
  source_name: string;
  source_iban?: string;
  source_type: string;
  destination_id: string;
  destination_name: string;
  destination_iban?: string;
  destination_type: string;
  budget_id?: string;
  budget_name?: string;
  category_id?: string;
  category_name?: string;
  bill_id?: string;
  bill_name?: string;
  reconciled: boolean;
  notes?: string;
  tags?: string[];
  internal_reference?: string;
  external_id?: string;
  original_source?: string;
  recurrence_id?: string;
  bunq_payment_id?: string;
  import_hash_v2?: string;
  sepa_cc?: string;
  sepa_ct_op?: string;
  sepa_ct_id?: string;
  sepa_db?: string;
  sepa_country?: string;
  sepa_ep?: string;
  sepa_ci?: string;
  sepa_batch_id?: string;
  interest_date?: string;
  book_date?: string;
  process_date?: string;
  due_date?: string;
  payment_date?: string;
  invoice_date?: string;
  latitude?: number;
  longitude?: number;
  zoom_level?: number;
  has_attachments: boolean;
}

export interface Budget {
  type: string;
  id: string;
  attributes: {
    created_at: string;
    updated_at: string;
    name: string;
    active: boolean;
    notes?: string;
    order: number;
    auto_budget_type?: string;
    auto_budget_currency_id?: string;
    auto_budget_currency_code?: string;
    auto_budget_amount?: string;
    auto_budget_period?: string;
    spent?: BudgetSpent[];
  };
}

export interface BudgetSpent {
  currency_id: string;
  currency_code: string;
  currency_symbol: string;
  currency_decimal_places: number;
  amount: string;
}

export interface Category {
  type: string;
  id: string;
  attributes: {
    created_at: string;
    updated_at: string;
    name: string;
    notes?: string;
    spent?: BudgetSpent[];
    earned?: BudgetSpent[];
  };
}

export interface CreateCategoryRequest {
  name: string;
  notes?: string;
}

export interface CategoryLocalData {
  name: string;
  notes?: string;
}
