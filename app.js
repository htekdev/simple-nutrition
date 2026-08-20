// ============================================================
// Simple Nutrition — App Engine
// Know your number. Protein first. Portion moves.
// ============================================================

// ---- STATE ----
const state = {
  // Quiz answers
  sex: null,       // 'male' | 'female'
  age: null,       // number
  heightCm: null,  // number (always stored as cm)
  weightKg: null,  // number (always stored as kg)
  weightLbs: null, // number (for protein calc)
  activity: null,  // multiplier number
  frequency: null, // 2-6

  // Calculated plan
  bmr: null,
  maintenance: null,
  calorieTarget: null,
  calorieLane: null,
  proteinTarget: null,
  boxCalories: null,
  boxProtein: null,

  // Builder state
  selectedFoods: [],      // [{food, servings}]
  currentCalories: 0,
  currentProtein: 0,

  // Daily state
  boxes: [],              // [{foods: [...], totalCal, totalPro}]

  // Quiz navigation
  currentQuestion: 1,
  heightUnit: 'imperial',
  weightUnit: 'imperial',

  // Config
  deficitMultiplier: 0.85,
  proteinPerLb: 0.7,
};

// ---- FOOD DATABASE ----
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
    { id: 'cabbage', name: 'Cabbage', emoji: '🥬', portion: '1 cup shredded', cal: 22, pro: 1, category: 'volume', badge: 'green' },
    { id: 'salsa', name: 'Salsa', emoji: '🫙', portion: '¼ cup', cal: 18, pro: 1, category: 'volume', badge: 'green' },
    { id: 'berries', name: 'Mixed Berries', emoji: '🫐', portion: '1 cup', cal: 70, pro: 1, category: 'volume', badge: 'green' },
    { id: 'watermelon', name: 'Watermelon', emoji: '🍉', portion: '1 cup diced', cal: 46, pro: 1, category: 'volume', badge: 'green' },
    { id: 'apple', name: 'Apple', emoji: '🍎', portion: '1 medium', cal: 95, pro: 0, category: 'volume', badge: 'green' },
    { id: 'lettuce', name: 'Lettuce', emoji: '🥬', portion: '2 cups', cal: 10, pro: 1, category: 'volume', badge: 'green' },
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
    { id: 'sweet-potato', name: 'Sweet Potato', emoji: '🍠', portion: '1 medium', cal: 110, pro: 2, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 110, baseGrams: 130, unit: 'g' },
    { id: 'quinoa', name: 'Quinoa', emoji: '🍚', portion: '1 cup cooked', cal: 220, pro: 8, category: 'dial', badge: 'yellow', adjustable: true, basePortion: 220, baseGrams: 185, unit: 'g' },
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
    { id: 'pickles', name: 'Pickled Veg', emoji: '🥒', portion: '¼ cup', cal: 10, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'onion', name: 'Onion', emoji: '🧅', portion: '¼ cup diced', cal: 16, pro: 0, category: 'flavor', badge: 'green' },
    { id: 'cilantro', name: 'Cilantro', emoji: '🌿', portion: '2 tbsp', cal: 1, pro: 0, category: 'flavor', badge: 'green' },
  ],
  measure: [
    { id: 'olive-oil', name: 'Olive Oil', emoji: '🫒', portion: '1 tbsp', cal: 120, pro: 0, category: 'measure', badge: 'red' },
    { id: 'butter', name: 'Butter', emoji: '🧈', portion: '1 tbsp', cal: 100, pro: 0, category: 'measure', badge: 'red' },
    { id: 'peanut-butter', name: 'Peanut Butter', emoji: '🥜', portion: '2 tbsp', cal: 190, pro: 7, category: 'measure', badge: 'red' },
    { id: 'mayo', name: 'Mayonnaise', emoji: '🥄', portion: '1 tbsp', cal: 100, pro: 0, category: 'measure', badge: 'red' },
    { id: 'cheese', name: 'Cheddar Cheese', emoji: '🧀', portion: '1 oz', cal: 110, pro: 7, category: 'measure', badge: 'red' },
    { id: 'avocado', name: 'Avocado', emoji: '🥑', portion: '½ medium', cal: 120, pro: 1, category: 'measure', badge: 'red' },
    { id: 'nuts', name: 'Mixed Nuts', emoji: '🥜', portion: '¼ cup', cal: 170, pro: 5, category: 'measure', badge: 'red' },
    { id: 'ranch', name: 'Ranch Dressing', emoji: '🥗', portion: '2 tbsp', cal: 130, pro: 0, category: 'measure', badge: 'red' },
    { id: 'granola', name: 'Granola', emoji: '🥣', portion: '¼ cup', cal: 120, pro: 3, category: 'measure', badge: 'red' },
    { id: 'cream-cheese', name: 'Cream Cheese', emoji: '🧀', portion: '2 tbsp', cal: 100, pro: 2, category: 'measure', badge: 'red' },
  ]
};

