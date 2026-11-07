import json from "./content.json";
import type { Content, PortfolioId } from "./types";

// The committed copy of www's content.json; scripts/sync-content.mjs refreshes it before each build.
export const content = json as Content;

export const portfolioId: PortfolioId = "frontend";

export const portfolio = content.portfolios.find((p) => p.id === portfolioId)!;
export const otherPortfolios = content.portfolios.filter((p) => p.id !== portfolioId);
