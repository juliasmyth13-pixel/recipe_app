// RecipeDetails.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function RecipeDetails({ route }) {
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container}>
      {recipe.strMealThumb && (
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      )}

      <Text style={styles.title}>{recipe.strMeal}</Text>

      <Text style={styles.meta}>Category: {recipe.strCategory || 'N/A'}</Text>
      <Text style={styles.meta}>Origin: {recipe.strArea || 'N/A'}</Text>

      <Text style={styles.sectionHeader}>Ingredients</Text>
      {Array.from({ length: 20 }).map((_, index) => {
        const i = index + 1;
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          return (
            <Text key={i} style={styles.ingredient}>
              • {ingredient} {measure ? `- ${measure}` : ''}
            </Text>
          );
        }
        return null;
      })}

      <Text style={styles.sectionHeader}>Instructions</Text>
      <Text style={styles.instructions}>
        {recipe.strInstructions || 'No instructions available.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 220, borderRadius: 10, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  meta: { fontSize: 14, color: '#555', marginBottom: 4 },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  ingredient: { fontSize: 16, marginBottom: 4, marginLeft: 8 },
  instructions: { fontSize: 16, lineHeight: 22, marginTop: 4 },
});
