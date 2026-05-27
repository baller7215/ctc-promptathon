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
    - beginnerExplanation (string: A very punchy 1-sentence analogy followed by 3 short bullet points starting with an emoji and a **bold title**)
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

const TWELVE_DATA_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

export const getMarketData = async (tickers) => {
  if (!tickers || tickers.length === 0) return {};
  
  const cacheKey = `market_data_${tickers.sort().join('_')}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 5 * 60 * 1000) return data;
  }

  let marketData = {};

  // 1. Fetch Real Prices from Twelve Data
  if (TWELVE_DATA_KEY && TWELVE_DATA_KEY !== 'YOUR_KEY') {
    try {
      const symbols = tickers.join(',');
      const res = await fetch(`https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${TWELVE_DATA_KEY}`);
      const result = await res.json();
      
      tickers.forEach(t => {
        const quote = tickers.length > 1 ? result[t] : result;
        if (quote && quote.price) {
          marketData[t] = {
            price: parseFloat(quote.price),
            change: parseFloat(quote.percent_change || 0),
            sector: 'Market Asset' // Temporary
          };
        }
      });
    } catch (e) { console.warn("Twelve Data failed", e); }
  }

  // 2. Use Gemini to "Enhance" the data with Sectors and missing prices
  const prompt = `
    Return the primary sector for these tickers: ${tickers.join(', ')}. 
    ${Object.keys(marketData).length === 0 ? "Also provide current USD prices and 24h change %." : ""}
    Format: JSON { "TICKER": { "sector": "string", "price": number?, "change": number? } }
  `;

  try {
    const result = await model.generateContent(prompt);
    const aiResult = JSON.parse((await result.response).text().match(/\{[\s\S]*\}/)[0]);
    
    // Merge AI sectors with Real prices
    const finalData = tickers.reduce((acc, t) => ({
      ...acc,
      [t]: {
        price: marketData[t]?.price || aiResult[t]?.price || 150,
        change: marketData[t]?.change || aiResult[t]?.change || 0,
        sector: aiResult[t]?.sector || 'Technology'
      }
    }), {});

    localStorage.setItem(cacheKey, JSON.stringify({ data: finalData, timestamp: Date.now() }));
    return finalData;
  } catch (error) {
    return marketData; // Return what we have if AI fails
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
