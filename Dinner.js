// Dinner.js
import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image,} from 'react-native';

/* Extract ingredient list from the MealDB meal object */
function getIngredientsFromMealDB(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const key = `strIngredient${i}`;
    const value = meal[key];
    if (value && value.trim()) {
      ingredients.push(value.trim().toLowerCase());
    }
  }
  return ingredients;
}

/* Keyword lists for diet classification */
const MEAT_KEYWORDS = [
  'chicken','beef','pork','bacon','ham','lamb','veal','turkey',
  'sausage','prosciutto','salami','chorizo','meat','ground beef',
];

const FISH_KEYWORDS = [
  'fish','salmon','tuna','shrimp','prawn','cod','anchovy','sardine',
  'crab','lobster','mussel','clam','oyster',
];

const DAIRY_KEYWORDS = [
  'milk','cheese','mozzarella','cheddar','parmesan','butter','cream',
  'yogurt','yoghurt','ghee','ricotta','feta','sour cream',
];

const EGG_KEYWORDS = [
  'egg','eggs','egg yolk','egg white','mayonnaise'
];
const HONEY_KEYWORDS = [
  'honey','royal jelly'
];

function containsAny(ingredients, keywords) {
  return ingredients.some(ing =>
    keywords.some(kw => ing.includes(kw))
  );
}

/* Classify recipe as vegan / vegetarian / regular */
function classifyDiet(ingredients) {
  const hasMeat = containsAny(ingredients, MEAT_KEYWORDS);
  const hasFish = containsAny(ingredients, FISH_KEYWORDS);
  const hasDairy = containsAny(ingredients, DAIRY_KEYWORDS);
  const hasEgg = containsAny(ingredients, EGG_KEYWORDS);
  const hasHoney = containsAny(ingredients, HONEY_KEYWORDS);

  if (hasMeat || hasFish) return 'regular';
  if (!hasDairy && !hasEgg && !hasHoney) return 'vegan';
  return 'vegetarian';
}

const DIET_OPTIONS = ['regular', 'vegetarian', 'vegan'];

// 👇 NOTE: navigation is received as a prop here
export default function Dinner({ navigation }) {
  const [diet, setDiet] = useState('regular');
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    const list = allRecipes.filter(recipe => recipe._dietCategory === diet);
    setFilteredRecipes(list);
  }, [diet, allRecipes]);

  const loadRecipes = async () => {
    // 1) Fetch list of dinner meals
    const listRes = await fetch(
      'https://www.themealdb.com/api/json/v1/1/filter.php?c=Pasta'
    );
    const listJson = await listRes.json();
    const basicMeals = listJson.meals || [];

    const detailedMeals = [];

    // 2) For each meal, fetch full details and classify diet
    for (let meal of basicMeals) {
      const detailRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );
      const detailJson = await detailRes.json();
      const fullMeal = detailJson.meals?.[0];

      if (fullMeal) {
        const ingredients = getIngredientsFromMealDB(fullMeal);
        const dietType = classifyDiet(ingredients);
        detailedMeals.push({ ...fullMeal, _dietCategory: dietType });
      }
    }

    setAllRecipes(detailedMeals);
  };

  const renderDietButton = (option) => {
    const selected = diet === option;
    return (
      <TouchableOpacity
        key={option}
        onPress={() => setDiet(option)}
        style={[styles.dietButton, selected && styles.dietButtonSelected]}
      >
        <Text
          style={[
            styles.dietButtonText,
            selected && styles.dietButtonTextSelected,
          ]}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  // 👇 When a recipe is pressed, navigate to RecipeDetails
  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
    >
      {item.strMealThumb && (
        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      )}

      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.strMeal}</Text>
        <Text style={styles.recipeTag}>
          Diet: {item._dietCategory.toUpperCase()}
        </Text>
        {item.strArea && (
          <Text style={styles.recipeArea}>Origin: {item.strArea}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dinner</Text>
      <Text style={styles.subtitle}>Choose a diet:</Text>

      <View style={styles.dietRow}>
        {DIET_OPTIONS.map(renderDietButton)}
      </View>

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderRecipeItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginBottom: 12 },
  dietRow: { flexDirection: 'row', marginBottom: 16 },

  dietButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  dietButtonSelected: { backgroundColor: '#000' },
  dietButtonText: { fontSize: 14 },
  dietButtonTextSelected: { color: '#fff', fontWeight: '600' },

  recipeCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 12,
  },
  recipeImage: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
  },
  recipeInfo: { flex: 1, justifyContent: 'center' },
  recipeTitle: { fontSize: 18, fontWeight: '600' },
  recipeTag: { fontSize: 12, color: '#777' },
  recipeArea: { fontSize: 12, color: '#777' },
});
