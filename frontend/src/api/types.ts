export type SolutionStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'DEPRECATED'
  | 'ARCHIVED'

export interface Solution {
  id: number
  workspaceId: number
  title: string
  symptoms?: string
  rootCause?: string
  steps?: string
  workaround?: string
  applicability?: string
  status: SolutionStatus
  reviewDueAt?: string
  createdAt: string
  updatedAt: string
}

export interface TicketSnapshot {
  id: number
  workspaceId: number
  source: string
  externalId: string
  sourceUrl?: string
  title: string
  description?: string
  ticketType?: string
  category?: string
  sourceStatus?: string
  resolution?: string
  resolver?: string
  resolvedAt?: string
  importedAt: string
}
