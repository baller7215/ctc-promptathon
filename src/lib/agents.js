import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const analyzePortfolio = async (portfolioData) => {
  const portfolioHash = btoa(JSON.stringify(portfolioData)).slice(0, 32);
  const cached = localStorage.getItem(`analysis_${portfolioHash}`);
  if (cached) {
    console.log("Using cached analysis");
    return JSON.parse(cached);
  }

  const prompt = `
    You are a financial literacy assistant for college students.
    Analyze the following investment portfolio for educational purposes only. Do not provide direct buy/sell recommendations. Focus on explaining diversification, sector concentration, asset allocation, and risk in beginner-friendly language.

    Return your response in JSON with:
    - summary (string)
    - diversificationScore (number 1-100)
    - riskLevel (string: Low, Medium, High, Extreme)
    - strengths (array of strings)
    - concerns (array of strings)
    - beginnerExplanation (string)
    - learningTopics (array of strings)

    Portfolio JSON:
    ${JSON.stringify(portfolioData)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    
    localStorage.setItem(`analysis_${portfolioHash}`, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return mockAnalysisResponse();
  }
};

export const getMarketData = async (tickers) => {
  if (!tickers || tickers.length === 0) return {};
  
  const cacheKey = `market_data_${tickers.sort().join('_')}`;
  const cached = localStorage.getItem(cacheKey);
  
  // Cache for 5 minutes
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      console.log("Using cached market data");
      return data;
    }
  }

  const prompt = `
    Return the current market price (USD), 24h change percentage, and primary sector for the following stock tickers: ${tickers.join(', ')}.
    Format your response as a strict JSON object where keys are tickers:
    {
      "TICKER": { "price": number, "change": number, "sector": "string" }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error("Gemini Market Data error:", error);
    return tickers.reduce((acc, t) => ({ ...acc, [t]: { price: 150, change: 0.5, sector: 'Technology' } }), {});
  }
};

export const chatWithTutor = async (portfolioContext, userQuestion, messages = []) => {
  // Safety Pre-check
  const safetyPrompt = `
    You are a financial safety reviewer for a student education app.
    
    The user is asking: "${userQuestion}"
    
    Rules for your review:
    1. If the user asks for a specific "BUY", "SELL", or "HOLD" recommendation, or asks for a price prediction (e.g., "Will Apple hit $200?"), it is UNSAFE.
    2. If the user asks to explain a concept (diversification, risk, ETFs) OR asks for an educational analysis of their OWN holdings (e.g., "Why is my portfolio risky?"), it is SAFE.
    
    If it is SAFE, respond ONLY with the word "SAFE".
    If it is UNSAFE, respond with a friendly educational disclaimer explaining that you can teach concepts but cannot give direct trade advice.
  `;

  try {
    const safetyResult = await model.generateContent(safetyPrompt);
    const safetyMsg = (await safetyResult.response).text().trim();
    
    if (safetyMsg !== "SAFE" && API_KEY !== "YOUR_GEMINI_API_KEY") {
      return safetyMsg;
    }

    const prompt = `
      You are an investing tutor for college students named "PortfolioPilot". Your job is to teach investing concepts clearly and safely.

      Rules:
      - BE CONCISE. Use maximum 2-3 short paragraphs.
      - Use bullet points for lists.
      - Use **bold** for key terms.
      - Do not tell users exactly what stock to buy or sell.
      - Do not guarantee returns.
      - Explain tradeoffs clearly.
      - Use simple, encouraging language.
      - Encourage users to do their own research.

      User portfolio context:
      ${JSON.stringify(portfolioContext)}

      User question:
      ${userQuestion}
    `;

    if (API_KEY === "YOUR_GEMINI_API_KEY") {
        return "I'm currently in demo mode. In a live environment, I would explain that " + 
               (userQuestion.toLowerCase().includes('diversification') ? 
                "diversification means not putting all your eggs in one basket." : 
                "investing involves risk, and it's important to understand what you own.");
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to my financial wisdom right now. Please try again later!";
  }
};

const mockAnalysisResponse = () => ({
  summary: "Your portfolio shows a strong preference for high-growth technology stocks, which offers high potential but comes with significant sector-specific risk.",
  diversificationScore: 45,
  riskLevel: "High",
  strengths: ["Exposure to high-growth sectors", "Simplified management"],
  concerns: ["Heavy sector concentration", "Lack of defensive assets", "High volatility"],
  beginnerExplanation: "Imagine you only own stores that sell umbrellas. If it's a sunny year, you might struggle. Your portfolio is a bit like that—it depends heavily on one type of business (Technology).",
  learningTopics: ["What is sector diversification?", "The role of ETFs in a balanced portfolio", "Understanding market volatility"]
});
