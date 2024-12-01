// import React from 'react';
// import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
//
// const Recipe = () => {
//     const { recipes } = useLocalSearchParams();
//     const recipeData = recipes && typeof recipes === 'string' ? JSON.parse(recipes) : [];
//
//     return (
//         <ScrollView style={styles.container}>
//             {recipeData.map((item: any, index: number) => (
//                 <View key={index} style={styles.recipeBox}>
//                     <Text style={styles.recipeTitle}>{item.recipeList.label}</Text>
//                     <Text>Calories: {item.recipeList.calories.toFixed(0)}</Text>
//                     <Text>Ingredients:</Text>
//                     {item.recipeList.ingredientLines.map((ingredient: string, i: number) => (
//                         <Text key={i} style={styles.ingredient}>{ingredient}</Text>
//                     ))}
//                 </View>
//             ))}
//         </ScrollView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: { padding: 16, backgroundColor: 'white' },
//     recipeBox: { marginBottom: 16, padding: 16, backgroundColor: '#f3f3f3', borderRadius: 8 },
//     recipeTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
//     ingredient: { fontSize: 14 }
// });
//
// export default Recipe;

import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const RecipeList = () => {
    const { recipes } = useLocalSearchParams();
    const recipeData = recipes && typeof recipes === 'string' ? JSON.parse(recipes) : [];
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.grid}>
            {recipeData.map((item: any, index: number) => (
                <TouchableOpacity
                    key={index}
                    style={styles.tile}
                    onPress={() => router.push({
                        pathname: '/recipeDetails',
                        params: { recipe: JSON.stringify(item.recipe) }
                    })}
                >
                    {item.recipe.image && (
                        <Image source={{ uri: item.recipe.image }} style={styles.recipeImage} />
                    )}
                    <Text style={styles.recipeTitle}>{item.recipe.label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 8,
    },
    tile: {
        width: '45%',
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        alignItems: 'center',
    },
    recipeImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RecipeList;
