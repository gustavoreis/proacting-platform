import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
  perspective: "published", 
});

export type TrackType = {
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
  faq?: {
    _key: string;
    question: string;
    answer: string;
  }[];
  sources?: {
    _key: string;
    title: string;
    description: string;
    sourceFileOrLink?: {
      link?: string;
      file?: string;
    };
  }[];
  biomarkers?: {
    _key: string;
    id: string;
    id_tuss: string;
    name: string;
    observation: string;
  }[];
  shortDescription: string;
  description?: string;
  previewImageUrl: string;
  practitioner: PractitionerType;
  shopifyProductId?: number | string;
  status: string;
  _createdAt: string;
};

export type PractitionerType = {
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
};

type VariantType = {
  _id: string;
  name: string;
};

type Block = {
  _type: "block";
  style: string;
  children: {
    _type: "span";
    text: string;
    marks: string[];
  }[];
  markDefs: any[];
};

type CreateTrackInput = {
  title: string;
  shortDescription: string;
  practitionerId: string;
  status: string;
  about: Block[];
  faq: {
    question: string;
    answer: string;
  }[];
  sources?: {
    title: string;
    link: string;
    description?: string;
  }[];
  biomarkers?: {
    name: string;
    tuss_id: string;
    description: string;
  }[];
  howItWorks?: {
    title: string;
    subTitle: string;
    description: string;
  }[];
};

// Funções de busca
export const fetchTrackData = async (loginUserId: string): Promise<TrackType[]> => {
  const practitionerId = await fetchPractitionerByLoginUserId(loginUserId);
  const query = `*[_type == "track" && practitioner._ref == "${practitionerId._id}"] | order(_createdAt desc){
    ...,
    "previewImageUrl": productImage.asset->.url,
    howItWorksTemplate->{
      _id,
      title,
      steps
    }
  }`;
  return client.fetch(query);
};

export const fetchTrackById = async (trackId: string): Promise<TrackType> => {
  const query = `*[_type == "track" && _id == "${trackId}"][0]{
    ...,
    "previewImageUrl": productImage.asset->.url,
    practitioner->{
      ...,
      "avatarUrl": avatar.asset->url,
    },
    howItWorksTemplate->{
      _id,
      title,
      steps
    }
  }`;
  return client.fetch(query);
};

export const fetchPractitionerById = async (id: string): Promise<PractitionerType> => {
  const query = `*[_type == "practitioner" && _id == "${id}"][0]{
    ...,
    "avatarUrl": avatar.asset->url,
  }`;
  return client.fetch(query);
};

export const fetchPractitionerByLoginUserId = async (
  loginUserId: string
): Promise<PractitionerType> => {
  const query = `*[_type == "practitioner" && loginUserId == "${loginUserId}"][0]{
    ...,
    "avatarUrl": avatar.asset->url,
  }`;
  return client.fetch(query);
};



export const updatePractitioner = async (
  id: string,
  updatedFields: {
    prefix: string | null;
    name: string | null;
    email: string;
    bio: string | null;
  }
): Promise<void> => {
  try {
    await client.patch(id).set(updatedFields).commit();
  } catch (error) {
    console.error("Error updatePractitioner:", error);
    throw error;
  }
};

export const updatePractitionerPhoneNumber = async (
  id: string,
  updatedFields: {
    phoneNumber: string;
  }
): Promise<void> => {
  try {
    await client.patch(id).set(updatedFields).commit();
  } catch (error) {
    console.error("Error updatePractitionerPhoneNumber:", {
      id,
      updatedFields,
    });
    console.error("Error updating document (updatePractitionerPhoneNumber):", error);
  }
};

export const createPractitioner = async (fields: {
  loginUserId: string;
  name: string;
}) => {
  try {
    const doc = {
      _type: "practitioner",
      loginUserId: fields.loginUserId,
      name: fields.name,
      isPhoneVerified: false,
    };
    const result = await client.create(doc);
    return result;
  } catch (error) {
    console.error("Error creating practitioner:", error);
    throw error;
  }
};



export default client; 