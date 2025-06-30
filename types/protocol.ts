import type { LucideIcon } from "lucide-react"

export interface Biomarker {
  _key: string
  id: string
  id_tuss: string
  name: string
  observation: string
}

export interface FAQ {
  _key: string
  question: string
  answer: string
}

export interface HowItWorksStep {
  _key: string
  title: string
  subTitle: string
  description: string
}

export interface Inquiry {
  _key: string
  id: string
  question: string
}

export interface Source {
  _key: string
  _type: string
  title: string
  description: string
  sourceFileOrLink: {
    link?: string
    file?: {
      _type: string
      asset: {
        _ref: string
        _type: string
      }
    }
  }
}

export interface Protocol {
  id: string
  name: string
  description: string
  category: string
  tests: number
  duration: string
  priceRange: {
    min: number
    max: number
  }
  icon: LucideIcon
  color: string
  status: "active" | "draft" | "inactive"

  // Extended fields from JSON reference
  _id?: string
  _createdAt?: string
  _updatedAt?: string
  title?: string
  shortDescription?: string
  about?: Array<{
    _key: string
    _type: string
    children: Array<{
      _key: string
      _type: string
      marks: string[]
      text: string
    }>
    markDefs: any[]
    style: string
  }>
  biomarkers?: Biomarker[]
  faq?: FAQ[]
  howItWorks?: HowItWorksStep[]
  inquiries?: Inquiry[]
  sources?: Source[]
  shopifyProductId?: string
  practitioner?: {
    _ref: string
    _type: string
  }
  productImage?: {
    _type: string
    alt: string
    asset: {
      _ref: string
      _type: string
    }
  }
}

// Tipos migrados do Sanity (projeto principal)
export interface TrackType {
  _id: string;
  _type: "track";
  title: string;
  about?: Block[];
  howItWorks?: {
    _key: string;
    title: string;
    subTitle: string;
    description: string;
  }[];
  howItWorksTemplate?: {
    _id: string;
    title: string;
    steps: {
      _key: string;
      title: string;
      subTitle: string;
      description: string;
      order: number;
    }[];
  };
  faq?: FAQ[];
  sources?: Source[];
  biomarkers?: Biomarker[];
  shortDescription: string;
  description?: string;
  previewImageUrl: string;
  practitioner: PractitionerType;
  shopifyProductId?: number;
  status: string;
  _createdAt: string;
}

export interface PractitionerType {
  _id: string;
  _type: "practitioner";
  _createdAt: string;
  loginUserId: string | null;
  prefix: string | null;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  headline: string | null;
  userName: string | null;
  phoneNumber: string | null;
  isPhoneVerified: boolean;
  email: string | null;
}

export interface Block {
  _type: "block";
  style: string;
  children: {
    _type: "span";
    text: string;
    marks: string[];
  }[];
  markDefs: any[];
}
