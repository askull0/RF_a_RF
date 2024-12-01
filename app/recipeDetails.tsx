import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const RecipeDetail = () => {
    const { recipe } = useLocalSearchParams();
    const recipeData = recipe && typeof recipe === 'string' ? JSON.parse(recipe) : {};
    const { label, calories, yield: servings, url, totalNutrients } = recipeData;

    return (
        <ScrollView style={styles.container}>
            {recipeData.image && (
                <Image source={{ uri: recipeData.image }} style={styles.recipeImage} />
            )}
            <Text style={styles.title}>{recipeData.label || 'No Title Available'}</Text>

            {recipeData.totalTime ? (
                <Text style={styles.subtitle}>Total Time: {recipeData.totalTime} min</Text>
            ) : (
                <Text style={styles.subtitle}>Total Time: --</Text>
            )}

            <Text style={styles.subtitle}>
                Calories: {recipeData.calories ? Math.round(recipeData.calories) : 'N/A'}
            </Text>

            <Text style={styles.info}>Servings: {servings}</Text>
            <Text style={styles.info}>Protein: {totalNutrients.PROCNT?.quantity.toFixed(2)}g</Text>
            <Text style={styles.info}>Carbs: {totalNutrients.CHOCDF?.quantity.toFixed(2)}g</Text>
            <Text style={styles.info}>Fat: {totalNutrients.FAT?.quantity.toFixed(2)}g</Text>


            <Text style={styles.subtitle}>Ingredients:</Text>
            {recipeData.ingredientLines && recipeData.ingredientLines.length > 0 ? (
                recipeData.ingredientLines.map((ingredient: string, index: number) => (
                    <Text key={index} style={styles.ingredient}>{ingredient}</Text>
                ))
            ) : (
                <Text style={styles.ingredient}>No ingredients available.</Text>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => Linking.openURL(url)}
            >
                <Text>View Full Recipe</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: 'white' },
    recipeImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 16, fontWeight: '600', marginTop: 10 },
    ingredient: { fontSize: 14, marginVertical: 2 },
    instructionStep: { fontSize: 14, marginTop: 8, fontStyle: 'italic' },
    info: {
        fontSize: 16,
        marginVertical: 4,
    },
    button: {
        margin: 30,
        padding: 12,
        backgroundColor: 'rgba(81,56,32,0.9)',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RecipeDetail;
