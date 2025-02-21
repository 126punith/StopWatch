// screens/HomeScreen.js
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ProgressBarAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const HomeScreen = ({navigation}) => {
  const [timers, setTimers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [timerName, setTimerName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  // Load timers from AsyncStorage once on initial render
  const loadTimers = useCallback(async () => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (storedTimers) {
      setTimers(JSON.parse(storedTimers));
    }
  }, []);

  // Save completed timer to history
  const saveToHistory = async completedTimer => {
    const storedHistory = await AsyncStorage.getItem('history');
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.push(completedTimer);
    await AsyncStorage.setItem('history', JSON.stringify(history));
  };

  // Save timer to AsyncStorage
  const saveTimer = async (name, duration, category) => {
    const newTimer = {
      id: Date.now(),
      name,
      duration: parseInt(duration, 10),
      remainingTime: parseInt(duration, 10),
      category,
      status: 'paused',
    };

    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  // Start the timer countdown
  const startTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        timer.status = 'running';
        // Only start the interval if it's not already running
        if (!timer.interval) {
          timer.interval = setInterval(() => {
            setTimers(prevTimers =>
              prevTimers.map(t => {
                if (t.id === id) {
                  if (t.remainingTime > 0) {
                    t.remainingTime -= 1;
                  } else if (t.remainingTime === 0) {
                    clearInterval(t.interval);
                    t.status = 'completed';
                    t.interval = null; // Clear the interval reference after completion

                    // Save completed timer to history
                    saveToHistory({
                      ...t,
                      completionTime: new Date().toLocaleString(), // Add completion time
                    });

                    alert(`${t.name} completed!`); // Show the alert only once
                  }
                }
                return t;
              }),
            );
          }, 1000);
        }
      }
      return timer;
    });
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  // Pause the timer
  const pauseTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id && timer.status === 'running') {
        clearInterval(timer.interval);
        timer.status = 'paused';
        timer.interval = null; // Clear the interval reference when paused
      }
      return timer;
    });
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  // Reset the timer to its original duration
  const resetTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        clearInterval(timer.interval);
        timer.status = 'paused';
        timer.remainingTime = timer.duration;
        timer.interval = null; // Clear the interval reference when reset
      }
      return timer;
    });
    setTimers(updatedTimers);
    AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  // Render timer item for FlatList
  const renderItem = ({item}) => (
    <View style={styles.timerItem}>
      <Text>
        {item.name} - {item.remainingTime}s
      </Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={item.remainingTime / item.duration}
        style={{width: '90%'}}
      />
      <Text>Status: {item.status}</Text>
      <View style={styles.buttonGroup}>
        <Button title="Start" onPress={() => startTimer(item.id)} />
        <Button title="Pause" onPress={() => pauseTimer(item.id)} />
        <Button title="Reset" onPress={() => resetTimer(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={timers}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}>
        <Text>Add Timer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Contact')}
        style={styles.historyButton}>
        <Text>View History</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Timer Name"
            onChangeText={setTimerName}
            value={timerName}
            style={styles.input}
          />
          <TextInput
            placeholder="Duration (seconds)"
            keyboardType="numeric"
            onChangeText={setDuration}
            value={duration}
            style={styles.input}
          />
          <TextInput
            placeholder="Category"
            onChangeText={setCategory}
            value={category}
            style={styles.input}
          />
          <Button
            title="Save Timer"
            onPress={() => {
              saveTimer(timerName, duration, category);
              setModalVisible(false);
              setTimerName('');
              setDuration('');
              setCategory('');
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  historyButton: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  timerItem: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 15,
    justifyContent: "flex-start",
    alignItems: 'center',
    flexGrow:1,
    padding: 10
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    width: "100%"
  },
  modalContent: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default HomeScreen;