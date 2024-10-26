import {ActivityIndicator, Animated, Image, Text, TouchableOpacity, View, Alert} from 'react-native';
import ScrollView = Animated.ScrollView;
import {useWishlist} from "@/components/useProductContext";
import React, {useEffect, useState} from "react";
import {ProductModel} from "@/app/(tabs)/index";
import {Feather} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {formatPrice} from "@/utils/formatPrice";
import {useRouter} from "expo-router";
import {GestureHandlerRootView, Swipeable} from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import CustomCheckBox from "@/components/Checkbox";

export default function TabTwoScreen() {
    const {wishlist, removeFromWishlist, removeMultipleFromWishlist, clearWishlist} = useWishlist();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductModel[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const API_URL = 'https://66ee3d34380821644cdf047b.mockapi.io/api/v1/Products';
    const router = useRouter();
    
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData: ProductModel[] = await response.json();
                if (isMounted) setData(jsonData);
            } catch (err: any) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);
    
    if (loading) return <ActivityIndicator size="large" color="#0000ff"/>;
    if (error) return <Text>Error: {error}</Text>;
   
    const handleSelectItem = (id: string) => {
        const updatedSelection = new Set(selectedItems);
        if (updatedSelection.has(id)) {
            updatedSelection.delete(id);
        } else {
            updatedSelection.add(id);
        }
        setSelectedItems(updatedSelection);
    };
    
    const handleDeleteSelected = async () => {
        
        Alert.alert(
            "Confirm Remove",
            `Do you wanna remove them from your wishlist?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        await removeMultipleFromWishlist([...selectedItems]);
                    },
                },
            ],
            {cancelable: true}
        );
        
        setSelectedItems(new Set());
    };
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <GestureHandlerRootView style={{flex: 1}}>
                <View className="mx-2 flex-row flex-wrap justify-center relative" style={{flex: 1}}>
                    {data && data.length > 0 && (
                        data.map((item) => {
                            if (wishlist.includes(item.id)) {
                                const renderRightActions = () => (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: Colors.primaryColor,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 60,
                                            padding: 10,
                                            marginVertical: 5
                                        }}
                                        className="rounded-r-md"
                                        onPress={async () => {
                                            await removeFromWishlist(item.id);
                                            const updatedSelection = new Set(selectedItems);
                                            updatedSelection.delete(item.id);
                                            setSelectedItems(updatedSelection);
                                        }}
                                    >
                                        <Feather name="x-circle" color="white" size={25}/>
                                    </TouchableOpacity>
                                );
                                
                                return (
                                    <Swipeable renderRightActions={renderRightActions} key={item.id}>
                                        <TouchableOpacity
                                            className="flex-row items-center"
                                            onPress={() => router.push(`../products/${item.id}`)}
                                        >
                                            <View style={{marginVertical: 5, flexBasis: '95%'}}
                                                  className="rounded-lg bg-white flex">
                                                <View className="flex-row items-center p-2">
                                                    
                                                    
                                                    <CustomCheckBox
                                                        isChecked={selectedItems.has(item.id)}
                                                        onPress={() => handleSelectItem(item.id)}
                                                    />
                                                    
                                                    <Image
                                                        source={{uri: item.image}}
                                                        style={{width: 100, height: 100}}
                                                        resizeMode="contain"
                                                        className="rounded-t-lg"
                                                    />
                                                    <View className="ml-2 flex-1">
                                                        <Text className="font-bold text-lg text-gray-700">
                                                            {item.artName}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 'bold',
                                                            color: item.limitedTimeDeal > 0 ? 'red' : 'black',
                                                            fontSize: 16
                                                        }}>
                                                            {
                                                                item.limitedTimeDeal == 0 ? (
                                                                    <Text style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        fontSize: 16,
                                                                        marginRight: 10
                                                                    }}>{formatPrice(item.price * 1000.0)}</Text>
                                                                ) : <View className={'flex-row items-center'}>
                                                                    <Text style={{
                                                                        fontWeight: 'bold',
                                                                        color: 'red',
                                                                        fontSize: 16,
                                                                        marginRight: 10
                                                                    }}>{formatPrice((1 - (item?.limitedTimeDeal ?? 0)) * item.price * 1000.0)}</Text>
                                                                    <Text
                                                                        style={{textDecorationLine: 'line-through'}}>{formatPrice(item.price * 1000.0)}</Text>
                                                                </View>
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Swipeable>
                                );
                            }
                        })
                    )}
                </View>
                
                {/* Delete Selected Items Button */}
                {selectedItems.size > 0 && (
                    <View className="absolute bottom-4 w-full items-center">
                        <TouchableOpacity
                            onPress={handleDeleteSelected}
                            style={{
                                backgroundColor: Colors.primaryColor,
                                padding: 10,
                                borderRadius: 8,
                                width: '90%',
                                alignItems: 'center'
                            }}
                        >
                            
                            <View>
                                <Text className={'text-lg text-white'}>Delete {selectedItems.size} products</Text></View>
                        </TouchableOpacity>
                    </View>
                )}
            </GestureHandlerRootView>
        </ScrollView>
    );
}
