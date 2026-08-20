// ============================================================
// Simple Nutrition — App Engine v2
// Know your number. Protein first. Portion moves.
// Goal-based deficit + Recipes + Grocery Lists + Quick Meals
// ============================================================

// ---- STATE ----
const state = {
  sex: null, age: null, heightCm: null, weightKg: null, weightLbs: null,
  activity: null, goal: null, frequency: null,
  bmr: null, maintenance: null, calorieTarget: null, calorieLane: null,
  proteinTarget: null, boxCalories: null, boxProtein: null,
  selectedFoods: [], currentCalories: 0, currentProtein: 0,
  boxes: [], selectedRecipes: [],
  currentQuestion: 1, heightUnit: 'imperial', weightUnit: 'imperial',
  totalQuestions: 7,
};

// ---- RECIPE DATABASE ----
const RECIPES = [
  {
    id: 'pollo-rajas', name: 'Pollo con Rajas', emoji: '🌶️',
    desc: 'Chicken strips with roasted poblano peppers in a light cream sauce',
    category: 'guisados', cal: 420, pro: 38, time: '30 min', servings: 4,
    boxFit: 450,
    ingredients: [
      '1.5 lbs chicken breast, sliced thin',
      '4 poblano peppers, roasted & sliced',
      '1 medium onion, sliced',
      '2 cloves garlic, minced',
      '½ cup light sour cream',
      '¼ cup chicken broth',
      '1 tbsp olive oil',
      'Salt, pepper, cumin to taste',
      '1 cup white rice (for serving)'
    ],
    steps: [
      'Roast poblanos over flame or under broiler until charred. Peel, seed, and slice into strips.',
      'Season chicken with salt, pepper, cumin. Cook in olive oil over medium-high heat until golden, 5-6 min. Remove.',
      'In same pan, cook onion and garlic until soft, 3 minutes.',
      'Add poblano strips, sour cream, and broth. Stir until combined.',
      'Return chicken to pan. Simmer 5 minutes until sauce thickens slightly.',
      'Serve over ½ cup cooked rice per person.'
    ]
  },
  {
    id: 'poblano-spaghetti', name: 'Poblano Spaghetti', emoji: '🍝',
    desc: 'Creamy green spaghetti with roasted poblano sauce and lean ground turkey',
    category: 'pasta', cal: 440, pro: 35, time: '25 min', servings: 4,
    boxFit: 450,
    ingredients: [
      '8 oz spaghetti',
      '1 lb 93% lean ground turkey',
      '3 poblano peppers, roasted',
      '½ cup plain Greek yogurt',
      '¼ cup chicken broth',
      '2 cloves garlic',
      '½ onion',
      '1 tbsp olive oil',
      'Salt, pepper to taste'
    ],
    steps: [
      'Cook spaghetti according to package. Reserve ½ cup pasta water. Drain.',
      'Roast poblanos, peel and seed. Blend with Greek yogurt, broth, garlic, and onion until smooth.',
      'Brown turkey in olive oil, breaking into small pieces, 6-7 minutes. Season with salt and pepper.',
      'Pour poblano sauce into the pan with turkey. Simmer 3 minutes.',
      'Toss spaghetti with sauce. Add pasta water if too thick.',
      'Serve about 1.5 cups per person.'
    ]
  },
  {
    id: 'picadillo', name: 'Picadillo', emoji: '🥩',
    desc: 'Mexican ground beef stew with potatoes, carrots, and tomato — classic comfort food',
    category: 'guisados', cal: 380, pro: 32, time: '35 min', servings: 5,
    boxFit: 400,
    ingredients: [
      '1.5 lbs 93% lean ground beef',
      '2 medium potatoes, diced small',
      '2 carrots, diced',
      '1 can (14 oz) diced tomatoes',
      '½ onion, diced',
      '2 cloves garlic, minced',
      '1 jalapeño (optional)',
      '1 tsp cumin',
      'Salt, pepper to taste',
      'Corn tortillas for serving'
    ],
    steps: [
      'Brown ground beef in a large pot. Drain any excess fat.',
      'Add onion, garlic, and jalapeño. Cook 2 minutes.',
      'Add diced potatoes, carrots, diced tomatoes, and cumin.',
      'Add ½ cup water. Cover and simmer 20-25 minutes until potatoes are tender.',
      'Season with salt and pepper.',
      'Serve with 2 warm corn tortillas per person.'
    ]
  },
  {
    id: 'chicken-rice-bowl', name: 'Chicken & Poblano Rice Bowl', emoji: '🍚',
    desc: 'Seasoned chicken over green rice with black beans and salsa',
    category: 'bowls', cal: 460, pro: 40, time: '30 min', servings: 4,
    boxFit: 500,
    ingredients: [
      '1.5 lbs chicken breast',
      '1 cup white rice',
      '1 poblano pepper, diced',
      '1 can (15 oz) black beans, drained',
      '½ cup salsa verde',
      '1 lime',
      'Cilantro, chopped',
      '1 tsp cumin, 1 tsp chili powder',
      'Salt, pepper',
      '1 tbsp olive oil'
    ],
    steps: [
      'Cook rice according to package. Fluff with fork and stir in diced poblano and cilantro.',
      'Season chicken with cumin, chili powder, salt, pepper.',
      'Cook chicken in olive oil over medium-high, 6-7 min per side. Let rest, then slice.',
      'Warm black beans in a small pot with a splash of water.',
      'Build bowls: ½ cup rice, sliced chicken, ¼ cup beans, salsa verde, lime squeeze.'
    ]
  },
  {
    id: 'yogurt-berry-bowl', name: 'Protein Yogurt Bowl', emoji: '🫐',
    desc: 'Greek yogurt with berries, granola, and honey — sweet box, high protein',
    category: 'sweet', cal: 350, pro: 30, time: '5 min', servings: 1,
    boxFit: 350,
    ingredients: [
      '1 cup nonfat Greek yogurt (e.g., Fage 0%)',
      '½ cup mixed berries (fresh or frozen)',
      '2 tbsp granola',
      '1 tbsp honey or sugar-free syrup',
      '1 scoop protein powder (optional, +25g protein)',
      'Pinch of cinnamon'
    ],
    steps: [
      'Scoop yogurt into a bowl.',
      'If using protein powder, mix it into the yogurt first.',
      'Top with berries, granola, and drizzle of honey.',
      'Sprinkle cinnamon on top. Eat immediately.'
    ]
  },
  {
    id: 'turkey-bolognese', name: 'Turkey Bolognese', emoji: '🍝',
    desc: 'Lean turkey meat sauce over pasta — classic, simple, high protein',
    category: 'pasta', cal: 430, pro: 36, time: '25 min', servings: 4,
    boxFit: 450,
    ingredients: [
      '1.5 lbs 93% lean ground turkey',
      '8 oz penne or spaghetti',
      '1 jar (24 oz) marinara sauce',
      '1 medium zucchini, diced small',
      '1 cup mushrooms, diced',
      '½ onion, diced',
      '3 cloves garlic, minced',
      '1 tsp Italian seasoning',
      '1 tbsp olive oil',
      'Salt, pepper'
    ],
    steps: [
      'Cook pasta according to package. Drain.',
      'Heat olive oil. Cook onion, garlic, mushrooms, and zucchini for 4 minutes.',
      'Add ground turkey. Break apart and cook until no longer pink, 6-7 min.',
      'Pour in marinara sauce and Italian seasoning. Simmer 10 minutes.',
      'Serve sauce over 1 cup cooked pasta per person.'
    ]
  },
  {
    id: 'overnight-oats', name: 'Protein Overnight Oats', emoji: '🥣',
    desc: 'Prep the night before — grab and go in the morning',
    category: 'sweet', cal: 380, pro: 28, time: '5 min prep', servings: 1,
    boxFit: 400,
    ingredients: [
      '½ cup rolled oats',
      '1 scoop vanilla protein powder',
      '¾ cup unsweetened almond milk',
      '¼ cup Greek yogurt',
      '1 tbsp chia seeds',
      '½ banana, sliced',
      '1 tsp honey (optional)'
    ],
    steps: [
      'Mix oats, protein powder, almond milk, yogurt, and chia seeds in a jar.',
      'Stir well until combined. Cover and refrigerate overnight (or at least 4 hours).',
      'In the morning, top with sliced banana and optional honey.',
      'Eat cold or microwave 1-2 minutes if you prefer warm.'
    ]
  },
  {
    id: 'carne-guisada', name: 'Carne Guisada', emoji: '🥩',
    desc: 'Slow-simmered beef stew in a tomato-cumin gravy — great for meal prep',
    category: 'guisados', cal: 400, pro: 35, time: '1.5 hrs', servings: 6,
    boxFit: 400,
    ingredients: [
      '2 lbs beef stew meat (trimmed lean)',
      '1 can (14 oz) diced tomatoes',
      '1 medium onion, diced',
      '1 jalapeño, minced',
      '4 cloves garlic, minced',
      '2 tbsp flour',
      '1 tbsp cumin',
      '1 tsp chili powder',
      '2 cups beef broth',
      '1 tbsp olive oil',
      'Salt, pepper',
      'Flour tortillas for serving'
    ],
    steps: [
      'Cut beef into 1-inch cubes. Season with salt, pepper, cumin, and flour.',
      'Brown beef in olive oil in a heavy pot, working in batches. Remove.',
      'Cook onion, jalapeño, and garlic in the same pot for 3 minutes.',
      'Add tomatoes, chili powder, and beef broth. Scrape up browned bits.',
      'Return beef to pot. Bring to a boil, then reduce to low. Cover and simmer 1 hour until beef is fork-tender.',
      'Serve with warm flour tortillas (1 per serving).'
    ]
  }
];

