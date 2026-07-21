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
  email?: string;
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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  author: string;
  tags: string[];
  read_time: string;
  created_at: string;
  views: number;
}

export interface SiteSettings {
  logo_url?: string;
  favicon_url?: string;
  ga_measurement_id?: string;
  meta_title?: string;
  meta_description?: string;
  support_phone?: string;
  footer_cta_title?: string;
  footer_cta_desc?: string;
  footer_disclaimer?: string;
  seo_article_enabled?: boolean;
  seo_article_title?: string;
  seo_article_badge?: string;
  seo_article_p1?: string;
  seo_article_p2?: string;
  seo_article_p3?: string;
  seo_article_p4?: string;
  seo_article_p5?: string;
  seo_article_p6?: string;
  seo_article_metric1_title?: string;
  seo_article_metric1_desc?: string;
  seo_article_metric2_title?: string;
  seo_article_metric2_desc?: string;
  seo_article_metric3_title?: string;
  seo_article_metric3_desc?: string;
  button_hero_cta?: string;
  button_hero_secondary_cta?: string;
  button_header_apply?: string;
  button_header_portal?: string;
  button_requirements_cta?: string;
  button_blog_cta?: string;
  button_footer_cta?: string;
  button_wolt_title?: string;
  button_wolt_badge?: string;
  button_wolt_desc?: string;
  button_glovo_title?: string;
  button_glovo_badge?: string;
  button_glovo_desc?: string;
  faqs?: Array<{ question: string; answer: string }>;
  faq_title?: string;
  faq_subtitle?: string;
  hero_slider_slides?: Array<any>;
  hero_slider_images?: string[];
  steps?: Array<any>;
  requirements?: Array<any>;
  rent_items?: Array<any>;
  target_audience_cards?: Array<any>;
  target_audience_items?: Array<any>;
  why_apply_items?: Array<any>;
  hero_bullets?: string[];
  about_tags?: string[];
  why_choose_us_items?: Array<any>;
  [key: string]: unknown;
}

export interface DeliverixInitialData {
  route: string;
  currentView: 'landing' | 'admin' | 'candidate' | 'blog' | 'privacy' | 'terms';
  siteSettings: SiteSettings | null;
  blogPost?: BlogPost | null;
  statusCode: number;
  ssr: boolean;
}

