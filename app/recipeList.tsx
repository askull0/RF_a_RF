import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    Button,
    Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Filters = {
    time: string;
    diet: string;
    health: string;
    cuisineType: string;
    mealType: string;
    dishType: string;
};

type FilterType = keyof Filters;

const formatTime = (time: string) => {
    if (time.startsWith('<')) {
        const minutes = time.slice(1);
        return `${minutes}`;
    }
    return time;
};

const generateQueryUrl = (selectedFilters: Filters, ingredients: string[]) => {
    const baseUrl = "https://api.edamam.com/api/recipes/v2";
    const appId = "cf40f564";
    const appKey = "a5917b6cb5b891bded4921ab153291a2";

    const params = new URLSearchParams({
        app_id: appId,
        app_key: appKey,
        type: "public",
        q: ingredients.join(", "),
    });

    if (selectedFilters.time) {
        const formattedTime = formatTime(selectedFilters.time);
        params.append("time", formattedTime);
    }

    Object.entries(selectedFilters).forEach(([key, value]) => {
        if (key !== 'time' && value) {
            params.append(key, value);
        }
    });

    return `${baseUrl}?${params.toString()}`;
};

const RecipeList = () => {
    const { recipes, selectedItems } = useLocalSearchParams();
    const recipeData = recipes && typeof recipes === 'string' ? JSON.parse(recipes) : [];
    const router = useRouter();

    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<Filters>({
        time: '',
        diet: '',
        health: '',
        cuisineType: '',
        mealType: '',
        dishType: '',
    });
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const [recipesData, setRecipesData] = useState<any[]>([]);
    const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

    const itemsArray = Array.isArray(selectedItems) ? selectedItems : [selectedItems];

    useEffect(() => {
        const queryUrl = generateQueryUrl(selectedFilters, itemsArray);
        console.log("Generated Query URL:", queryUrl);

        fetch(queryUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.hits && Array.isArray(data.hits)) {
                    setRecipesData(data.hits);
                } else {
                    setRecipesData([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching recipes:", error);
                setRecipesData([]);
            });
    }, [selectedFilters, selectedItems]);

    const handleFilterChange = (filterType: FilterType, value: string) => {
        setSelectedFilters((prev) => {
            const updated = { ...prev, [filterType]: value };
            const count = Object.values(updated).filter((v) => v !== '').length;
            setActiveFiltersCount(count);
            return updated;
        });
    };

    const toggleFilterExpansion = (filter: string) => {
        setExpandedFilter((prev) => (prev === filter ? null : filter));
    };

    const filters: { type: FilterType; options: string[]; label: string }[] = [
        { type: 'time', options: ['<15', '<30', '10-20', '20-30', ''], label: 'Time' },
        { type: 'diet', options: ['balanced', 'high-fiber' ,'high-protein', 'low-carb', 'low-fat','low-sodium', ''], label: 'Diet' },
        { type: 'health', options: ['vegan', 'vegetarian','low-sugar', 'gluten-free', 'fish-free','keto-friendly',''], label: 'Health' },
        { type: 'cuisineType', options: ['american', 'asian', 'chinese','greek','indian','italian','korean','mexican','world', ''], label: 'Cuisine Type' },
        { type: 'mealType', options: ['breakfast', 'lunch','dinner','snack', ''], label: 'Meal Type' },
        { type: 'dishType', options: ['main course', 'dessert', 'side dish','drinks','pasta','soup',''], label: 'Dish Type' },
    ];

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={styles.centeredContainer}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFiltersModalVisible(true)}
                    >
                        <Text style={styles.filterText}>
                            Filters ({activeFiltersCount})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            setSelectedFilters({
                                time: '',
                                diet: '',
                                health: '',
                                cuisineType: '',
                                mealType: '',
                                dishType: '',
                            });
                            setActiveFiltersCount(0);
                        }}
                    >
                        <Text style={styles.clearText}>Clear Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {recipesData.length === 0 ? (
                    <Text style={styles.noRecipesText}>No recipes matching the selected criteria.</Text>
                ) : (
                    recipesData.map((item: any, index: number) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.tile}
                            onPress={() =>
                                router.push({
                                    pathname: '/recipeDetails',
                                    params: { recipe: JSON.stringify(item.recipe) },
                                })
                            }
                        >
                            {item.recipe.image && (
                                <Image
                                    source={{ uri: item.recipe.image }}
                                    style={styles.recipeImage}
                                />
                            )}
                            <Text style={styles.recipeTitle}>{item.recipe.label}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <Modal
                visible={filtersModalVisible}
                animationType="slide"
                onRequestClose={() => setFiltersModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Filters</Text>
                    <FlatList
                        data={filters}
                        keyExtractor={(item) => item.type}
                        renderItem={({ item }) => (
                            <View style={styles.filterGroup}>
                                <TouchableOpacity
                                    onPress={() => toggleFilterExpansion(item.label)}
                                    style={styles.filterLabel}
                                >
                                    <Text style={styles.filterLabelText}>{item.label}</Text>
                                </TouchableOpacity>

                                {expandedFilter === item.label && (
                                    <View style={styles.optionsContainer}>
                                        {item.options.map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                onPress={() => handleFilterChange(item.type, option)}
                                                style={[
                                                    styles.filterOption,
                                                    selectedFilters[item.type] === option &&
                                                    styles.selectedOption,
                                                ]}
                                            >
                                                <Text>{option || 'None'}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}
                    />
                    <Button
                        title="Apply Filters"
                        onPress={() => setFiltersModalVisible(false)}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f3f3f3',
        padding: 16,
    },
    centeredContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterButton: {
        backgroundColor: '#eaeaea',
        padding: 8,
        borderRadius: 8,
    },
    filterText: {
        fontSize: 14,
    },
    clearButton: {
        backgroundColor: '#ffcccc',
        padding: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    clearText: {
        fontSize: 14,
        color: '#ff0000',
    },
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
    modalContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    filterGroup: {
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    filterLabelText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionsContainer: {
        paddingLeft: 16,
    },
    filterOption: {
        padding: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        marginBottom: 4,
    },
    selectedOption: {
        backgroundColor: '#cce7ff',
    },
    noRecipesText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default RecipeList;
