import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import BtnFavorite from "@/components/BtnFavourite";
import DiscountCard from "@/components/DiscountCard";
import {formatPrice} from "@/utils/formatPrice";
import {ProductModel} from "@/app/(tabs)";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Feather} from "@expo/vector-icons";

const ListProduct = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductModel[]>([]);
    const API_URL = 'https://66ee3d34380821644cdf047b.mockapi.io/api/v1/Products';
    const {brand, artName} = useLocalSearchParams()
    const router = useRouter()
    
    useEffect(() => {
        let isMounted = true; // To track whether component is still mounted
        setLoading(true)
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}?artName=${artName ?? ""}&brand=${brand ?? ""}`);
                console.log(typeof response.status)
                if (response.status === 404) {
                    setData([])
                }
                if (!response.ok) {
                    return <Text>No products found</Text>
                }
                const jsonData: ProductModel[] = await response.json();
                if (isMounted) {
                    setData(jsonData);
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
    }, [artName, brand]);
    
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }
    const handleRefresh = async () => {
        router.setParams({brand: ''});
        router.setParams({artName: ''});
    }
    
    if (data.length === 0) {
        return <View className={'flex items-center justify-center h-[80vh]'}>
            <Text className={'text-center text-lg my-2'}>No products found</Text>
            <TouchableOpacity className={'flex-row items-center mt-2'} onPress={() => handleRefresh()}>
                <Feather name={"refresh-cw"} className={"mr-2"} size={25}/>
                <Text className={'text-center text-lg'}>Refresh</Text>
            </TouchableOpacity>
        </View>
    }
    if (error) {
        return <Text>Error: {error}</Text>;
    }
    const renderItem = ({item}: { item: ProductModel }) => {
        return <Pressable
            key={item.id} style={{marginBottom: 10, flexBasis: '49%'}}
            className={'rounded-md  shadow-md'}
            onPress={() => router.push(`/products/${item.id}`)}
        >
            <LinearGradient colors={["#FDF0F3", "#FFFBFC"]}>
                <View className={'bg-white py-2 relative'}>
                    <Image
                        source={{uri: item.image}}
                        style={{width: '100%', height: 170}}
                        resizeMode="contain"
                        className={'rounded-t-md'}
                    
                    />
                    <BtnFavorite item={item}/>
                    {item.limitedTimeDeal > 0 && <DiscountCard discount={item.limitedTimeDeal}/>}
                </View>
                
                <View className={' px-1 py-2 rounded-b-md'}>
                    <Text className={'font-normal text-md'} numberOfLines={2}
                          ellipsizeMode="tail">{item.artName}</Text>
                    <Text className={'font-semibold  text-sm py-0.5'}>{item.brand}</Text>
                    
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
                
                </View>
            </LinearGradient>
        </Pressable>
    }
    return (
        <ScrollView contentContainerStyle={{paddingBottom: 120}}>
            <FlatList
                scrollEnabled={false}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{gap: 10, paddingVertical: 5}}
                columnWrapperStyle={{gap: 10}}
                className="w-full h-full "
                style={{paddingHorizontal: 10}}
            />
        </ScrollView>
    );
};

export default ListProduct;