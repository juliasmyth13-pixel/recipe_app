// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import Breakfast from './Breakfast';
import Lunch from './Lunch';
import Dinner from './Dinner';
import RecipeDetails from './RecipeDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Meals' }}
        />

        <Stack.Screen
          name="Breakfast"
          component={Breakfast}
          options={{ title: 'Breakfast Recipes' }}
        />

        <Stack.Screen
          name="Lunch"
          component={Lunch}
          options={{ title: 'Lunch Recipes' }}
        />

        <Stack.Screen
          name="Dinner"
          component={Dinner}
          options={{ title: 'Dinner Recipes' }}
        />

        <Stack.Screen
          name="RecipeDetails"
          component={RecipeDetails}
          options={{ title: 'Recipe Details' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
