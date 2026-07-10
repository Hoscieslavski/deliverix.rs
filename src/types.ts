/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CandidateStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  DOCUMENTS_PENDING = 'DOCUMENTS_PENDING',
  SENT_TO_PARTNER = 'SENT_TO_PARTNER',
  REGISTRATION = 'REGISTRATION',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Candidate {
  id: string;
  ime: string;
  telefon: string;
  grad: string;
  vozilo: 'bicikl' | 'skuter' | 'automobil';
  iskustvo: 'da' | 'ne';
  kada_poceti: string; // npr. 'odmah', 'par_dana', 'sledece_nedelje'
  datum_prijave: string; // ISO string
  status: CandidateStatus;
  
  // Praćenje i automatizacija
  izvor: string; // npr. 'direct', 'facebook_ads', 'referral', etc.
  referral_code?: string;
  napomena?: string;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  newCount: number;
  contactedCount: number;
  documentsPendingCount: number;
  sentToPartnerCount: number;
  registrationCount: number;
  activeCount: number;
  inactiveCount: number;
}
