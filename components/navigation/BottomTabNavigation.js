import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ProfilScreen from '../screens/ProfilScreen';
import ImagesScreen from '../screens/ImagesScreen';
import TravelScreen from '../screens/TravelScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Home') {
            return (
              <Image
                source={require('../assets/logo-blanc-hd.png')}
                alt="home"
                style={{ marginBottom: -16, height: 48, width: 48 }}
              />
            );
          } else if (route.name === 'Profil') {
            iconName = 'user';
          } else if (route.name === 'Images') {
            iconName = 'photo';
          }

          return (
            <FontAwesome
              name={iconName}
              size={size + 8}
              color={color}
              style={{ marginBottom: -16 }}
            />
          );
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,1)',
        tabBarStyle: {
          backgroundColor: '#D8725B',
          borderColor: 'transparent',
          shadowOpacity: 0,
          borderWidth: 0,
          elevation: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfilScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen
        name="Images"
        component={ImagesScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen
        name="Travel"
        component={TravelScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};
