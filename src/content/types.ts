// Shape of the shared content.json served by www.jaykimsly.co.za.
export type PortfolioId = "services" | "systems" | "frontend" | "backend" | "fullstack";

export interface Person {
  name: string;
  shortName: string;
  title: string;
  location: string;
  languages: string[];
  profileImage: string;
  aboutImage: string;
  siteUrl: string;
  summary: string;
  headlines: string[];
  bio: string[];
}

export interface Phone {
  number: string;
  display: string;
  calls: boolean;
  whatsapp: boolean;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Service {
  name: string;
  description: string;
}

export interface TechIcon {
  name: string;
  icon: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  logo: string;
  start: string;
  end: string | null;
  period: string;
  stack: TechIcon[];
  points: string[];
}

export interface SkillEntry extends TechIcon {
  proficiency: number;
}

export interface ProjectEntry {
  name: string;
  description: string;
  language: string;
  tags: string[];
  repo: string;
  url: string;
  portfolios: PortfolioId[];
}

export interface Portfolio {
  id: PortfolioId;
  title: string;
  audience: string;
  pitch: string;
  framework: string;
  url: string;
  status: "live" | "soon";
}

export interface Hub {
  url: string;
  title: string;
  text: string;
}

export interface Content {
  version: number;
  person: Person;
  phones: Phone[];
  socials: SocialLink[];
  services: Service[];
  experience: ExperienceEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  portfolios: Portfolio[];
  hub: Hub;
}

export const telHref = (phone: Phone) => `tel:${phone.number}`;
export const whatsAppHref = (phone: Phone) => `https://wa.me/${phone.number.replace(/\D/g, "")}`;
