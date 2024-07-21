type MovementData = {
  id?: number;
  external_id: string;
  movement_date: string;
  value: number;
  fundsFlow: string;
  is_employer_payment: boolean;
};

export type { MovementData };