// ---- QUICK MEALS DATABASE ----
const QUICK_MEALS = {
  frozen: [
    { name: 'Healthy Choice Power Bowl (Chicken)', cal: 320, pro: 22, where: 'Grocery store', tip: 'Add a Greek yogurt on the side for +18g protein' },
    { name: 'Lean Cuisine Protein Kick (Herb Chicken)', cal: 290, pro: 20, where: 'Grocery store', tip: 'Pair with a side salad or fruit for volume' },
    { name: "Amy's Light Sodium Bean & Cheese Burrito", cal: 310, pro: 14, where: 'Grocery store', tip: 'Add 3 oz rotisserie chicken for +21g protein' },
    { name: 'Evol Chicken Enchilada Bowl', cal: 390, pro: 18, where: 'Grocery store', tip: 'Good base — add extra protein if needed' },
    { name: 'Saffron Road Chicken Tikka Masala', cal: 320, pro: 20, where: 'Grocery store', tip: 'Pair with a protein shake for a complete box' },
  ],
  restaurant: [
    { name: 'Grilled Nuggets (12-count) + Side Salad', cal: 350, pro: 38, where: "Chick-fil-A", tip: 'Skip the dressing or use light balsamic' },
    { name: 'Chicken Bowl (no rice, extra veggies)', cal: 420, pro: 45, where: 'Chipotle', tip: 'Add rice back (+130 cal) if you have room in your box' },
    { name: 'Turkey Sub (6") on Wheat', cal: 380, pro: 26, where: 'Subway', tip: 'Load up on veggies for free volume' },
    { name: 'Grilled Chicken Sandwich (no mayo)', cal: 390, pro: 35, where: "McDonald's", tip: 'Side salad instead of fries saves 250+ calories' },
    { name: 'Power Menu Bowl (chicken)', cal: 460, pro: 26, where: 'Taco Bell', tip: 'Ask for no sour cream to save 30 cal' },
    { name: 'Dave\'s Single (no mayo, lettuce wrap)', cal: 390, pro: 30, where: "Wendy's", tip: 'Lettuce wrap saves the bun calories for something else' },
  ],
  nocook: [
    { name: 'Rotisserie Chicken + Bagged Salad + Tortilla', cal: 420, pro: 35, where: 'Any grocery deli', tip: '4 oz chicken + whole bag of salad + 1 tortilla' },
    { name: 'Greek Yogurt + Banana + Peanut Butter', cal: 380, pro: 25, where: 'Home', tip: '1 cup yogurt + 1 banana + 1 tbsp PB' },
    { name: 'Tuna Packet + Crackers + Veggies', cal: 300, pro: 28, where: 'Home/office', tip: 'Starkist or Bumble Bee packets + 6 crackers + baby carrots' },
    { name: 'Deli Turkey Roll-Ups + Cheese + Fruit', cal: 350, pro: 30, where: 'Home', tip: '5 oz deli turkey + 1 oz cheese + apple' },
    { name: 'Protein Shake + PB&J Sandwich', cal: 450, pro: 38, where: 'Home', tip: '1 scoop protein in milk + thin-spread PB&J' },
    { name: 'Cottage Cheese + Fruit + Almonds', cal: 320, pro: 26, where: 'Home', tip: '1 cup cottage cheese + ½ cup fruit + 10 almonds' },
  ]
};

