export interface AddOn {
  id: string;
  label: string;
  amount: number;
}

export interface Partner {
  id: string;
  name: string;
  invested: number;
}

export interface Car {
  id: string;
  model: string;
  baseCost: number;
  addOns: AddOn[];
  partners: Partner[];
  totalCost: number;
  createdAt: number;
  updatedAt: number;
}
