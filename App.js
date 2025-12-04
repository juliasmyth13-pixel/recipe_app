
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CategoriesScreen from './src/screens/CategoriesScreen';
import RecipesScreen from './src/screens/RecipesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Categories">
        <Stack.Screen 
          name="Categories" 
          component={CategoriesScreen}
          options={{ title: 'Recipe Categories' }}
        />
        <Stack.Screen 
          name="Recipes" 
          component={RecipesScreen}
          options={({ route }) => ({
            title: route.params?.category || 'Recipes',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