const allFoods = [
  ...FOODS.protein,
  ...FOODS.volume,
  ...FOODS.dial,
  ...FOODS.flavor,
  ...FOODS.measure
];

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
  const showNav = ['daily', 'builder', 'library', 'results'].includes(name);
  nav.style.display = showNav ? 'flex' : 'none';
  document.body.classList.toggle('has-nav', showNav);

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNav = document.querySelector(`[data-nav="${name}"]`);
  if (activeNav) activeNav.classList.add('active');

  window.scrollTo(0, 0);

  // Initialize screens
  if (name === 'quiz') initQuiz();
  if (name === 'library') initLibrary();
  if (name === 'daily') updateDailyView();
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
  for (let i = 1; i <= 6; i++) {
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
  // Highlight selected
  const container = document.querySelector(`.quiz-question[data-q="${question}"]`);
  container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  event.currentTarget.classList.add('selected');

  if (question === 1) {
    state.sex = value;
    setTimeout(() => showQuestion(2), 300);
  } else if (question === 5) {
    state.activity = value;
    setTimeout(() => showQuestion(6), 300);
  } else if (question === 6) {
    state.frequency = value;
    setTimeout(() => calculatePlan(), 300);
  }
}

function prevQuestion() {
  if (state.currentQuestion > 1) {
    showQuestion(state.currentQuestion - 1);
  }
}

function submitAge() {
  const age = parseInt(document.getElementById('input-age').value);
  if (!age || age < 16 || age > 99) {
    document.getElementById('input-age').style.borderColor = 'var(--red)';
    return;
  }
  state.age = age;
  showQuestion(3);
}

function setHeightUnit(unit) {
  state.heightUnit = unit;
  const btns = document.querySelectorAll('#height-units button');
  btns.forEach(b => b.classList.remove('active'));
  if (unit === 'imperial') {
    btns[0].classList.add('active');
    document.getElementById('height-imperial').style.display = 'block';
    document.getElementById('height-metric').style.display = 'none';
  } else {
    btns[1].classList.add('active');
    document.getElementById('height-imperial').style.display = 'none';
    document.getElementById('height-metric').style.display = 'block';
  }
}

function submitHeight() {
  if (state.heightUnit === 'imperial') {
    const feet = parseInt(document.getElementById('input-feet').value);
    const inches = parseInt(document.getElementById('input-inches').value) || 0;
    if (!feet || feet < 4 || feet > 7) {
      document.getElementById('input-feet').style.borderColor = 'var(--red)';
      return;
    }
    const totalInches = (feet * 12) + inches;
    state.heightCm = totalInches * 2.54;
  } else {
    const cm = parseInt(document.getElementById('input-cm').value);
    if (!cm || cm < 120 || cm > 230) {
      document.getElementById('input-cm').style.borderColor = 'var(--red)';
      return;
    }
    state.heightCm = cm;
  }
  showQuestion(4);
}

function setWeightUnit(unit) {
  state.weightUnit = unit;
  const btns = document.querySelectorAll('#weight-units button');
  btns.forEach(b => b.classList.remove('active'));
  if (unit === 'imperial') {
    btns[0].classList.add('active');
    document.getElementById('weight-imperial').style.display = 'block';
    document.getElementById('weight-metric').style.display = 'none';
  } else {
    btns[1].classList.add('active');
    document.getElementById('weight-imperial').style.display = 'none';
    document.getElementById('weight-metric').style.display = 'block';
  }
}

