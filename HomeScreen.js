// HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe App</Text>
      <Text style={styles.subtitle}>Choose a meal:</Text>

      <View style={styles.buttonContainer}>
        <Button title="Breakfast" onPress={() => navigation.navigate('Breakfast')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Lunch" onPress={() => navigation.navigate('Lunch')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Dinner" onPress={() => navigation.navigate('Dinner')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  buttonContainer: { width: '60%', marginVertical: 10 },
});
