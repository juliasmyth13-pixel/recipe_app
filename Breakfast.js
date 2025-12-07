// Breakfast.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

// ===============================
// 1. Helper: extract ingredients
// ===============================
function getIngredientsFromMealDB(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const key = `strIngredient${i}`;
    const value = meal[key];

    if (value && typeof value === 'string' && value.trim().length > 0) {
      ingredients.push(value.trim().toLowerCase());
    }
  }

  return ingredients;
}

// ===============================
// 2. Helper: classify recipes
//    (vegan / vegetarian / regular)
// ===============================
const MEAT_KEYWORDS = [
  'chicken', 'beef', 'pork', 'bacon', 'ham', 'lamb', 'veal', 'turkey',
  'sausage', 'prosciutto', 'salami', 'chorizo', 'meat', 'ground beef'
];

const FISH_KEYWORDS = [
  'fish', 'salmon', 'tuna', 'shrimp', 'prawn', 'cod', 'anchovy', 'sardine',
  'crab', 'lobster', 'mussel', 'clam', 'oyster'
];

const DAIRY_KEYWORDS = [
  'milk', 'cheese', 'mozzarella', 'cheddar', 'parmesan', 'butter', 'cream',
  'yogurt', 'yoghurt', 'ghee', 'ricotta', 'feta', 'sour cream'
];

const EGG_KEYWORDS = [
  'egg', 'eggs', 'egg yolk', 'egg white', 'mayonnaise'
];

const HONEY_KEYWORDS = ['honey', 'royal jelly'];

function containsAny(ingredients, keywords) {
  return ingredients.some(ing =>
    keywords.some(kw => ing.includes(kw))
  );
}

/**
 * Returns one of: "vegan", "vegetarian", "regular"
 */
function classifyDiet(ingredients) {
  const hasMeat = containsAny(ingredients, MEAT_KEYWORDS);
  const hasFishOrSeafood = containsAny(ingredients, FISH_KEYWORDS);
  const hasDairy = containsAny(ingredients, DAIRY_KEYWORDS);
  const hasEgg = containsAny(ingredients, EGG_KEYWORDS);
  const hasHoney = containsAny(ingredients, HONEY_KEYWORDS);

  // If it has meat or fish → regular
  if (hasMeat || hasFishOrSeafood) {
    return 'regular';
  }

  // At least vegetarian now.
  // If no dairy, eggs, or honey → vegan
  if (!hasDairy && !hasEgg && !hasHoney) {
    return 'vegan';
  }

  // Vegetarian (can have eggs/dairy)
  return 'vegetarian';
}

// ===============================
// 3. UI component
// ===============================

const DIET_OPTIONS = ['regular', 'vegetarian', 'vegan'];

export default function Breakfast() {
  const [diet, setDiet] = useState('regular');
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch breakfast recipes on mount
  useEffect(() => {
    fetchBreakfastRecipes();
  }, []);

  // Re-filter whenever diet/allRecipes changes
  useEffect(() => {
    const subset = allRecipes.filter(meal => meal._dietCategory === diet);
    setFilteredRecipes(subset);
  }, [diet, allRecipes]);

  const fetchBreakfastRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) Get a list of breakfast meals (basic info)
      const listRes = await fetch(
        'https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast'
      );
      const listJson = await listRes.json();
      const basicMeals = listJson.meals || [];

      // 2) For each meal, get full details (ingredients) and classify diet
      const detailedMealsPromises = basicMeals.map(async (meal) => {
        const detailRes = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const detailJson = await detailRes.json();
        const fullMeal =
          detailJson.meals && detailJson.meals.length > 0
            ? detailJson.meals[0]
            : null;

        if (!fullMeal) return null;

        const ingredients = getIngredientsFromMealDB(fullMeal);
        const dietCategory = classifyDiet(ingredients); // "vegan" | "vegetarian" | "regular"

        return {
          ...fullMeal,
          _dietCategory: dietCategory,
        };
      });

      const detailedMealsRaw = await Promise.all(detailedMealsPromises);
      const detailedMeals = detailedMealsRaw.filter(Boolean); // remove nulls

      setAllRecipes(detailedMeals);
    } catch (err) {
      console.error(err);
      setError('Could not load breakfast recipes.');
      setAllRecipes([]);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const renderDietButton = (option) => {
    const isActive = diet === option;

    let label = option.charAt(0).toUpperCase() + option.slice(1);
    // If you want "vegantrain" instead of "vegetarian", you could:
    // if (option === 'vegetarian') label = 'VeganTrain';

    return (
      <TouchableOpacity
        key={option}
        style={[styles.dietButton, isActive && styles.dietButtonActive]}
        onPress={() => setDiet(option)}
      >
        <Text
          style={[
            styles.dietButtonText,
            isActive && styles.dietButtonTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeCard}>
      {item.strMealThumb ? (
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.recipeImage}
        />
      ) : null}
      <View style={styles.recipeTextContainer}>
        <Text style={styles.recipeTitle}>{item.strMeal}</Text>
        <Text style={styles.recipeTag}>
          Diet: {item._dietCategory.toUpperCase()}
        </Text>
        {item.strArea ? (
          <Text style={styles.recipeMeta}>Origin: {item.strArea}</Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Breakfast</Text>
      <Text style={styles.subtitle}>Choose a diet type:</Text>

      <View style={styles.dietRow}>{DIET_OPTIONS.map(renderDietButton)}</View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.statusText}>Loading recipes...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && filteredRecipes.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.statusText}>
            No {diet} breakfast recipes found.
          </Text>
        </View>
      )}

      {!loading && filteredRecipes.length > 0 && (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

// ===============================
// 4. Styles
// ===============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  dietRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dietButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  dietButtonActive: {
    backgroundColor: '#000',
  },
  dietButtonText: {
    fontSize: 14,
  },
  dietButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  center: {
    alignItems: 'center',
    marginTop: 16,
  },
  statusText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: 'red',
  },
  listContent: {
    paddingVertical: 8,
  },
  recipeCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  recipeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  recipeTag: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  recipeMeta: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
});
