export interface ItemTemplateDTO {
  id: string;
  source: string;
  externalReferenceId: string | null;
  name: string;
  type: string;
  rarity: string | null;
  description: string | null;
  properties: unknown | null;
  weight: number | null;
  valueAmount: number | null;
  valueCurrency: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}