// ---- FOOD DATABASE (same as before, abbreviated for reference) ----
const FOODS = {
  protein: [
    { id: 'chicken-breast', name: 'Chicken Breast', emoji: '🍗', portion: '4 oz cooked', cal: 130, pro: 26, category: 'protein', badge: 'green' },
    { id: 'turkey-breast', name: 'Turkey Breast', emoji: '🦃', portion: '4 oz cooked', cal: 120, pro: 26, category: 'protein', badge: 'green' },
    { id: '96-lean-beef', name: '96% Lean Beef', emoji: '🥩', portion: '4 oz cooked', cal: 170, pro: 25, category: 'protein', badge: 'green' },
    { id: 'shrimp', name: 'Shrimp', emoji: '🦐', portion: '4 oz cooked', cal: 100, pro: 24, category: 'protein', badge: 'green' },
    { id: 'white-fish', name: 'White Fish', emoji: '🐟', portion: '4 oz cooked', cal: 110, pro: 24, category: 'protein', badge: 'green' },
    { id: 'tuna', name: 'Tuna', emoji: '🐟', portion: '1 can drained', cal: 120, pro: 28, category: 'protein', badge: 'green' },
    { id: 'greek-yogurt', name: 'Greek Yogurt 0%', emoji: '🥛', portion: '1 cup', cal: 100, pro: 18, category: 'protein', badge: 'green' },
    { id: 'cottage-cheese', name: 'Low-Fat Cottage', emoji: '🧀', portion: '1 cup', cal: 160, pro: 24, category: 'protein', badge: 'green' },
    { id: 'egg-whites', name: 'Egg Whites', emoji: '🥚', portion: '1 cup', cal: 120, pro: 26, category: 'protein', badge: 'green' },
    { id: 'lean-pork', name: 'Lean Pork Loin', emoji: '🥩', portion: '4 oz cooked', cal: 150, pro: 26, category: 'protein', badge: 'green' },
    { id: 'whole-eggs', name: 'Whole Eggs', emoji: '🥚', portion: '2 large', cal: 140, pro: 12, category: 'protein', badge: 'yellow' },
    { id: 'salmon', name: 'Salmon', emoji: '🐟', portion: '4 oz cooked', cal: 230, pro: 25, category: 'protein', badge: 'yellow' },
    { id: '85-lean-beef', name: '85% Lean Beef', emoji: '🥩', portion: '4 oz cooked', cal: 240, pro: 22, category: 'protein', badge: 'yellow' },
    { id: 'deli-turkey', name: 'Lean Deli Turkey', emoji: '🥪', portion: '4 oz', cal: 110, pro: 18, category: 'protein', badge: 'green' },
  ],
  volume: [
    { id: 'broccoli', name: 'Broccoli', emoji: '🥦', portion: '1 cup chopped', cal: 30, pro: 3, category: 'volume', badge: 'green' },
    { id: 'bell-peppers', name: 'Bell Peppers', emoji: '🫑', portion: '1 cup sliced', cal: 30, pro: 1, category: 'volume', badge: 'green' },
    { id: 'tomatoes', name: 'Tomatoes', emoji: '🍅', portion: '1 cup diced', cal: 30, pro: 1, category: 'volume', badge: 'green' },
    { id: 'mushrooms', name: 'Mushrooms', emoji: '🍄', portion: '1 cup sliced', cal: 15, pro: 2, category: 'volume', badge: 'green' },
    { id: 'spinach', name: 'Spinach', emoji: '🥬', portion: '2 cups raw', cal: 14, pro: 2, category: 'volume', badge: 'green' },
    { id: 'cucumbers', name: 'Cucumbers', emoji: '🥒', portion: '1 cup sliced', cal: 16, pro: 1, category: 'volume', badge: 'green' },
    { id: 'zucchini', name: 'Zucchini', emoji: '🥒', portion: '1 cup sliced', cal: 20, pro: 1, category: 'volume', badge: 'green' },
    { id: 'cauliflower', name: 'Cauliflower', emoji: '🥦', portion: '1 cup', cal: 25, pro: 2, category: 'volume', badge: 'green' },
    { id: 'berries', name: 'Mixed Berries', emoji: '🫐', portion: '1 cup', cal: 70, pro: 1, category: 'volume', badge: 'green' },
    { id: 'watermelon', name: 'Watermelon', emoji: '🍉', portion: '1 cup diced', cal: 46, pro: 1, category: 'volume', badge: 'green' },
    { id: 'apple', name: 'Apple', emoji: '🍎', portion: '1 medium', cal: 95, pro: 0, category: 'volume', badge: 'green' },
    { id: 'salsa', name: 'Salsa', emoji: '🫙', portion: '¼ cup', cal: 18, pro: 1, category: 'volume', badge: 'green' },
  ],
  dial: [
    { id: 'white-rice', name: 'White Rice', emoji: '🍚', portion: '1 cup cooked', cal: 200, pro: 4, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 200, baseGrams: 160, unit: 'g' },
    { id: 'pasta', name: 'Pasta', emoji: '🍝', portion: '1 cup cooked', cal: 200, pro: 7, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 200, baseGrams: 140, unit: 'g' },
    { id: 'tortilla-flour', name: 'Flour Tortilla', emoji: '🫓', portion: '1 large', cal: 140, pro: 4, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 140, baseGrams: 1, unit: 'tortilla' },
    { id: 'tortilla-corn', name: 'Corn Tortillas', emoji: '🫓', portion: '2 small', cal: 110, pro: 3, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 110, baseGrams: 2, unit: 'tortillas' },
    { id: 'potato', name: 'Potato', emoji: '🥔', portion: '1 medium', cal: 160, pro: 4, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 160, baseGrams: 150, unit: 'g' },
    { id: 'bread', name: 'Bread', emoji: '🍞', portion: '2 slices', cal: 160, pro: 6, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 160, baseGrams: 2, unit: 'slices' },
    { id: 'beans', name: 'Black Beans', emoji: '🫘', portion: '½ cup', cal: 110, pro: 7, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 110, baseGrams: 130, unit: 'g' },
    { id: 'oatmeal', name: 'Oatmeal', emoji: '🥣', portion: '½ cup dry', cal: 150, pro: 5, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 150, baseGrams: 40, unit: 'g' },
  ],
  flavor: [
    { id: 'hot-sauce', name: 'Hot Sauce', emoji: '🌶️', portion: '1 tbsp', cal: 0, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'salsa-f', name: 'Salsa', emoji: '🫙', portion: '2 tbsp', cal: 10, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'mustard', name: 'Mustard', emoji: '🟡', portion: '1 tbsp', cal: 5, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'garlic', name: 'Garlic', emoji: '🧄', portion: '2 cloves', cal: 10, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'lime', name: 'Lime Juice', emoji: '🍋', portion: '1 lime', cal: 10, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'herbs', name: 'Fresh Herbs', emoji: '🌿', portion: '2 tbsp chopped', cal: 2, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'vinegar', name: 'Vinegar', emoji: '🫗', portion: '1 tbsp', cal: 3, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'soy-sauce', name: 'Soy Sauce', emoji: '🥢', portion: '1 tbsp', cal: 10, pro: 1, category: 'flavor', badge: 'green' },
    { id: 'onion', name: 'Onion', emoji: '🧅', portion: '¼ cup diced', cal: 16, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'cilantro', name: 'Cilantro', emoji: '🌿', portion: '2 tbsp', cal: 1, pro: 0, category: 'flavor', badge: 'green' },
  ],
  measure: [
    { id: 'olive-oil', name: 'Olive Oil', emoji: '🫒', portion: '1 tbsp', cal: 120, pro: 0, category: 'measure', badge: 'red' },
    { id: 'butter', name: 'Butter', emoji: '🧈', portion: '1 tbsp', cal: 100, pro: 0, category: 'measure', badge: 'red' },
    { id: 'peanut-butter', name: 'Peanut Butter', emoji: '🥜', portion: '2 tbsp', cal: 190, pro: 7, category: 'measure', badge: 'red' },
    { id: 'cheese', name: 'Cheddar Cheese', emoji: '🧀', portion: '1 oz', cal: 110, pro: 7, category: 'measure', badge: 'red' },
    { id: 'avocado', name: 'Avocado', emoji: '🥑', portion: '½ medium', cal: 120, pro: 1, category: 'measure', badge: 'red' },
    { id: 'nuts', name: 'Mixed Nuts', emoji: '🥜', portion: '¼ cup', cal: 170, pro: 5, category: 'measure', badge: 'red' },
    { id: 'granola', name: 'Granola', emoji: '🥣', portion: '¼ cup', cal: 120, pro: 3, category: 'measure', badge: 'red' },
  ]
};

