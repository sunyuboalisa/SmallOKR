import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddPlan from '../components/AddPlan';
import {Plan, PlanHeaderRight} from '../components/Plan';
import {RepeatPage} from '../components/RepeatPage';
import {PlanContextProvider} from '../state/PlanContext';
import React from 'react';

const PlanStack = createNativeStackNavigator<MyReactNavigation.ParamList>();

const PlanStackScreen = () => {
  return (
    <PlanContextProvider>
      <PlanStack.Navigator>
        <PlanStack.Screen
          name="Plan"
          component={Plan}
          options={{
            headerRight: () => <PlanHeaderRight />,
          }}
        />
        <PlanStack.Screen name="AddPlan" component={AddPlan} />
        <PlanStack.Screen name="RepeatPage" component={RepeatPage} />
      </PlanStack.Navigator>
    </PlanContextProvider>
  );
};

export default PlanStackScreen;
