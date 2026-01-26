import * as api from './api';

export interface FeeHead {
  id: string
  tenantId: string
  name: string
  amount: number
  isMandatory: boolean
}

export async function getFeeHeadsByTenant(tenantId: string): Promise<FeeHead[]> {
  try {
    return await api.feeHeadsAPI.getAll();
  } catch (error) {
    return [];
  }
}

export async function addFeeHead(feeHead: Omit<FeeHead, "id">): Promise<FeeHead> {
  try {
    return await api.feeHeadsAPI.create(feeHead);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add fee head');
  }
}

export async function updateFeeHead(id: string, updates: Partial<FeeHead>): Promise<FeeHead | null> {
  try {
    return await api.feeHeadsAPI.update(id, updates);
  } catch (error) {
    return null;
  }
}

export async function deleteFeeHead(id: string): Promise<boolean> {
  try {
    await api.feeHeadsAPI.delete(id);
    return true;
  } catch (error) {
    return false;
  }
}
