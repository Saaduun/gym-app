import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// Lazy initialize Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Chat Assistant endpoint
app.post('/api/ai-chat', async (req: Request, res: Response) => {
  try {
    const rawMessage = req.body.message || req.body.prompt;
    const history = req.body.history;
    const context = req.body.context || req.body.userProfile || req.body.currentPlanSummary;

    if (!rawMessage || typeof rawMessage !== 'string') {
      res.status(400).json({ error: 'Valid message string is required', reply: 'Please provide a valid question or prompt.' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback helpful coach response if key is absent
      const fallbackText = `Here are key biomechanical & training principles for your inquiry:
1. **Pacing & Recovery**: Ensure at least 48 hours between high-intensity compound lifting and full-contact martial arts sparring.
2. **Technique First**: Strict joint alignment and core bracing maximize kinetic power transfer while protecting spinal integrity.
3. **Targeted Conditioning**: Prioritize multi-planar rotational exercises (landmine presses, cable rotations, kettlebell swings) to build combat-ready torque.

*Note: For live real-time Gemini generation, ensure your GEMINI_API_KEY is configured. Always stop and consult a medical doctor for acute pain or injuries.*`;

      res.json({
        reply: fallbackText,
        response: fallbackText,
      });
      return;
    }

    const systemInstruction = `You are "Aegis AI", an expert sports scientist, strength coach, and combat biomechanist.
You specialize in weight training (hypertrophy, power, strength), martial arts (boxing, kickboxing, muay thai, MMA, wrestling, BJJ), and smart hybrid scheduling.

CRITICAL SAFETY & SCOPE RULES:
1. NEVER provide medical diagnoses, physical therapy prescriptions, or claim that training routines guarantee injury prevention.
2. If the user mentions sharp, acute pain, dizziness, fainting, numbness, joint swelling, or shortness of breath, immediately and clearly instruct them to stop the exercise and consult an appropriately qualified healthcare professional.
3. Clearly state that anatomical activations and biomechanical numbers are educational estimates.
4. Keep advice clear, actionable, encouraging, and structured with bullet points.
5. In Hybrid training, prioritize fatigue management (e.g., avoid heavy leg days right before intense kicking/sparring sessions).
6. Do NOT recommend extreme calorie deficits or unhealthy eating habits.

User Context:
${context ? JSON.stringify(context) : 'General athlete'}`;

    const prompt = `User question: ${rawMessage}

${history && Array.isArray(history) && history.length > 0 ? `Recent chat context:\n${history.map((h: any) => `${h.role || h.sender}: ${h.text}`).join('\n')}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I could not generate an answer at this moment. Please try again.';
    res.json({
      reply: replyText,
      response: replyText,
    });
  } catch (error: any) {
    console.error('Error in /api/ai-chat:', error);
    const safeFallback = `Here is athletic guidance for your training:
- **Fatigue Management**: Limit heavy lifting sets when preparing for combat rounds within 24 hours.
- **Joint Health**: Incorporate rotational core work and dynamic hip openers.
- **Safety**: Stop immediately if you experience sharp or unusual joint pain.`;
    res.json({
      reply: safeFallback,
      response: safeFallback,
      error: 'Fallback mode activated',
    });
  }
});

// AI Plan Customization & Optimization Endpoint
app.post('/api/generate-ai-plan', async (req: Request, res: Response) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      res.status(400).json({ error: 'Profile is required' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(200).json({
        fallback: true,
        message: 'Using built-in deterministic sports science algorithm for your weekly plan.',
      });
      return;
    }

    const systemInstruction = `You are a certified sports scientist and combat strength coach. 
Generate expert advice and tips for the user's specific weekly training routine based on their profile.
Output JSON with:
- "coachingSummary": short 2-sentence summary of the focus
- "hybridAdvice": specific tip on balancing strength with combat recovery (e.g., lower body fatigue vs kicking/takedowns)
- "warmupProtocol": 3 specific dynamic drills
- "recoveryTip": 1 actionable sleep or mobility cue`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Profile: ${JSON.stringify(profile)}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    let data = {};
    try {
      data = JSON.parse(response.text || '{}');
    } catch {
      data = { coachingSummary: response.text };
    }

    res.json({ success: true, aiInsights: data });
  } catch (error: any) {
    console.error('Error in /api/generate-ai-plan:', error);
    res.status(200).json({
      fallback: true,
      error: 'AI insight unavailable, using science-backed built-in routine.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
