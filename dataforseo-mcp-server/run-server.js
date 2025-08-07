#!/usr/bin/env node

// DataForSEO MCP Server Simple Runner
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const axios = require("axios");

// DataForSEO credentials from environment
const login = process.env.DATAFORSEO_LOGIN || 'gekawa1878@efpaper.com';
const password = process.env.DATAFORSEO_PASSWORD || '41f48333ee5ced52';
const authHeader = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');

// Create server instance
const server = new McpServer({
  name: "dataforseo-mcp-server",
  version: "1.0.0",
});

// Helper function to make DataForSEO API calls
async function callDataForSEO(endpoint, method = 'GET', data = null) {
  const url = `https://api.dataforseo.com/v3${endpoint}`;
  
  try {
    const config = {
      method,
      url,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('DataForSEO API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Register basic tools
server.tool(
  "dataforseo_serp_google_organic",
  {
    keyword: { type: "string", description: "Keyword to search" },
    location_code: { type: "number", description: "Location code (e.g., 2840 for US)" },
    language_code: { type: "string", description: "Language code (e.g., 'en')" }
  },
  async (params) => {
    const postData = [{
      keyword: params.keyword,
      location_code: params.location_code || 2840,
      language_code: params.language_code || "en"
    }];
    
    const result = await callDataForSEO('/serp/google/organic/live/advanced', 'POST', postData);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  }
);

server.tool(
  "dataforseo_keywords_search_volume",
  {
    keywords: { type: "array", description: "Array of keywords to get search volume" },
    location_code: { type: "number", description: "Location code" },
    language_code: { type: "string", description: "Language code" }
  },
  async (params) => {
    const postData = [{
      keywords: params.keywords,
      location_code: params.location_code || 2840,
      language_code: params.language_code || "en"
    }];
    
    const result = await callDataForSEO('/keywords_data/google_ads/search_volume/live', 'POST', postData);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  }
);

server.tool(
  "dataforseo_domain_overview",
  {
    target: { type: "string", description: "Domain to analyze" },
    location_code: { type: "number", description: "Location code" },
    language_code: { type: "string", description: "Language code" }
  },
  async (params) => {
    const postData = [{
      target: params.target,
      location_code: params.location_code || 2840,
      language_code: params.language_code || "en"
    }];
    
    const result = await callDataForSEO('/dataforseo_labs/google/domain_rank_overview/live', 'POST', postData);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  }
);

server.tool(
  "dataforseo_keyword_ideas",
  {
    keywords: { type: "array", description: "Seed keywords" },
    location_code: { type: "number", description: "Location code" },
    language_code: { type: "string", description: "Language code" },
    limit: { type: "number", description: "Number of results" }
  },
  async (params) => {
    const postData = [{
      keywords: params.keywords,
      location_code: params.location_code || 2840,
      language_code: params.language_code || "en",
      limit: params.limit || 100
    }];
    
    const result = await callDataForSEO('/dataforseo_labs/google/keyword_ideas/live', 'POST', postData);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  }
);

server.tool(
  "dataforseo_locations",
  {
    country: { type: "string", description: "Country code (e.g., 'BR' for Brazil)" }
  },
  async (params) => {
    const endpoint = params.country 
      ? `/dataforseo_labs/locations_and_languages?country=${params.country}`
      : '/dataforseo_labs/locations_and_languages';
    
    const result = await callDataForSEO(endpoint, 'GET');
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("DataForSEO MCP Server started successfully");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});