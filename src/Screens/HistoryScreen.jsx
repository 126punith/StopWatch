// screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const storedHistory = await AsyncStorage.getItem('history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    };

    loadHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text>Title Name:- {item.name}</Text>
      <Text>Completed at: {item.completionTime}</Text>
      <Text>Duration: {item.duration}s</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  historyItem: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 15,
    justifyContent: "space-around",
    alignItems: 'center'
  },
});

export default HistoryScreen;