import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Me from '../components/Me';

const MeStack = createNativeStackNavigator<MyReactNavigation.ParamList>();

const MeStackScreen = () => {
  return (
    <MeStack.Navigator>
      <MeStack.Screen name="Me" component={Me} />
    </MeStack.Navigator>
  );
};

export default MeStackScreen;
