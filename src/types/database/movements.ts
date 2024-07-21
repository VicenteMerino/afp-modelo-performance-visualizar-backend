type MovementData = {
  id?: number;
  external_id: string;
  movement_date: string;
  clp_amount: number;
  shares_amount: number;
  fundsFlow: string;
  is_employer_payment: boolean;
};

export type { MovementData };