function submitWeight() {
  if (state.weightUnit === 'imperial') {
    const lbs = parseInt(document.getElementById('input-lbs').value);
    if (!lbs || lbs < 80 || lbs > 500) {
      document.getElementById('input-lbs').style.borderColor = 'var(--red)';
      return;
    }
    state.weightLbs = lbs;
    state.weightKg = lbs / 2.20462;
  } else {
    const kg = parseInt(document.getElementById('input-kg').value);
    if (!kg || kg < 35 || kg > 230) {
      document.getElementById('input-kg').style.borderColor = 'var(--red)';
      return;
    }
    state.weightKg = kg;
    state.weightLbs = kg * 2.20462;
  }
  showQuestion(5);
}

// ---- CALORIE ENGINE ----
function calculatePlan() {
  // Mifflin–St Jeor
  const kg = state.weightKg;
  const cm = state.heightCm;
  const age = state.age;

  if (state.sex === 'male') {
    state.bmr = (10 * kg) + (6.25 * cm) - (5 * age) + 5;
  } else {
    state.bmr = (10 * kg) + (6.25 * cm) - (5 * age) - 161;
  }

  state.maintenance = state.bmr * state.activity;
  state.calorieTarget = state.maintenance * state.deficitMultiplier;

  // Calorie lane — nearest 200
  state.calorieLane = Math.round(state.calorieTarget / 200) * 200;

  // Protein — 0.7g per lb, rounded to nearest 10
  const rawProtein = state.weightLbs * state.proteinPerLb;
  state.proteinTarget = Math.round(rawProtein / 10) * 10;

  // Box calculation
  state.boxCalories = Math.round(state.calorieLane / state.frequency);
  state.boxProtein = Math.round(state.proteinTarget / state.frequency);

  // Initialize daily boxes
  state.boxes = [];

  // Display results
  showResults();
}

function showResults() {
  document.getElementById('r-calories').textContent = state.calorieLane.toLocaleString();
  document.getElementById('r-protein').textContent = state.proteinTarget + 'g';
  document.getElementById('r-freq').textContent = state.frequency;
  document.getElementById('r-box-cal').textContent = state.boxCalories;
  document.getElementById('r-box-pro').textContent = state.boxProtein + 'g';

  showScreen('results');
}

// ---- MEAL BUILDER ----
function startBuilder() {
  state.selectedFoods = [];
  state.currentCalories = 0;
  state.currentProtein = 0;

  // Set targets
  document.getElementById('b-target-cal').textContent = state.boxCalories;
  document.getElementById('b-target-pro').textContent = state.boxProtein;

  // Render food rows
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
  container.innerHTML = '';
  foods.forEach(food => {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.dataset.id = food.id;

    const badgeClass = food.badge === 'green' ? 'badge-green' : food.badge === 'yellow' ? 'badge-yellow' : 'badge-red';
    const badgeText = food.badge === 'green' ? 'Efficient' : food.badge === 'yellow' ? 'Moderate' : 'Measure';

    card.innerHTML = `
      <div class="food-emoji">${food.emoji}</div>
      <div class="food-name">${food.name}</div>
      <div class="food-portion">${food.portion}</div>
      <div class="food-macros">
        <span class="food-cal">${food.cal} cal</span>
        <span class="food-pro">${food.pro}g pro</span>
      </div>
      ${food.category === 'protein' || food.category === 'measure' ? `<span class="efficiency-badge ${badgeClass}">${badgeText}</span>` : ''}
    `;

    card.onclick = () => toggleFood(food, card);
    container.appendChild(card);
  });
}

