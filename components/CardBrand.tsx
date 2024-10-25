import Colors from "@/constants/Colors";

import React, {useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {ProductModel} from "@/app/(tabs)";

const BrandsList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [brands, setCategories] = useState<{ brand: string, quantity: number }[]>([]);
    let num = 0;
    const API_URL = 'https://66ee3d34380821644cdf047b.mockapi.io/api/v1/Products';
    useEffect(() => {
        let isMounted = true; // To track whether component is still mounted
        
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData: ProductModel[] = await response.json();
                if (isMounted) {
                    
                    const brandCountMap: { [key: string]: number } = {};
                    jsonData.forEach((item: ProductModel) => {
                        const brand = item.brand || 'Unknown';
                        num++;
                        if (brandCountMap[brand]) {
                            brandCountMap[brand]++;
                        } else {
                            brandCountMap[brand] = 1;
                        }
                    });
                    
                    const brandCountArray = Object.keys(brandCountMap).map(brand => ({
                        brand,
                        quantity: brandCountMap[brand]
                    }));
                    
                    setCategories([{brand: "All", quantity: num}, ...brandCountArray]);
                    
                    console.log(brandCountArray);
                }
            } catch (err: any) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        
        fetchData();
        
        // Cleanup function to prevent memory leaks
        return () => {
            isMounted = false;
        };
    }, []);
    
    const gap = 12;
    const outerPadding = 16;
    const {brand: selectedBrand, artName} = useLocalSearchParams();
    const artNameQuery = Array.isArray(artName) ? artName[0] : artName;
    if (error) {
        return <Text>Error: {error}</Text>;
    }
    const CardBrand = ({brand, quantity}: { brand: string, quantity: number }) => {
        const isSelected =
            brand === selectedBrand || (brand === "All" && !selectedBrand);
        
        return (
            <TouchableOpacity
                className={`shadow-md rounded-md py-2 px-3 flex-1 justify-center items-center ${
                    isSelected ? "bg-primary" : "bg-white"
                }`}
                style={{backgroundColor: isSelected ? Colors.light.tint : "white"}}
                onPress={() => {
                    if (brand === "All") {
                        router.push("/");
                        if (artNameQuery !== undefined) {
                            router.setParams({artName: artNameQuery});
                        }
                    } else {
                        router.setParams({brand: brand});
                    }
                }}
            >
                <Text
                    className={`text-md font-medium ${
                        isSelected ? "text-white" : "text-black"
                    }`}
                >
                    {brand} ({quantity})
                </Text>
            </TouchableOpacity>
        );
    };
    
    return (
        <View>
            <View>
                <FlatList
                    data={brands}
                    renderItem={({item}) => <CardBrand brand={item.brand} quantity={item.quantity}/>}
                    keyExtractor={(item) => item.brand}
                    contentContainerStyle={{
                        gap,
                        paddingHorizontal: outerPadding,
                    }}
                    className="w-full"
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

export default BrandsList;
