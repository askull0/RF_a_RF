import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ title: 'RFaRF', headerShown: false /*headerTitleAlign: 'center'*/  }} />
        <Stack.Screen name="camera" options={{ title: 'Camera', headerTitleAlign: 'center' }} />
        <Stack.Screen name="search" options={{ title: 'Search Recipes', headerTitleAlign: 'center' }} />
        <Stack.Screen name="recipeList" options={{ title: 'Recipes', headerTitleAlign: 'center' }} />
        <Stack.Screen name="recipeDetails" options={{ title: 'Recipe\'s details', headerTitleAlign: 'center' }} />
      </Stack>
  );
}