const allFoods = [...FOODS.protein, ...FOODS.volume, ...FOODS.dial, ...FOODS.flavor, ...FOODS.measure];

const CATEGORY_LABELS = {
  protein: { label: '🥩 Protein Anchors', desc: 'Start here' },
  volume: { label: '🥦 Volume Foods', desc: 'Fill up' },
  dial: { label: '🍚 Calorie Dials', desc: 'Portions move' },
  flavor: { label: '🌶️ Flavor Boosters', desc: 'Big flavor, small budget' },
  measure: { label: '⚠️ Measure These', desc: "Don't free-pour" },
};

// ---- SCREEN NAVIGATION ----
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('screen-' + name);
  if (screen) screen.classList.add('active');

  const nav = document.getElementById('bottom-nav');
  const showNav = ['daily', 'builder', 'library', 'results', 'recipes', 'grocery', 'quick'].includes(name);
  nav.style.display = showNav ? 'flex' : 'none';
  document.body.classList.toggle('has-nav', showNav);

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNav = document.querySelector(`[data-nav="${name}"]`);
  if (activeNav) activeNav.classList.add('active');

  window.scrollTo(0, 0);

  if (name === 'quiz') initQuiz();
  if (name === 'library') initLibrary();
  if (name === 'daily') updateDailyView();
  if (name === 'recipes') initRecipes();
  if (name === 'quick') initQuickMeals();
  if (name === 'grocery') generateGroceryList();
}

// ---- QUIZ ----
function initQuiz() {
  state.currentQuestion = 1;
  updateQuizProgress();
  showQuestion(1);
}

function updateQuizProgress() {
  const container = document.getElementById('quiz-progress');
  container.innerHTML = '';
  for (let i = 1; i <= state.totalQuestions; i++) {
    const dot = document.createElement('div');
    dot.className = 'quiz-dot';
    if (i < state.currentQuestion) dot.classList.add('done');
    if (i === state.currentQuestion) dot.classList.add('current');
    container.appendChild(dot);
  }
}

function showQuestion(num) {
  state.currentQuestion = num;
  updateQuizProgress();
  document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
  const q = document.querySelector(`.quiz-question[data-q="${num}"]`);
  if (q) q.classList.add('active');
}

function selectOption(question, value) {
  const container = document.querySelector(`.quiz-question[data-q="${question}"]`);
  container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  event.currentTarget.classList.add('selected');

  if (question === 1) { state.sex = value; setTimeout(() => showQuestion(2), 300); }
  else if (question === 5) { state.activity = value; setTimeout(() => showQuestion(6), 300); }
  else if (question === 6) { state.goal = value; setTimeout(() => showQuestion(7), 300); }
  else if (question === 7) { state.frequency = value; setTimeout(() => calculatePlan(), 300); }
}

function prevQuestion() {
  if (state.currentQuestion > 1) showQuestion(state.currentQuestion - 1);
}

function submitAge() {
  const age = parseInt(document.getElementById('input-age').value);
  if (!age || age < 16 || age > 99) { document.getElementById('input-age').style.borderColor = 'var(--red)'; return; }
  state.age = age;
  showQuestion(3);
}

function setHeightUnit(unit) {
  state.heightUnit = unit;
  const btns = document.querySelectorAll('#height-units button');
  btns.forEach(b => b.classList.remove('active'));
  if (unit === 'imperial') { btns[0].classList.add('active'); document.getElementById('height-imperial').style.display = 'block'; document.getElementById('height-metric').style.display = 'none'; }
  else { btns[1].classList.add('active'); document.getElementById('height-imperial').style.display = 'none'; document.getElementById('height-metric').style.display = 'block'; }
}

function submitHeight() {
  if (state.heightUnit === 'imperial') {
    const feet = parseInt(document.getElementById('input-feet').value);
    const inches = parseInt(document.getElementById('input-inches').value) || 0;
    if (!feet || feet < 4 || feet > 7) { document.getElementById('input-feet').style.borderColor = 'var(--red)'; return; }
    state.heightCm = (feet * 12 + inches) * 2.54;
  } else {
    const cm = parseInt(document.getElementById('input-cm').value);
    if (!cm || cm < 120 || cm > 230) { document.getElementById('input-cm').style.borderColor = 'var(--red)'; return; }
    state.heightCm = cm;
  }
  showQuestion(4);
}

