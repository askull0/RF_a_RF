import React, {useEffect, useState} from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import LoadingIcon from '../components/LoadingIcon';
import suggestions from './suggestions';
import { AntDesign } from "@expo/vector-icons";
import {useRoute} from "@react-navigation/core";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const route: any = useRoute();
    const detectedItemsString = route.params?.detectedItems || '';
    const [detectedItems, setDetectedItems] = useState<string[]>([]);

    useEffect(() => {
        if (detectedItemsString) {
            const initialDetectedItems = detectedItemsString.split(',').map((item: string) => item.trim());
            setDetectedItems(initialDetectedItems);
            console.log("Detected Items:", initialDetectedItems);

            if (initialDetectedItems.length > 0) {
                setSelectedItems(initialDetectedItems);
            }
        }
    }, [detectedItemsString]);


    const handleAddItem = (item: string) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems([...selectedItems, item]);
            setSearchQuery('');
        }
        setShowSuggestions(false);
    };

    const handleRemoveItem = (item: string) => {
        const updatedItems = selectedItems.filter((selectedItem) => {
            return selectedItem !== item;
        });
        setSelectedItems(updatedItems);
    };

    const handleFindRecipes = () => {
        if (selectedItems.length === 0) {
            Alert.alert("No Ingredients", "Please add ingredients to search for recipes.");
            return;
        }

        setLoading(true);

        // connect api
        const query = selectedItems.join(',');
        fetch(`https://api.edamam.com/api/recipes/v2?app_id=key_id&app_key=key_app&type=public&q=${query}`) // substitute key
            .then(response => response.json())
            .then(data => {
                router.push({
                    pathname: '/recipeList',
                    params: { recipes: JSON.stringify(data.hits), selectedItems  }
                });
                console.log("Recipes found:", data);
            })
            .catch(error => {
                console.error("Error fetching recipes:", error);
            })
            .finally(() => setLoading(false));
    };

    const filteredSuggestions = searchQuery
        ? suggestions.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
        : suggestions;

    return (
        <TouchableWithoutFeedback onPress={() => { setShowSuggestions(false); Keyboard.dismiss(); }}>
            <View style={styles.container}>
                {loading && (
                    <View style={styles.overlay}>
                        <LoadingIcon />
                    </View>
                )}

                {/*Overlay Effect */}
                <View style={styles.searchInputContainer}>
                    <TextInput
                        testID="search-input"
                        style={[styles.searchInput, loading && { opacity: 0.5 }]}
                        placeholder="Search ingredients ..."
                        placeholderTextColor="white"
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onSubmitEditing={() => {
                            if (searchQuery && !selectedItems.includes(searchQuery)) {
                                handleAddItem(searchQuery);
                            }
                        }}
                    />
                </View>

                {/* Suggestions Overlay */}
                {showSuggestions && !loading && (
                    <ScrollView style={styles.suggestionsContainer}>
                        {filteredSuggestions.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.suggestionBox}
                                onPress={() => handleAddItem(item)}
                            >
                                <Text style={styles.suggestionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                <View style={styles.selectedItemsContainer}>
                    <Text style={styles.listLabel}>List of added products:</Text>
                    {selectedItems.length > 0 ? (
                        selectedItems.map((item, index) => (
                            <View key={index} style={styles.selectedItemContainer}>
                                <Text style={styles.selectedItem}>{item}</Text>
                                <TouchableOpacity onPress={() => handleRemoveItem(item)}  testID={`delete-button-${index}`}>
                                    <AntDesign name='delete' size={20} color={'white'} />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noItemsText}>No items added</Text>
                    )}
                </View>

                <TouchableOpacity style={styles.findRecipesButton} onPress={handleFindRecipes} disabled={loading}>
                    <Text style={styles.findRecipesText}>Find Recipes</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        // backgroundColor: 'rgba(81,56,32,0.9)',  //ciekawy braz
        backgroundColor: 'rgba(49,60,85,0.9)',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    searchInputContainer: {
        position: 'relative',
        zIndex: 20,
        marginBottom: 10,
    },
    searchInput: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        paddingHorizontal: 12,
        color: 'white',
    },
    selectedItemsContainer: {
        marginTop: 10,
    },
    selectedItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
    },
    suggestionsContainer: {
        maxHeight: 285,
        borderRadius: 10,
        padding: 8,
        position: 'absolute',
        backgroundColor: 'white',
        width: '100%',
        zIndex: 10,
        top: 60,
        left: 16,
    },
    suggestionBox: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        marginBottom: 5,
    },
    suggestionText: {
        color: 'black',
    },
    listLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    noItemsText: {
        color: 'lightgray',
        fontSize: 16,
    },
    selectedItem: {
        color: 'white',
        fontSize: 18,
        marginVertical: 4,
    },
    findRecipesButton: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    findRecipesText: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default Search;
