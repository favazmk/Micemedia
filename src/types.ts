/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  details?: string[];
  iconName: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  image: string;
  tag: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  jobTitle: string;
  companyName: string;
  city: string;
  rating: number;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface WhyUsReason {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ProposalFormInputs {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  eventType: string;
  estimatedGuests: string;
  preferredDate: string;
  comments: string;
}
