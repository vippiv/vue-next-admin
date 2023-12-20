import { Response_QueryCodeItemTree } from '@/store/app/types';

export interface CategoryItem {
  label: string;
  value: string;
  children?: CategoryItem[] | null;
}

export interface FindCodeItem {
  parent: Response_QueryCodeItemTree | null;
  current: Response_QueryCodeItemTree | null;
}

export interface CateItem {
  codeId: number;
  codeName: string;
  key?: any;
}