function setWeightUnit(unit) {
  state.weightUnit = unit;
  const btns = document.querySelectorAll('#weight-units button');
  btns.forEach(b => b.classList.remove('active'));
  if (unit === 'imperial') { btns[0].classList.add('active'); document.getElementById('weight-imperial').style.display = 'block'; document.getElementById('weight-metric').style.display = 'none'; }
  else { btns[1].classList.add('active'); document.getElementById('weight-imperial').style.display = 'none'; document.getElementById('weight-metric').style.display = 'block'; }
}

function submitWeight() {
  if (state.weightUnit === 'imperial') {
    const lbs = parseInt(document.getElementById('input-lbs').value);
    if (!lbs || lbs < 80 || lbs > 500) { document.getElementById('input-lbs').style.borderColor = 'var(--red)'; return; }
    state.weightLbs = lbs; state.weightKg = lbs / 2.20462;
  } else {
    const kg = parseInt(document.getElementById('input-kg').value);
    if (!kg || kg < 35 || kg > 230) { document.getElementById('input-kg').style.borderColor = 'var(--red)'; return; }
    state.weightKg = kg; state.weightLbs = kg * 2.20462;
  }
  showQuestion(5);
}

// ---- CALORIE ENGINE ----
function calculatePlan() {
  const { weightKg: kg, heightCm: cm, age, sex, activity, goal } = state;

  // Mifflin–St Jeor BMR
  state.bmr = sex === 'male'
    ? (10 * kg) + (6.25 * cm) - (5 * age) + 5
    : (10 * kg) + (6.25 * cm) - (5 * age) - 161;

  state.maintenance = state.bmr * activity;

  // Goal-based target (replaces percentage deficit)
  // 1 lb/week = 3,500 cal/week ÷ 7 = 500 cal/day deficit
  if (goal === 'lose') {
    state.calorieTarget = state.maintenance - 500;
  } else if (goal === 'gain') {
    state.calorieTarget = state.maintenance + 300;
  } else {
    state.calorieTarget = state.maintenance;
  }

  // Safety floor: never below 1200 for women, 1400 for men
  const floor = sex === 'female' ? 1200 : 1400;
  if (state.calorieTarget < floor) state.calorieTarget = floor;

  // Calorie lane — nearest 200
  state.calorieLane = Math.round(state.calorieTarget / 200) * 200;

  // Protein — 0.7g per lb, rounded to nearest 10
  state.proteinTarget = Math.round((state.weightLbs * 0.7) / 10) * 10;

  // Box calculation
  state.boxCalories = Math.round(state.calorieLane / state.frequency);
  state.boxProtein = Math.round(state.proteinTarget / state.frequency);

  state.boxes = [];
  state.selectedRecipes = [];
  showResults();
}

function showResults() {
  document.getElementById('r-calories').textContent = state.calorieLane.toLocaleString();
  document.getElementById('r-protein').textContent = state.proteinTarget + 'g';
  document.getElementById('r-freq').textContent = state.frequency;
  document.getElementById('r-box-cal').textContent = state.boxCalories;
  document.getElementById('r-box-pro').textContent = state.boxProtein + 'g';

  // Populate calculation breakdown
  const maint = Math.round(state.maintenance);
  const maintDisplay = `~${(Math.round(maint / 100) * 100).toLocaleString()} cal/day`;
  document.getElementById('r-maintenance').textContent = maintDisplay;

  if (state.goal === 'lose') {
    document.getElementById('r-goal-label').textContent = 'Weight Loss Goal';
    document.getElementById('r-goal-adjust').textContent = '−500 cal/day (≈1 lb/week)';
  } else if (state.goal === 'gain') {
    document.getElementById('r-goal-label').textContent = 'Weight Gain Goal';
    document.getElementById('r-goal-adjust').textContent = '+300 cal/day (lean gain)';
  } else {
    document.getElementById('r-goal-label').textContent = 'Goal';
    document.getElementById('r-goal-adjust').textContent = 'Maintain — no adjustment';
  }

  document.getElementById('r-target-display').textContent = `${state.calorieLane.toLocaleString()} cal/day`;
  document.getElementById('r-freq2').textContent = state.frequency;
  document.getElementById('r-per-meal').textContent = `${state.boxCalories} cal/meal`;

  showScreen('results');
}

// ---- RECIPES ----
let activeRecipeCat = 'all';

function initRecipes() {
  // Show/hide plan context nudge
  const hasPlan = !!state.calorieLane;
  const planNudge = document.getElementById('recipe-plan-nudge');
  const noPlanNudge = document.getElementById('recipe-no-plan-nudge');
  if (hasPlan) {
    planNudge.style.display = 'block';
    noPlanNudge.style.display = 'none';
    document.getElementById('nudge-cal').textContent = state.boxCalories;
    document.getElementById('nudge-pro').textContent = state.boxProtein;
  } else {
    planNudge.style.display = 'none';
    noPlanNudge.style.display = 'block';
  }
  renderRecipeTabs();
  renderRecipeGrid();
  updateGroceryBtn();
}

function renderRecipeTabs() {
  const cats = ['all', 'guisados', 'pasta', 'bowls', 'sweet'];
  const labels = { all: 'All', guisados: '🌶️ Guisados', pasta: '🍝 Pasta', bowls: '🍚 Bowls', sweet: '🫐 Sweet' };
  document.getElementById('recipe-tabs').innerHTML = cats.map(c =>
    `<button class="cat-tab ${c === activeRecipeCat ? 'active' : ''}" onclick="setRecipeCat('${c}')">${labels[c]}</button>`
  ).join('');
}

function setRecipeCat(cat) { activeRecipeCat = cat; renderRecipeTabs(); renderRecipeGrid(); }

