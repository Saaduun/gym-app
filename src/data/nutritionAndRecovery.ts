export interface FoodGroupGuide {
  category: string;
  role: string;
  examples: string[];
  combatAndLiftingBenefit: string;
}

export const NUTRITION_FOOD_GROUPS: FoodGroupGuide[] = [
  {
    category: 'High-Quality Protein Sources',
    role: 'Muscle protein synthesis, tissue repair, and immune support after microtrauma.',
    examples: ['Chicken breast / thighs', 'Salmon & wild fish', 'Eggs & egg whites', 'Greek yogurt & cottage cheese', 'Tofu & tempeh', 'Lean beef / bison', 'Lentils & edamame', 'Whey / plant protein isolate'],
    combatAndLiftingBenefit: 'Crucial for rebuilding torn muscle fibers from heavy resistance training and repairing bruised muscular tissue from combat impacts.',
  },
  {
    category: 'Complex Carbohydrate Sources',
    role: 'Primary glycogen fuel for anaerobic glycolytic energy during high-intensity rounds and heavy lifting.',
    examples: ['Oatmeal & rolled oats', 'Brown / jasmine rice', 'Sweet potatoes & yams', 'Quinoa', 'Whole grain sourdough bread', 'Bananas & berries', 'Whole wheat pasta'],
    combatAndLiftingBenefit: 'Replenishes intramuscular glycogen stores so you do not experience mid-sparring brain fog or lifting fatigue.',
  },
  {
    category: 'Healthy Fats & Omega-3s',
    role: 'Hormonal support (testosterone, cortisol regulation), joint lubrication, and cellular membrane integrity.',
    examples: ['Avocados', 'Extra virgin olive oil', 'Wild salmon / sardines', 'Walnuts & almonds', 'Chia seeds & flaxseeds', 'Natural peanut / almond butter'],
    combatAndLiftingBenefit: 'High in anti-inflammatory EPA/DHA fatty acids that protect brain tissue from repetitive head impacts and soothe aching joints.',
  },
  {
    category: 'Hydration & Electrolytes',
    role: 'Maintains blood volume, thermoregulation, nerve impulse transmission, and muscle contractility.',
    examples: ['Fresh filtered water', 'Coconut water (natural potassium)', 'Pinch of unrefined sea salt with lemon in water', 'Electrolyte powders (sodium, potassium, magnesium)', 'Watermelon & cucumber'],
    combatAndLiftingBenefit: 'Even a 2% drop in hydration reduces punch power, reaction speed, and cognitive decision-making by over 15%.',
  },
];

export interface MealTimingGuide {
  window: string;
  timing: string;
  recommendation: string;
  idealFoods: string[];
  avoid: string;
}

export const MEAL_TIMING_GUIDE: MealTimingGuide[] = [
  {
    window: 'Pre-Training Fuel',
    timing: '2 to 3 hours before training',
    recommendation: 'Easily digestible complex carbs paired with moderate lean protein. Keep dietary fats and excessive fiber low to avoid gastric distress during high-impact movement.',
    idealFoods: ['Oatmeal with sliced banana and a scoop of protein', 'Rice bowl with grilled chicken breast and steamed zucchini', 'Sourdough toast with egg whites and honey'],
    avoid: 'Heavy greasy fried foods, spicy meals, high-fiber raw beans, and excessive cheese.',
  },
  {
    window: 'Immediate Pre-Session Top-Up (Optional)',
    timing: '30 to 45 minutes before intense sparring/lifting',
    recommendation: 'Fast-acting simple carbohydrates for immediate blood glucose availability.',
    idealFoods: ['1 ripe banana', '2-3 Medjool dates', 'Rice cakes with a drizzle of honey', '100% fruit juice diluted in water with a pinch of sea salt'],
    avoid: 'Heavy protein bars, large fatty dairy, or carbonated energy drinks.',
  },
  {
    window: 'Post-Training Recovery Fuel',
    timing: 'Within 45 to 90 minutes post-session',
    recommendation: 'Combine 25-40g of rapid protein with 40-75g of carbohydrates to kickstart muscle protein synthesis and glycogen resynthesis.',
    idealFoods: ['Whey or plant protein shake blended with frozen berries and oats', 'Grilled salmon with sweet potato mash and asparagus', 'Turkey burger on whole wheat bun with baked potato wedges'],
    avoid: 'Skipping meals or relying solely on alcohol / high-sugar junk food which suppresses recovery hormones.',
  },
];

export interface HybridFatigueRule {
  ruleTitle: string;
  description: string;
  actionableProtocol: string;
}

export const HYBRID_SCHEDULING_RULES: HybridFatigueRule[] = [
  {
    ruleTitle: 'Lower-Body Strength vs. Kick/Grapple Spacing',
    description: 'Heavy squats and deadlifts produce high central nervous system (CNS) and spinal fatigue that degrades knee stability and reaction time in martial arts.',
    actionableProtocol: 'Never schedule maximum-effort leg squats less than 24 hours before a hard Muay Thai kicking, wrestling takedown, or live MMA sparring session. Pair leg days either after martial arts or give a 48h buffer.',
  },
  {
    ruleTitle: 'Upper-Body Push Volume vs. Punching Shoulder Overuse',
    description: 'High volume bench pressing combined with thousands of punches can lead to anterior shoulder impingement.',
    actionableProtocol: 'Always include equal or greater pulling volume (Face Pulls, Pull-ups, Band Pull-aparts) to maintain scapular balance and protect the rotator cuff.',
  },
  {
    ruleTitle: 'Central Nervous System (CNS) Load Tracking',
    description: 'Both heavy lifting (>85% 1RM) and hard combat sparring tax the CNS intensely. Running both on consecutive days leads to overtraining.',
    actionableProtocol: 'Alternate High CNS days with Low CNS days (e.g. Heavy Strength Day -> Light Footwork/Mobility Day -> Hard Sparring Day -> Active Recovery).',
  },
];
