import {ActivityIndicator, Animated, Image, Text, TouchableOpacity, View, Alert} from 'react-native';
import ScrollView = Animated.ScrollView;
import {useWishlist} from "@/components/useProductContext";
import React, {useEffect, useState} from "react";
import {ProductModel} from "@/app/(tabs)/index";
import {Feather} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import DiscountCard from "@/components/DiscountCard";
import {formatPrice} from "@/utils/formatPrice";
import {useRouter} from "expo-router";
import {GestureHandlerRootView, Swipeable} from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function TabTwoScreen() {
    const {wishlist, removeFromWishlist, removeMultipleFromWishlist, clearWishlist} = useWishlist()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductModel[]>([]);
    const API_URL = 'https://66ee3d34380821644cdf047b.mockapi.io/api/v1/Products';
    const [isSelected, setSelection] = useState(false)
    const router = useRouter()
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
                    setData(jsonData);
                    
                    const listCategories = ["All"];
                    jsonData.forEach((item: ProductModel) => listCategories.push(item.brand));
                    const setBrand = new Set<string>(listCategories);
                }
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
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }
    if (wishlist.length < 1) {
        return <View className="h-[80vh] justify-center items-center">
            <Feather name="heart" size={64} color={Colors.primaryColor}/>
            <Text
                className="text-xl text-gray-600 mt-4">No wishlist</Text>
        </View>
    }
    if (error) {
        return <Text>Error: {error}</Text>;
    }
    
    const showToastDeleted = (item: ProductModel) => {
        Toast.show({
            type: "info",
            text1: `Removed ${item.artName} from Wishlist`,
        });
    };
    
    return (
        <ScrollView>
            <GestureHandlerRootView>
                <View className={'mx-2 flex-row flex-wrap justify-center'}>
                    {data && data.length > 0 && (
                        data.map((item) => {
                                if (wishlist.includes(item.id)) {
                                    const renderRightActions = () => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: Colors.primaryColor,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: 60,
                                                    padding: 10,
                                                    marginVertical: 5
                                                }}
                                                className={'rounded-r-md'}
                                                onPress={async () => {
                                                    await removeFromWishlist(item.id)
                                                    showToastDeleted(item)
                                                }}
                                            >
                                                <Feather name={"x-circle"} color={"white"} size={25}/>
                                            </TouchableOpacity>
                                        );
                                    };
                                    return <Swipeable renderRightActions={renderRightActions} key={item.id}>
                                        <TouchableOpacity className={'flex-row items-center'}
                                                          onPress={() => router.push(`../products/${item.id}`)}
                                            // onLongPress={() => removeFromWishlist(item.id)}
                                        >
                                            {/*<CheckBox*/}
                                            {/*    value={isSelected}*/}
                                            {/*    onValueChange={setSelection}*/}
                                            {/*    tintColors={{true: '#f00', false: '#000'}} // Tùy chỉnh màu*/}
                                            {/*/>*/}
                                            <View style={{marginVertical: 5, flexBasis: '95%'}}
                                                  className={'rounded-lg bg-white flex'}>
                                                <View className={'flex-row px-2 py-2 items-center '}>
                                                    <Image source={require('@/assets/images/icons8-store-24.png')}
                                                           style={{width: 20, height: 20}}/>
                                                    <Text className={'font-bold ml-2 text-gray-700 '}>{item.brand}</Text>
                                                </View>
                                                <View className={'flex-row'}>
                                                    <View className={'bg-white p-2 relative'}>
                                                        <Image
                                                            source={{uri: item.image}}
                                                            style={{width: 100, height: 100}}
                                                            resizeMode="contain"
                                                            className={'rounded-t-lg'}
                                                        
                                                        />
                                                        {item.limitedTimeDeal > 0 &&
                                                            <DiscountCard discount={item.limitedTimeDeal}/>}
                                                    </View>
                                                    
                                                    <View className={'flex-1'}>
                                                        <Text className={'font-medium text-lg py-2'}
                                                              style={{overflow: 'hidden', flexShrink: 1, maxWidth: '100%',}}
                                                              numberOfLines={2}
                                                              ellipsizeMode="tail">{item.artName}</Text>
                                                        
                                                        <View className={'flex-row items-center'}>
                                                            <Text style={{
                                                                fontWeight: 'bold',
                                                                color: 'red',
                                                                fontSize: 16,
                                                                marginRight: 10
                                                            }}>{formatPrice((1 - item.limitedTimeDeal) * item.price * 1000.0)}</Text>
                                                            <Text
                                                                style={{textDecorationLine: 'line-through'}}>{formatPrice(item.price * 1000.0)}</Text>
                                                        </View>
                                                    </View>
                                                
                                                
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Swipeable>
                                }
                            }
                        ))
                    }
                </View>
            </GestureHandlerRootView>
        </ScrollView>
    );
}


