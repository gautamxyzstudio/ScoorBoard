import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "../screens/SplashScreen";
import SignUpScreen from "../screens/SignUpScreen";
import Login from "../screens/Login";
import EnterScreen from "../screens/EnterScreen";
import SelectSportScreen from "../screens/SelectSportScreen";
import SelectMatchScreen from "../screens/SelectMatchScreen";
import SingleMatchScreen from "../screens/SingleMatchScreen";
import TournamentScreen from "../screens/TournamentScreen";
import AddTeamScreen from "../screens/AddTeamScreen";
import HomeEditScore from "../screens/HomeEditScore";
import ViewLogin from "../screens/ViewLogin";
import FinalScoor from "../screens/FinalScoor";
import TeamManagementScreen from "../screens/TeamManagementScreen";
import EditTeamScreen from "../screens/EditTeamScreen";
import MatchHistoryScreen from "../screens/MatchHistoryScreen";
import ProfileScreen from "../screens/profileScreen/ProfileScreen";

 
const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={EnterScreen} />
        <Stack.Screen name="LoginPage" component={Login} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SelectSport" component={SelectSportScreen} />
        <Stack.Screen name="SelectMatchScreen" component={SelectMatchScreen} />
        <Stack.Screen name="SingleMatchScreen" component={SingleMatchScreen} />
        <Stack.Screen name="TournamentScreen" component={TournamentScreen} />
        <Stack.Screen name="AddTeamScreen" component={AddTeamScreen} />
        <Stack.Screen name="HomeEditScore" component={HomeEditScore} />
        <Stack.Screen name="ViewLogin" component={ViewLogin} />
        <Stack.Screen name="FinalScoor" component={FinalScoor} />
        <Stack.Screen name="TeamManagementScreen" component={TeamManagementScreen}/>
        <Stack.Screen name="EditTeamScreen" component={EditTeamScreen} />
        <Stack.Screen name="MatchHistory" component={MatchHistoryScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
