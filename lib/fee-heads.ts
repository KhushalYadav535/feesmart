export interface FeeHead {
  id: string
  tenantId: string
  name: string
  amount: number
  isMandatory: boolean
}

const mockFeeHeads: FeeHead[] = [
  { id: "fh1", tenantId: "t1", name: "Tuition Fee", amount: 40000, isMandatory: true },
  { id: "fh2", tenantId: "t1", name: "Library Fee", amount: 5000, isMandatory: true },
  { id: "fh3", tenantId: "t1", name: "Transport Fee", amount: 15000, isMandatory: false },
]

export function getFeeHeadsByTenant(tenantId: string): FeeHead[] {
  return mockFeeHeads.filter((f) => f.tenantId === tenantId)
}

export function addFeeHead(feeHead: Omit<FeeHead, "id">): FeeHead {
  const newFeeHead: FeeHead = {
    ...feeHead,
    id: `fh${mockFeeHeads.length + 1}`,
  }
  mockFeeHeads.push(newFeeHead)
  return newFeeHead
}

export function updateFeeHead(id: string, updates: Partial<FeeHead>): FeeHead | null {
  const feeHead = mockFeeHeads.find((f) => f.id === id)
  if (feeHead) {
    Object.assign(feeHead, updates)
    return feeHead
  }
  return null
}

export function deleteFeeHead(id: string): boolean {
  const index = mockFeeHeads.findIndex((f) => f.id === id)
  if (index !== -1) {
    mockFeeHeads.splice(index, 1)
    return true
  }
  return false
}
