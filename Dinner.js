import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';

const ListOfDinners = ({ navigation }) => {

  const dataSource = [
    { title: "Chicken "},
    { title: "Pasta"},
    { title: "Salad"},
    { title: "Steak"},
    { title: "Fish" }
  ];

const [ListOfDinners, setDinners] = useState(dataSource);

  function loadMoreDinners() {
    fetch()


    fetch('https://reactnative.dev/movies.json')
      .then((response) => response.json())
      .then((json) => {
        console.log(json);

        const newMovies = json.movies.map(movie => ({
          title: movie.title,
          releaseDate: movie.releaseYear
        }));

        setMovies(prevMovies => [...prevMovies, ...newMovies]);
      })
      .catch((error) => console.error(error));
  };


}