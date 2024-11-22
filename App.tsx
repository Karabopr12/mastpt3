import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Import Picker

interface UnsplashResponse {
  results: {
    urls: {
      small: string;
    };
  }[];
}

const UNSPLASH_ACCESS_KEY = '21LyIbbaeTl7vMkJ7eR1XclBZLv340YDFibcEDX7fhw'; // Replace with your Unsplash API Key

const fetchImageForDish = async (dishName: string) => {
  try {
    const response = await axios.get<UnsplashResponse>(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query: dishName,
          per_page: 1,
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    const results = response.data.results;
    if (results.length > 0) {
      return results[0].urls.small; // Returns the first image's small URL
    } else {
      return 'https://via.placeholder.com/150'; // Fallback if no image is found
    }
  } catch (error) {
    console.log('Error fetching image:', error);
    return 'https://via.placeholder.com/150'; // Fallback if error occurs
  }
};

const HomeScreen: React.FC = () => {
  const [name, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Appetizer'); // Default category
  const [price, setPrice] = useState<string>('');
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const categories = ['Appetizer', 'Main Course', 'Dessert'];

  const addMenuItem = async () => {
    if (name && description && category && price && !isNaN(parseFloat(price))) {
      const imageUrl = await fetchImageForDish(name); // Fetch image dynamically based on the dish name
      const newItem = {
        name,
        description,
        category,
        price: parseFloat(price),
        imageUri: imageUrl,
      };
      setMenuItems([...menuItems, newItem]); // Update the menu items
      setDishName('');
      setDescription('');
      setCategory('Appetizer'); // Reset category to default
      setPrice('');
    } else {
      Alert.alert('Error', 'Please fill in all fields with valid data');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setDishName}
          placeholder="Dish Name"
        />
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
        />
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          keyboardType="numeric"
        />

        {/* Picker for category selection styled as dropdown */}
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
          dropdownIconColor="#000" // Change dropdown arrow color
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>

        {/* Button to add menu item */}
        <Button title="Add Menu Item" onPress={addMenuItem} color="blue" />

        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemText}>{item.category}</Text>
              <Text style={styles.itemText}>${item.price.toFixed(2)}</Text>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  menuItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'blue',  
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default HomeScreen;