function renderRecipeGrid() {
  const recipes = activeRecipeCat === 'all' ? RECIPES : RECIPES.filter(r => r.category === activeRecipeCat);
  const grid = document.getElementById('recipe-grid');
  const hasPlan = !!state.calorieLane;
  grid.innerHTML = recipes.map(r => {
    const isSelected = state.selectedRecipes.includes(r.id);
    const boxFit = hasPlan ? (Math.abs(r.cal - state.boxCalories) <= 100 ? '✓ Fits your box' : `Box: ~${state.boxCalories} cal`) : '';
    return `
      <div class="recipe-card ${isSelected ? 'selected' : ''}">
        <div class="recipe-card-header" onclick="openRecipeDetail('${r.id}')">
          <span class="recipe-emoji">${r.emoji}</span>
          <div class="recipe-card-info">
            <h3>${r.name}</h3>
            <div class="recipe-desc">${r.desc}</div>
          </div>
        </div>
        <div class="recipe-macros">
          <span class="recipe-macro cal">${r.cal} cal</span>
          <span class="recipe-macro pro">${r.pro}g protein</span>
          <span class="recipe-macro time">⏱ ${r.time}</span>
        </div>
        ${hasPlan && boxFit ? `<span class="recipe-badge">${boxFit}</span>` : `<span class="recipe-badge">Makes ${r.servings} servings</span>`}
        <div class="recipe-actions">
          <button class="btn-recipe-view" onclick="openRecipeDetail('${r.id}')">📖 View Recipe</button>
          <button class="btn-recipe-select ${isSelected ? 'selected' : ''}" onclick="toggleRecipe('${r.id}')">
            ${isSelected ? '✓ In List' : '+ Grocery List'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Make cards clickable for detail view on long-press / double tap
  grid.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const id = card.querySelector('[onclick]') ? null : null;
      // detail handled by button below
    });
  });
}

function toggleRecipe(id) {
  const idx = state.selectedRecipes.indexOf(id);
  if (idx >= 0) state.selectedRecipes.splice(idx, 1);
  else state.selectedRecipes.push(id);
  renderRecipeGrid();
  updateGroceryBtn();
}

function updateGroceryBtn() {
  const btn = document.getElementById('grocery-btn');
  const count = document.getElementById('selected-recipe-count');
  if (state.selectedRecipes.length > 0) {
    btn.style.display = 'flex';
    count.textContent = state.selectedRecipes.length;
  } else {
    btn.style.display = 'none';
  }
}

function openRecipeDetail(id) {
  const r = RECIPES.find(x => x.id === id);
  if (!r) return;
  const modal = document.getElementById('recipe-modal');
  document.getElementById('recipe-modal-body').innerHTML = `
    <div class="modal-recipe-title">${r.emoji} ${r.name}</div>
    <div class="modal-recipe-macros">
      <span class="recipe-macro cal">${r.cal} cal/serving</span>
      <span class="recipe-macro pro">${r.pro}g protein</span>
      <span class="recipe-macro time">⏱ ${r.time}</span>
    </div>
    <p style="color: var(--text-muted); margin-bottom: 20px;">${r.desc}. Makes ${r.servings} servings.</p>
    <div class="modal-section">
      <h4>Ingredients</h4>
      <ul class="ingredient-list">${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
    <div class="modal-section">
      <h4>Steps</h4>
      <ol class="step-list">${r.steps.map(s => `<li>${s}</li>`).join('')}</ol>
    </div>
    <button class="btn btn-primary btn-full mt-24" onclick="closeRecipeModal()">Close</button>
  `;
  modal.style.display = 'flex';
}

function closeRecipeModal() {
  document.getElementById('recipe-modal').style.display = 'none';
}

// ---- GROCERY LIST ----
function generateGroceryList() {
  const selectedRecipes = RECIPES.filter(r => state.selectedRecipes.includes(r.id));
  if (selectedRecipes.length === 0) {
    document.getElementById('grocery-list').innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px 0;">No recipes selected. Go to Recipes and tap to select some!</p>';
    document.getElementById('grocery-subtitle').textContent = 'Select recipes first';
    return;
  }

  document.getElementById('grocery-subtitle').textContent = `Based on ${selectedRecipes.length} recipe${selectedRecipes.length > 1 ? 's' : ''}`;

  // Combine all ingredients
  const allIngredients = [];
  selectedRecipes.forEach(r => {
    r.ingredients.forEach(ing => allIngredients.push(ing));
  });

  // Categorize ingredients (simple heuristic)
  const sections = {
    'Produce': [],
    'Meat & Protein': [],
    'Dairy': [],
    'Pantry & Canned': [],
    'Grains & Pasta': [],
    'Spices & Seasonings': []
  };

  const produceWords = ['onion', 'garlic', 'pepper', 'poblano', 'jalapeño', 'tomato', 'carrot', 'potato', 'zucchini', 'mushroom', 'cilantro', 'lime', 'banana', 'berries', 'fruit', 'spinach', 'lettuce'];
  const meatWords = ['chicken', 'turkey', 'beef', 'pork', 'shrimp', 'fish', 'tuna', 'stew meat'];
  const dairyWords = ['yogurt', 'cheese', 'cream', 'milk', 'sour cream', 'cottage'];
  const grainWords = ['rice', 'pasta', 'spaghetti', 'penne', 'tortilla', 'bread', 'oats', 'granola', 'flour'];
  const spiceWords = ['salt', 'pepper', 'cumin', 'chili powder', 'italian seasoning', 'cinnamon', 'honey', 'syrup'];

  allIngredients.forEach(ing => {
    const low = ing.toLowerCase();
    if (meatWords.some(w => low.includes(w))) sections['Meat & Protein'].push(ing);
    else if (dairyWords.some(w => low.includes(w))) sections['Dairy'].push(ing);
    else if (grainWords.some(w => low.includes(w))) sections['Grains & Pasta'].push(ing);
    else if (spiceWords.some(w => low.includes(w))) sections['Spices & Seasonings'].push(ing);
    else if (produceWords.some(w => low.includes(w))) sections['Produce'].push(ing);
    else sections['Pantry & Canned'].push(ing);
  });

  // Render
  let html = '';
  Object.entries(sections).forEach(([section, items]) => {
    if (items.length === 0) return;
    // Deduplicate similar items
    const unique = [...new Set(items)];
    html += `
      <div class="grocery-section">
        <div class="grocery-section-header">${section}</div>
        ${unique.map((item, i) => `
          <div class="grocery-item" onclick="toggleGroceryCheck(this)">
            <div class="grocery-check"></div>
            <span class="grocery-text">${item}</span>
          </div>
        `).join('')}
      </div>
    `;
  });

  document.getElementById('grocery-list').innerHTML = html;
}

function toggleGroceryCheck(el) {
  const check = el.querySelector('.grocery-check');
  const isChecked = check.classList.toggle('checked');
  el.classList.toggle('checked-item', isChecked);
  if (isChecked) check.textContent = '✓';
  else check.textContent = '';
}

function copyGroceryList() {
  const items = document.querySelectorAll('.grocery-text');
  const text = Array.from(items).map(i => '• ' + i.textContent).join('\n');
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('[onclick="copyGroceryList()"]');
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy List', 2000);
  });
}

// ---- QUICK MEALS ----
let activeQuickCat = 'all';

function initQuickMeals() {
  renderQuickTabs();
  renderQuickGrid();
}

function renderQuickTabs() {
  const cats = ['all', 'frozen', 'restaurant', 'nocook'];
  const labels = { all: 'All', frozen: '🧊 Frozen', restaurant: '🍔 Restaurant', nocook: '🚫🔥 No-Cook' };
  document.getElementById('quick-tabs').innerHTML = cats.map(c =>
    `<button class="cat-tab ${c === activeQuickCat ? 'active' : ''}" onclick="setQuickCat('${c}')">${labels[c]}</button>`
  ).join('');
}

function setQuickCat(cat) { activeQuickCat = cat; renderQuickTabs(); renderQuickGrid(); }

function renderQuickGrid() {
  const container = document.getElementById('quick-grid');
  let html = '';

  const categories = activeQuickCat === 'all'
    ? [['frozen', '🧊 Frozen Meals'], ['restaurant', '🍔 Restaurant Orders'], ['nocook', '🚫🔥 No-Cook Combos']]
    : [[activeQuickCat, '']];

  categories.forEach(([cat, label]) => {
    const items = QUICK_MEALS[cat];
    if (!items) return;
    if (label) html += `<div class="quick-category-header">${label}</div>`;
    items.forEach(item => {
      html += `
        <div class="quick-card">
          <div class="quick-card-header">
            <h3>${item.name}</h3>
            <span class="quick-where">${item.where}</span>
          </div>
          <div class="quick-macros">
            <span class="recipe-macro cal">${item.cal} cal</span>
            <span class="recipe-macro pro">${item.pro}g protein</span>
          </div>
          <div class="quick-tip">💡 ${item.tip}</div>
        </div>
      `;
    });
  });

  container.innerHTML = html;
}

// ---- MEAL BUILDER ----
function startBuilder() {
  state.selectedFoods = [];
  state.currentCalories = 0;
  state.currentProtein = 0;
  document.getElementById('b-target-cal').textContent = state.boxCalories || 450;
  document.getElementById('b-target-pro').textContent = state.boxProtein || 30;
  renderFoodScroll('protein-foods', FOODS.protein);
  renderFoodScroll('volume-foods', FOODS.volume);
  renderFoodScroll('dial-foods', FOODS.dial);
  renderFoodScroll('flavor-foods', FOODS.flavor);
  updateBuilderProgress();
  renderSelectedFoods();
  showScreen('builder');
}

function renderFoodScroll(containerId, foods) {
  const container = document.getElementById(containerId);
  container.innerHTML = foods.map(food => {
    const badgeClass = food.badge === 'green' ? 'badge-green' : food.badge === 'yellow' ? 'badge-yellow' : 'badge-red';
    const badgeText = food.badge === 'green' ? 'Efficient' : food.badge === 'yellow' ? 'Moderate' : 'Measure';
    return `
      <div class="food-card" data-id="${food.id}" onclick="toggleFood('${food.id}', this)">
        <div class="food-emoji">${food.emoji}</div>
        <div class="food-name">${food.name}</div>
        <div class="food-portion">${food.portion}</div>
        <div class="food-macros">
          <span class="food-cal">${food.cal} cal</span>
          <span class="food-pro">${food.pro}g pro</span>
        </div>
        ${food.category === 'protein' || food.category === 'measure' ? `<span class="efficiency-badge ${badgeClass}">${badgeText}</span>` : ''}
      </div>
    `;
  }).join('');
}

function toggleFood(foodId, cardEl) {
  const food = allFoods.find(f => f.id === foodId);
  if (!food) return;
  const existing = state.selectedFoods.findIndex(f => f.food.id === foodId);
  if (existing >= 0) {
    state.selectedFoods.splice(existing, 1);
    cardEl.classList.remove('selected');
    if (food.adjustable) document.getElementById('dial-portion').classList.remove('visible');
  } else {
    state.selectedFoods.push({ food, servings: 1 });
    cardEl.classList.add('selected');
    if (food.adjustable) showPortionControl(food);
  }
  recalcBuilder();
}

function showPortionControl(food) {
  const container = document.getElementById('dial-portion');
  const entry = state.selectedFoods.find(f => f.food.id === food.id);
  if (!entry) return;
  const currentCal = Math.round(food.cal * entry.servings);
  container.innerHTML = `
    <div class="portion-header">
      <span class="portion-food-name">${food.emoji} ${food.name}</span>
      <span class="portion-cals">${currentCal} cal</span>
    </div>
    <div class="portion-slider-wrap">
      <button class="portion-btn" onclick="adjustPortion('${food.id}', -0.25)">−</button>
      <input type="range" min="0.25" max="3" step="0.25" value="${entry.servings}" oninput="slidePortion('${food.id}', this.value)">
      <button class="portion-btn" onclick="adjustPortion('${food.id}', 0.25)">+</button>
    </div>
    <div class="portion-amount">${entry.servings}× serving</div>
  `;
  container.classList.add('visible');
}

function adjustPortion(foodId, delta) {
  const entry = state.selectedFoods.find(f => f.food.id === foodId);
  if (!entry) return;
  entry.servings = Math.max(0.25, Math.min(3, entry.servings + delta));
  showPortionControl(entry.food);
  recalcBuilder();
}

function slidePortion(foodId, value) {
  const entry = state.selectedFoods.find(f => f.food.id === foodId);
  if (!entry) return;
  entry.servings = parseFloat(value);
  showPortionControl(entry.food);
  recalcBuilder();
}

function recalcBuilder() {
  state.currentCalories = 0;
  state.currentProtein = 0;
  state.selectedFoods.forEach(({ food, servings }) => {
    state.currentCalories += Math.round(food.cal * servings);
    state.currentProtein += Math.round(food.pro * servings);
  });
  updateBuilderProgress();
  renderSelectedFoods();
}

function updateBuilderProgress() {
  const targetCal = state.boxCalories || 450;
  const targetPro = state.boxProtein || 30;
  const calPct = Math.min(100, (state.currentCalories / targetCal) * 100);
  const proPct = Math.min(100, (state.currentProtein / targetPro) * 100);

  const calBar = document.getElementById('b-cal-bar');
  const proBar = document.getElementById('b-pro-bar');
  calBar.style.width = calPct + '%';
  proBar.style.width = proPct + '%';
  calBar.classList.toggle('over', state.currentCalories > targetCal * 1.1);

  const calNums = document.getElementById('b-cal-nums');
  const proNums = document.getElementById('b-pro-nums');
  calNums.textContent = `${state.currentCalories} / ${targetCal}`;
  proNums.textContent = `${state.currentProtein} / ${targetPro}g`;
  calNums.classList.toggle('done', state.currentCalories >= targetCal * 0.9 && state.currentCalories <= targetCal * 1.1);
  proNums.classList.toggle('done', state.currentProtein >= targetPro);
}

function renderSelectedFoods() {
  const container = document.getElementById('selected-foods');
  if (state.selectedFoods.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = state.selectedFoods.map(({ food, servings }) => {
    const cal = Math.round(food.cal * servings);
    const pro = Math.round(food.pro * servings);
    return `
      <div class="selected-food-item">
        <div><div class="sf-name">${food.emoji} ${food.name}</div><div class="sf-details">${cal} cal · ${pro}g protein</div></div>
        <button class="sf-remove" onclick="removeFood('${food.id}')">✕</button>
      </div>
    `;
  }).join('');
}

function removeFood(foodId) {
  state.selectedFoods = state.selectedFoods.filter(f => f.food.id !== foodId);
  document.querySelectorAll(`.food-card[data-id="${foodId}"]`).forEach(c => c.classList.remove('selected'));
  if (state.selectedFoods.every(f => !f.food.adjustable)) document.getElementById('dial-portion').classList.remove('visible');
  recalcBuilder();
}

function saveBox() {
  if (state.selectedFoods.length === 0) return;
  state.boxes.push({ foods: [...state.selectedFoods], totalCal: state.currentCalories, totalPro: state.currentProtein });
  showScreen('daily');
}

// ---- FOOD LIBRARY ----
let activeCategory = 'all';

function initLibrary() {
  renderCategoryTabs();
  renderLibraryGrid();
}

function renderCategoryTabs() {
  const cats = ['all', 'protein', 'volume', 'dial', 'flavor', 'measure'];
  const labels = { all: 'All Foods', protein: 'Protein', volume: 'Volume', dial: 'Dials', flavor: 'Flavor', measure: 'Measure' };
  document.getElementById('category-tabs').innerHTML = cats.map(cat =>
    `<button class="cat-tab ${cat === activeCategory ? 'active' : ''}" onclick="setCategoryLib('${cat}')">${labels[cat]}</button>`
  ).join('');
}

function setCategoryLib(cat) { activeCategory = cat; renderCategoryTabs(); renderLibraryGrid(); }

function filterLibrary() { renderLibraryGrid(); }

function renderLibraryGrid() {
  const container = document.getElementById('library-grid');
  const search = (document.getElementById('food-search').value || '').toLowerCase();
  let foods = activeCategory === 'all' ? allFoods : (FOODS[activeCategory] || []);
  if (search) foods = allFoods.filter(f => f.name.toLowerCase().includes(search));

  if (activeCategory === 'all' && !search) {
    let html = '';
    Object.entries(CATEGORY_LABELS).forEach(([cat, info]) => {
      html += `<div class="library-category-header">${info.label}</div>`;
      (FOODS[cat] || []).forEach(food => { html += renderLibraryCard(food); });
    });
    container.innerHTML = html;
  } else {
    container.innerHTML = foods.map(food => renderLibraryCard(food)).join('');
  }
}

function renderLibraryCard(food) {
  const badgeClass = food.badge === 'green' ? 'badge-green' : food.badge === 'yellow' ? 'badge-yellow' : 'badge-red';
  const badgeLabel = food.badge === 'green' ? '🟢 Fill' : food.badge === 'yellow' ? '🟡 Dial' : '🔴 Measure';
  return `
    <div class="food-card"><div class="food-emoji">${food.emoji}</div><div class="food-name">${food.name}</div>
    <div class="food-portion">${food.portion}</div><div class="food-macros"><span class="food-cal">${food.cal} cal</span>
    <span class="food-pro">${food.pro}g pro</span></div><span class="efficiency-badge ${badgeClass}">${badgeLabel}</span></div>
  `;
}

// ---- DAILY VIEW ----
function updateDailyView() {
  const today = new Date();
  document.getElementById('daily-date').textContent = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const totalCal = state.boxes.reduce((sum, b) => sum + b.totalCal, 0);
  const totalPro = state.boxes.reduce((sum, b) => sum + b.totalPro, 0);
  const targetCal = state.calorieLane || 1800;
  const targetPro = state.proteinTarget || 120;

  document.getElementById('d-cal-summary').textContent = `${totalCal.toLocaleString()} / ${targetCal.toLocaleString()}`;
  document.getElementById('d-pro-summary').textContent = `${totalPro} / ${targetPro}g`;

  const calPct = Math.min(100, (totalCal / targetCal) * 100);
  const proPct = Math.min(100, (totalPro / targetPro) * 100);
  document.getElementById('d-cal-bar').style.width = calPct + '%';
  document.getElementById('d-pro-bar').style.width = proPct + '%';
  document.getElementById('d-cal-nums').textContent = Math.round(calPct) + '%';
  document.getElementById('d-pro-nums').textContent = Math.round(proPct) + '%';

  const freq = state.frequency || 4;
  const boxContainer = document.getElementById('daily-boxes');
  let html = '';
  for (let i = 0; i < freq; i++) {
    const box = state.boxes[i];
    if (box) {
      const pct = Math.min(100, (box.totalCal / (state.boxCalories || 450)) * 100);
      const isDone = box.totalCal >= (state.boxCalories || 450) * 0.8;
      html += `<div class="box-item"><div class="box-item-header"><span class="box-item-label">Box ${i + 1}</span><div class="box-item-check ${isDone ? 'done' : ''}">${isDone ? '✓' : ''}</div></div><div class="box-item-macros"><span><strong>${box.totalCal}</strong> / ${state.boxCalories} cal</span><span><strong>${box.totalPro}g</strong> / ${state.boxProtein}g pro</span></div><div class="box-item-bar"><div class="box-item-bar-fill" style="width: ${pct}%"></div></div></div>`;
    } else {
      html += `<div class="box-item empty" onclick="startBuilder()"><div class="box-item-header"><span class="box-item-label">Box ${i + 1}</span><div class="box-item-check"></div></div><div class="box-empty-text">Tap to build this box +</div></div>`;
    }
  }
  boxContainer.innerHTML = html;
}

// ---- EVENT LISTENERS ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const q = state.currentQuestion;
    if (q === 2) submitAge();
    else if (q === 3) submitHeight();
    else if (q === 4) submitWeight();
  }
});

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('focus', () => input.style.borderColor = 'var(--accent)');
  input.addEventListener('blur', () => input.style.borderColor = 'var(--border)');
});
