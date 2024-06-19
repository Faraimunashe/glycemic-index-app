import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomePage from '../Pages/HomePage';
import ProfileNav from './ProfileNav';
import ListPage from '../Pages/ListPage';
import MedicalPage from '../Pages/MedicalPage';

const Tab = createBottomTabNavigator();

export default function DashNav({ navigation }) {
  return (
        <Tab.Navigator independent={true}>
            <Tab.Screen 
                name="Home" 
                component={HomePage} 
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => (
                      <Ionicons name="home" color={'#4CAF50'} size={25} />
                    ),
                    tabBarActiveTintColor: '#4CAF50',
                }}
            />
            <Tab.Screen 
                name="List" 
                component={ListPage} 
                options={{
                    title: 'Detected Food Items',
                    tabBarLabel: 'List',
                    tabBarIcon: () => (
                      <Ionicons name="list-circle" color={'#4CAF50'} size={25} />
                    ),
                    tabBarActiveTintColor: '#4CAF50',
                }}
            />

            <Tab.Screen 
                name="Info" 
                component={MedicalPage} 
                options={{
                    title: 'Glycemic Information',
                    tabBarLabel: 'Info',
                    tabBarIcon: () => (
                      <Ionicons name="information-circle" color={'#4CAF50'} size={25} />
                    ),
                    tabBarActiveTintColor: '#4CAF50',
                }}
            />
            
            <Tab.Screen 
                name="Profile" 
                component={ProfileNav}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: () => (
                      <Ionicons name="person" color={'#4CAF50'} size={25} />
                    ),
                    tabBarActiveTintColor: '#4CAF50',
                }}
            />
        </Tab.Navigator>
  );
}