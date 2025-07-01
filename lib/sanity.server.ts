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

// Tipos necessários
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
    // Garante que estamos executando no servidor
    if (typeof window !== 'undefined') {
      throw new Error('uploadDefaultImage deve ser executada apenas no servidor');
    }

    const imageFiles = [
      "coolbackgrounds-fractalize-clear_lagoon.png",
      "coolbackgrounds-fractalize-cool_backgrounds.png",
      "coolbackgrounds-fractalize-ember_spark.png",
      "coolbackgrounds-fractalize-persian_lounge.png",
      "coolbackgrounds-fractalize-ranger_made.png",
      "coolbackgrounds-fractalize-ruby_garden.png",
      "coolbackgrounds-fractalize-sea_edge.png",
      "coolbackgrounds-fractalize-spanish_paprika.png",
      "coolbackgrounds-fractalize-tropical_salad.png",
      "coolbackgrounds-fractalize-wooded_flora.png",
    ];

    const randomImageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    
    // Import dinâmico dos módulos Node.js
    const fs = await import('fs');
    const path = await import('path');
    
    // Caminho para o arquivo de imagem local
    const imagePath = path.join(process.cwd(), "public", "productImages", randomImageFile);
    
    // Lê o arquivo de imagem
    const imageBuffer = fs.readFileSync(imagePath);

    const asset = await client.assets.upload("image", imageBuffer, {
      filename: `track-image-${Date.now()}.png`,
    });

    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      alt: "Imagem padrão do produto",
    };
  } catch (error) {
    console.error("Error uploading default image:", error);
    throw error;
  }
};

export const fetchDefaultHowItWorksTemplate = async () => {
  try {
    const template = await client.fetch(
      `*[_type == "howItWorksTemplate" && isDefault == true][0]`
    );
    return template;
  } catch (error: unknown) {
    console.error("Erro ao buscar template padrão:", error);
    return null;
  }
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
  // Se a IA forneceu dados de howItWorks, cria um template personalizado
  if (trackData.howItWorks && trackData.howItWorks.length > 0) {
    const templateTitle = `Template - ${trackData.title}`;
    
    try {
      const customTemplate = await client.create({
        _type: "howItWorksTemplate",
        title: templateTitle,
        description: `Template personalizado criado automaticamente para a track "${trackData.title}"`,
        isDefault: false,
        steps: trackData.howItWorks.map((step, index) => ({
          _key: uuidv4(),
          title: step.title,
          subTitle: step.subTitle,
          description: step.description,
          order: index + 1,
        })),
      });

      console.log("✅ Template personalizado criado:", customTemplate._id);
      return customTemplate._id;
    } catch (error: unknown) {
      console.error("Erro ao criar template personalizado:", error);
      // Se falhar, busca o template padrão
    }
  }

  // Busca template padrão existente
  const defaultTemplate = await fetchDefaultHowItWorksTemplate();
  if (defaultTemplate) {
    console.log("✅ Usando template padrão existente:", defaultTemplate._id);
    return defaultTemplate._id;
  }

  // Se não existe template padrão, cria um
  try {
    const defaultTemplate = await client.create({
      _type: "howItWorksTemplate",
      title: "Modelo Padrão",
      description: "Modelo padrão para o processo \"Como funciona\" das tracks",
      isDefault: true,
      steps: [
        {
          _key: uuidv4(),
          title: "Personalização do Atendimento",
          subTitle: "Questionário de saúde logo após a compra.",
          description: "Logo após a aprovação da compra, será iniciado um questionário de saúde específico deste atendimento para personaliza-lo para você.",
          order: 1,
        },
        {
          _key: uuidv4(),
          title: "Solicitação de Exames",
          subTitle: "Solicitação de Exames é gerada.",
          description: "O questionário é avaliado e é gerado uma solicitação de exames que permite que você realize as coletas em algum laboratório da sua preferência.",
          order: 2,
        },
        {
          _key: uuidv4(),
          title: "Resultado de Exames",
          subTitle: "Envio do resultado dos exames.",
          description: "Ao receber o resultado dos exames do laboratório ou clínica, estes devem ser compartilhados para estruturação do seu plano de ação.",
          order: 3,
        },
        {
          _key: uuidv4(),
          title: "Relatório Médico Personalizado",
          subTitle: "Disponibilização do Relatório Médico.",
          description: "Usando como base todos os dados coletados, é feita uma avaliação personalizada gerado um Relatório Médico e digitalmente disponibilizada.",
          order: 4,
        },
        {
          _key: uuidv4(),
          title: "Consulta (depende do formato contratado)",
          subTitle: "Agendamento e realização da Consulta Médica.",
          description: "A consulta médica (se contratada) parte da estrutura apresentada no Relatório Médico e é uma oportunidade para discussão e detalhamento do plano de ação.",
          order: 5,
        },
      ],
    });

    console.log("✅ Template padrão criado:", defaultTemplate._id);
    return defaultTemplate._id;
  } catch (error: unknown) {
    console.error("Erro ao criar template padrão:", error);
    throw new Error("Falha ao criar template howItWorks");
  }
};

export const createTrack = async (
  trackData: CreateTrackInput & {
    sources?: { title: string; link: string; description?: string }[];
    biomarkers?: { name: string; tuss_id: string; description: string }[];
  }
) => {
  const cleanFaq = (trackData.faq || [])
    .filter((item) => item?.question && item?.answer)
    .map((item) => ({
      _key: uuidv4(),
      question: String(item.question),
      answer: String(item.answer),
    }));

  const cleanSources = (trackData.sources || []).map((source) => ({
    _key: uuidv4(),
    title: source.title,
    description: source.description || "",
    sourceFileOrLink: {
      link: source.link || "",
    },
  }));

  const cleanBiomarkers = (trackData.biomarkers || []).map((b) => ({
    _key: uuidv4(),
    name: b.name,
    id_tuss: b.tuss_id,
    observation: b.description,
  }));

  const cleanAbout = (trackData.about || []).map((block) => ({
    _key: uuidv4(),
    ...block,
  }));

  console.log("🚀 Criando/obtendo template howItWorks...");
  const howItWorksTemplateId = await createOrGetHowItWorksTemplate(trackData);

  const productImage = await uploadDefaultImage();

  try {
    const newTrack = await client.create({
      _type: "track",
      title: trackData.title,
      about: cleanAbout,
      shortDescription: trackData.shortDescription,
      practitioner: {
        _type: "reference",
        _ref: trackData.practitionerId,
      },
      faq: cleanFaq,
      sources: cleanSources,
      biomarkers: cleanBiomarkers,
      status: "draft",
      howItWorksTemplate: {
        _type: "reference",
        _ref: howItWorksTemplateId,
      },
      productImage: productImage,
    });

    console.log("✅ Track criada e vinculada ao template:", {
      trackId: newTrack._id,
      templateId: howItWorksTemplateId,
    });

    return newTrack._id;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new Error(`Erro ao criar o track no Sanity: ${error.message}`);
    }

    throw new Error("Erro desconhecido ao criar o track no Sanity");
  }
};

export default client; 