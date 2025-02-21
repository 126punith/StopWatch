import React, {FC} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Color from '../Constants/Color';
import {Image, StyleSheet, View} from 'react-native';
import HomeScreen from '../Screens/HomeScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import Images from '../assets/Images';

const Stack = createStackNavigator();

const BottomTab = createBottomTabNavigator();

function TabBarIcon(props: {
  name: string,
  color: string,
  imgPath: ImageSourcePropType,
  focused: boolean,
}) {
  return (
    <>
      {props.focused ? (
        <>
          <Image
            source={props?.imgPath}
            style={[
              styles.tabBarImage,
              {
                tintColor: props.color,
              },
            ]}
            {...props}
          />
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <Image
            source={props?.imgPath}
            style={[
              styles.tabBarImage,
              {
                tintColor: props.color,
              },
            ]}
            {...props}
          />
        </View>
      )}
    </>
  );
}
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Color.secondary,
        tabBarInactiveTintColor: Color.silver,
        tabBarActiveBackgroundColor: Color.primary,
        tabBarInactiveBackgroundColor: Color.primary,
        tabBarStyle: {
          height: 90,
          borderRadius: 20,
          backgroundColor: 'transparent',
          //   borderColor: Color.primary,
          elevation: 0,
        },
        tabBarShowLabel: false,
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              imgPath={Images.house}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Contact"
        component={HistoryScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              imgPath={Images.profile}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const MainStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  buttonWholeContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    height: 20,
    width: 20,
  },
  highlightedButtonOutside: {
    position: 'absolute',
    padding: 5,
    borderRadius: 35,
    top: -25,
  },
  highlightedButton: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: Color.primary,
    borderBottomEndRadiusWidth: 2,
    elevation: 10,
  },
});
export default MainStack;
