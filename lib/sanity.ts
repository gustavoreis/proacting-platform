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

// Função auxiliar para upload de imagens
type SanityImageField = {
  _type: "image";
  alt?: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
};

export const uploadDefaultImage = async (): Promise<SanityImageField> => {
  try {
    const imageUrls = [
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-clear_lagoon.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-cool_backgrounds.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-ember_spark.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-persian_lounge.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-ranger_made.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-ruby_garden.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-sea_edge.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-spanish_paprika.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-tropical_salad.png",
      "https://vgyqcgfpkwqgvnuxzmcn.supabase.co/storage/v1/object/public/productImages/coolbackgrounds-fractalize-wooded_flora.png",
    ];

    const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    const response = await fetch(randomImageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await client.assets.upload("image", buffer, {
      filename: `track-image-${Date.now()}.png`,
    });

    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error("Error uploading default image:", error);
    throw error;
  }
};

export const createTrack = async (trackData: CreateTrackInput) => {
  try {
    const productImage = await uploadDefaultImage();
    const howItWorksTemplate = await createOrGetHowItWorksTemplate(trackData);

    const track = {
      _type: "track",
      _id: uuidv4(),
      title: trackData.title,
      shortDescription: trackData.shortDescription,
      practitioner: {
        _type: "reference",
        _ref: trackData.practitionerId,
      },
      status: trackData.status,
      about: trackData.about,
      faq: trackData.faq.map((item) => ({
        _key: uuidv4(),
        question: item.question,
        answer: item.answer,
      })),
      sources: trackData.sources?.map((source) => ({
        _key: uuidv4(),
        _type: "source",
        title: source.title,
        description: source.description || "",
        sourceFileOrLink: {
          link: source.link,
        },
      })),
      biomarkers: trackData.biomarkers?.map((biomarker) => ({
        _key: uuidv4(),
        id: biomarker.tuss_id,
        id_tuss: biomarker.tuss_id,
        name: biomarker.name,
        observation: biomarker.description,
      })),
      productImage,
      howItWorksTemplate: howItWorksTemplate ? {
        _type: "reference",
        _ref: howItWorksTemplate._id,
      } : undefined,
    };

    const result = await client.create(track);
    return result;
  } catch (error) {
    console.error("Error creating track:", error);
    throw error;
  }
};

export const fetchDefaultHowItWorksTemplate = async () => {
  const query = `*[_type == "howItWorksTemplate" && title == "Template Padrão"][0]{
    _id,
    title,
    steps
  }`;
  return client.fetch(query);
};

export const createOrGetHowItWorksTemplate = async (
  trackData: CreateTrackInput & {
    howItWorks?: {
      title: string;
      subTitle: string;
      description: string;
    }[];
  }
) => {
  if (!trackData.howItWorks || trackData.howItWorks.length === 0) {
    return await fetchDefaultHowItWorksTemplate();
  }

  const template = {
    _type: "howItWorksTemplate",
    _id: uuidv4(),
    title: `Template para ${trackData.title}`,
    steps: trackData.howItWorks.map((step, index) => ({
      _key: uuidv4(),
      title: step.title,
      subTitle: step.subTitle,
      description: step.description,
      order: index + 1,
    })),
  };

  try {
    const result = await client.create(template);
    return result;
  } catch (error) {
    console.error("Error creating how it works template:", error);
    return await fetchDefaultHowItWorksTemplate();
  }
};

export default client; 