function toggleFood(food, cardEl) {
  const existing = state.selectedFoods.findIndex(f => f.food.id === food.id);
  if (existing >= 0) {
    // Remove
    state.selectedFoods.splice(existing, 1);
    cardEl.classList.remove('selected');

    // Hide portion control if it was for this food
    if (food.adjustable) {
      document.getElementById('dial-portion').classList.remove('visible');
    }
  } else {
    // Add
    state.selectedFoods.push({ food, servings: 1 });
    cardEl.classList.add('selected');

    // Show portion control for dial foods
    if (food.adjustable) {
      showPortionControl(food);
    }
  }
  recalcBuilder();
}

function showPortionControl(food) {
  const container = document.getElementById('dial-portion');
  const entry = state.selectedFoods.find(f => f.food.id === food.id);
  if (!entry) return;

  const currentCal = Math.round(food.cal * entry.servings);
  const unitLabel = food.unit === 'g' ? `${Math.round(food.baseGrams * entry.servings)}${food.unit}` : `${Math.round(food.baseGrams * entry.servings)} ${food.unit}`;

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
    <div class="portion-amount">${unitLabel} · ${entry.servings}× serving</div>
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
  const calPct = Math.min(100, (state.currentCalories / state.boxCalories) * 100);
  const proPct = Math.min(100, (state.currentProtein / state.boxProtein) * 100);

  const calBar = document.getElementById('b-cal-bar');
  const proBar = document.getElementById('b-pro-bar');

  calBar.style.width = calPct + '%';
  proBar.style.width = proPct + '%';

  // Over budget?
  calBar.classList.toggle('over', state.currentCalories > state.boxCalories * 1.1);

  const calNums = document.getElementById('b-cal-nums');
  const proNums = document.getElementById('b-pro-nums');

  calNums.textContent = `${state.currentCalories} / ${state.boxCalories}`;
  proNums.textContent = `${state.currentProtein} / ${state.boxProtein}g`;

  calNums.classList.toggle('done', state.currentCalories >= state.boxCalories * 0.9 && state.currentCalories <= state.boxCalories * 1.1);
  proNums.classList.toggle('done', state.currentProtein >= state.boxProtein);
}

