import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from '../components/Dashboard';

const DashboardStack = createNativeStackNavigator<MyReactNavigation.ParamList>();

const DashboardStackScreen = () => {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="DashBoard" component={Dashboard} />
    </DashboardStack.Navigator>
  );
};

export default DashboardStackScreen;