function renderSelectedFoods() {
  const container = document.getElementById('selected-foods');
  if (state.selectedFoods.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = state.selectedFoods.map(({ food, servings }) => {
    const cal = Math.round(food.cal * servings);
    const pro = Math.round(food.pro * servings);
    return `
      <div class="selected-food-item">
        <div>
          <div class="sf-name">${food.emoji} ${food.name}</div>
          <div class="sf-details">${cal} cal · ${pro}g protein · ${servings}× serving</div>
        </div>
        <button class="sf-remove" onclick="removeFood('${food.id}')">✕</button>
      </div>
    `;
  }).join('');
}

function removeFood(foodId) {
  state.selectedFoods = state.selectedFoods.filter(f => f.food.id !== foodId);
  // Deselect card
  document.querySelectorAll(`.food-card[data-id="${foodId}"]`).forEach(c => c.classList.remove('selected'));
  if (state.selectedFoods.every(f => !f.food.adjustable)) {
    document.getElementById('dial-portion').classList.remove('visible');
  }
  recalcBuilder();
}

function saveBox() {
  if (state.selectedFoods.length === 0) return;

  state.boxes.push({
    foods: [...state.selectedFoods],
    totalCal: state.currentCalories,
    totalPro: state.currentProtein,
  });

  showScreen('daily');
}

// ---- FOOD LIBRARY ----
let activeCategory = 'all';

function initLibrary() {
  renderCategoryTabs();
  renderLibraryGrid();
}

function renderCategoryTabs() {
  const container = document.getElementById('category-tabs');
  const cats = ['all', 'protein', 'volume', 'dial', 'flavor', 'measure'];
  const labels = { all: 'All Foods', protein: 'Protein', volume: 'Volume', dial: 'Dials', flavor: 'Flavor', measure: 'Measure' };

  container.innerHTML = cats.map(cat =>
    `<button class="cat-tab ${cat === activeCategory ? 'active' : ''}" onclick="setCategory('${cat}')">${labels[cat]}</button>`
  ).join('');
}

function setCategory(cat) {
  activeCategory = cat;
  renderCategoryTabs();
  renderLibraryGrid();
}

function filterLibrary() {
  renderLibraryGrid();
}

function renderLibraryGrid() {
  const container = document.getElementById('library-grid');
  const search = (document.getElementById('food-search').value || '').toLowerCase();

  let foods = activeCategory === 'all' ? allFoods : (FOODS[activeCategory] || []);

  if (search) {
    foods = allFoods.filter(f => f.name.toLowerCase().includes(search));
  }

  // Group by category if showing all
  if (activeCategory === 'all' && !search) {
    let html = '';
    Object.entries(CATEGORY_LABELS).forEach(([cat, info]) => {
      const catFoods = FOODS[cat];
      html += `<div class="library-category-header">${info.label}</div>`;
      catFoods.forEach(food => {
        html += renderLibraryCard(food);
      });
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
    <div class="food-card" data-id="${food.id}">
      <div class="food-emoji">${food.emoji}</div>
      <div class="food-name">${food.name}</div>
      <div class="food-portion">${food.portion}</div>
      <div class="food-macros">
        <span class="food-cal">${food.cal} cal</span>
        <span class="food-pro">${food.pro}g pro</span>
      </div>
      <span class="efficiency-badge ${badgeClass}">${badgeLabel}</span>
    </div>
  `;
}

// ---- DAILY VIEW ----
function updateDailyView() {
  // Date
  const today = new Date();
  document.getElementById('daily-date').textContent = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // Totals
  const totalCal = state.boxes.reduce((sum, b) => sum + b.totalCal, 0);
  const totalPro = state.boxes.reduce((sum, b) => sum + b.totalPro, 0);

  document.getElementById('d-cal-summary').textContent = `${totalCal.toLocaleString()} / ${(state.calorieLane || 1800).toLocaleString()}`;
  document.getElementById('d-pro-summary').textContent = `${totalPro} / ${state.proteinTarget || 120}g`;

  // Progress bars
  const calPct = Math.min(100, (totalCal / (state.calorieLane || 1800)) * 100);
  const proPct = Math.min(100, (totalPro / (state.proteinTarget || 120)) * 100);
  document.getElementById('d-cal-bar').style.width = calPct + '%';
  document.getElementById('d-pro-bar').style.width = proPct + '%';
  document.getElementById('d-cal-nums').textContent = Math.round(calPct) + '%';
  document.getElementById('d-pro-nums').textContent = Math.round(proPct) + '%';

  // Render boxes
  const freq = state.frequency || 4;
  const boxContainer = document.getElementById('daily-boxes');
  let html = '';

  for (let i = 0; i < freq; i++) {
    const box = state.boxes[i];
    if (box) {
      const calPct = Math.min(100, (box.totalCal / state.boxCalories) * 100);
      const isDone = box.totalCal >= state.boxCalories * 0.8 && box.totalPro >= state.boxProtein * 0.8;
      html += `
        <div class="box-item">
          <div class="box-item-header">
            <span class="box-item-label">Box ${i + 1}</span>
            <div class="box-item-check ${isDone ? 'done' : ''}">${isDone ? '✓' : ''}</div>
          </div>
          <div class="box-item-macros">
            <span><strong>${box.totalCal}</strong> / ${state.boxCalories} cal</span>
            <span><strong>${box.totalPro}g</strong> / ${state.boxProtein}g pro</span>
          </div>
          <div class="box-item-bar">
            <div class="box-item-bar-fill" style="width: ${calPct}%"></div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="box-item empty" onclick="startBuilder()">
          <div class="box-item-header">
            <span class="box-item-label">Box ${i + 1}</span>
            <div class="box-item-check"></div>
          </div>
          <div class="box-empty-text">Tap to build this box +</div>
        </div>
      `;
    }
  }

  boxContainer.innerHTML = html;
}

// ---- INIT ----
// Handle Enter key in inputs
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const q = state.currentQuestion;
    if (q === 2) submitAge();
    else if (q === 3) submitHeight();
    else if (q === 4) submitWeight();
  }
});

// Reset input borders on focus
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('focus', () => {
    input.style.borderColor = 'var(--accent)';
  });
  input.addEventListener('blur', () => {
    input.style.borderColor = 'var(--border)';
  });
});
