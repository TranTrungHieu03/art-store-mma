import React, {useEffect, useState} from 'react';
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {useWishlist} from "@/components/useProductContext";
import {ProductModel} from "@/app/(tabs)";
import {ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Toast from "react-native-toast-message";
import {AntDesign, Feather} from "@expo/vector-icons";
import MoreAction from "@/components/MoreAction";
import {LinearGradient} from "expo-linear-gradient";
import {formatPrice} from "@/utils/formatPrice";
import Comment from "@/components/Comment";
import {averageRating} from "@/utils/averageRating";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import FilterComment from "@/components/FilterComment";
import {groupComment} from "@/utils/groupComment";

const Id = () => {
    const {id} = useLocalSearchParams();
    const {isWishlisted, removeFromWishlist, addWishlist} = useWishlist();
    const toolId = Array.isArray(id) ? id[0] : id;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductModel | null>(null);
    const API_URL = 'https://66ee3d34380821644cdf047b.mockapi.io/api/v1/Products';
    const router = useRouter();
    
    const favorited = isWishlisted(toolId);
    
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/${toolId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData: ProductModel = await response.json();
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
    }, []);
    
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }
    
    if (error) {
        return <Text>Error: {error}</Text>;
    }
    
    const handleFavoritePress = async () => {
        if (favorited) {
            await removeFromWishlist(toolId);
        } else {
            await addWishlist(data?.id ?? '0');
        }
        // showToast();
    };
    let isBreak = false;
    const showToast = () => {
        Toast.show({
            type: !favorited ? "success" : "info",
            text1: !favorited ? `Added to Favorite` : `Removed from Favorite`,
        });
    };
    
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        for (let i = 0; i < fullStars; i++) {
            console.log(fullStars)
            stars.push(<FontAwesome
                key={`full-${i}`}
                name="star"
                size={18}
                color="gold"
            />);
        }
        if (hasHalfStar) {
            stars.push(
                <FontAwesome
                    key={`half-${fullStars}`}
                    name="star-half-empty"
                    size={18}
                    color="gold"
                />
            );
        }
        const totalStars = 5;
        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < totalStars; i++) {
            stars.push(
                <AntDesign key={`empty-${i}`} name="staro" size={18} color="lightgray"/>
            );
        }
        
        return <View className={'flex-row'}>{stars}</View>;
    };
    
    const RatingDisplay = ({rating}: { rating: number }) => (
        <View className={'flex-row items-center gap-1'}>
            {renderStars(rating)}
        </View>
    );
    
    console.log(groupComment(data?.comments ?? []))
    
    const groupCmt = groupComment(data?.comments ?? [])
    
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView className={'flex-1'}>
                    <Stack.Screen
                        options={{
                            headerTransparent: true,
                            headerBackButtonMenuEnabled: true,
                            headerTitle: "",
                            headerRight: () => (
                                <View className={'flex-row'}>
                                    <TouchableOpacity
                                        className={" "}
                                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                        onPress={handleFavoritePress}
                                    >
                                        {!favorited ? <FontAwesome name="heart"
                                                                   size={26}
                                                                   color="grey"/> :
                                            <FontAwesome name="heart"
                                                         size={26}
                                                         color="red"/>}
                                    </TouchableOpacity>
                                    <TouchableOpacity className={'ml-2'}>
                                        <MoreAction/>
                                    </TouchableOpacity>
                                
                                </View>
                            ),
                        }}
                    />
                    <LinearGradient colors={["#FDF0F3", "#FFFBFC"]} className={'h-full'}>
                        <View className={'bg-white '}>
                            <Image
                                source={{uri: data?.image}}
                                style={{width: '100%', height: 300}}
                                resizeMode="contain"
                                className={'rounded-t-md'}
                            
                            />
                        </View>
                        {(data?.limitedTimeDeal ?? 0) > 0 &&
                            <LinearGradient colors={["#d60611", "#de313a", "#fc8d93"]} start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}}>
                                <Text className={'font-light text-lg px-2 py-2 text-white items-center justify-center'}>SALE
                                    OFF {data?.limitedTimeDeal! * 100}%</Text>

                            </LinearGradient>}
                        
                        
                        <View className="p-5">
                            <View className="flex flex-row justify-between">
                                <Text className="font-bold text-xl">{data?.artName}</Text>
                            </View>
                            
                            <View className="flex-row  items-center">
                                <Text className={'font-semibold text-lg'}>{data?.brand} </Text>
                            </View>
                            {data?.glassSurface ? <View className="flex-row  items-center">
                                <Text className={'rounded-full py-1'}>Glass Surface </Text>
                                <Feather name={'check-circle'} size={18} color={"green"}/>
                            </View> : <View className="flex-row  items-center">
                                <Text className={'rounded-full py-1'}>GlassSurface </Text>
                                <Feather name={'x-circle'} size={18} color={"red"}/>
                            </View>}
                            
                            {(data?.limitedTimeDeal ?? 0) > 0 ? (
                                <View className={'flex-row items-center'}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: 'red',
                                        fontSize: 18,
                                        marginRight: 10
                                    }}>{formatPrice((1 - data?.limitedTimeDeal!) * data?.price! * 1000.0)}</Text>
                                    <Text
                                        style={{textDecorationLine: 'line-through'}}
                                        className={'text-md'}>{formatPrice(data?.price! * 1000.0)}</Text>
                                </View>
                            ) : (
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        color: 'red',
                                        fontSize: 18,
                                        marginRight: 10
                                    }}
                                    className={'text-md'}>{formatPrice(data?.price! * 1000.0)}</Text>
                            )}
                            <View className="my-2">
                                <Text className="font-light text-lg">{data?.description}</Text>
                            </View>
                        </View>
                        <View className={'bg-white mb-2'}>
                            <View className={'flex-row  px-5 py-2 justify-between items-center'}>
                                <Text className={'text-lg font-normal'}>Product Review</Text>
                                {(data?.comments?.length ?? 0) > 0 ?
                                    <TouchableOpacity className={'flex-row '} onPress={() => router.push({
                                        pathname: "/comment",
                                        params: {id: data?.id},
                                    })}>
                                        
                                        <Text className={'text-md font-normal text-red-500'}>See all
                                            ({data?.comments?.length ?? 0})</Text>
                                        <Feather name={'chevron-right'} size={20} color={"red"}/>
                                    </TouchableOpacity> : <View/>}
                            </View>
                            <View className={'flex-row px-5 pb-2  justify-between items-center'}>
                                <View className={'flex-row  '}>
                                    <RatingDisplay rating={Number(averageRating(data?.comments ?? []))}/>
                                    <Text className={'ml-2 text-light'}>
                                        {averageRating(data?.comments ?? [])}/5.0
                                    </Text>
                                    <Text className={'ml-2 text-light'}>
                                        ({data?.comments.length} comments)
                                    </Text>
                                </View>
                                {data?.comments.length != 0 &&   <FilterComment groupComment={groupCmt} id={data?.id}/>}
                            </View>
                            <View>
                                {data?.comments?.length == 0 ? (
                                    <View>
                                        <Text className={'text-center p-2  '}>No comment here</Text>
                                    </View>
                                ) : data?.comments.map((item, index) => {
                                    
                                    if (isBreak) {
                                        return;
                                    }
                                    if (index == 3) {
                                        isBreak = true;
                                        return <TouchableOpacity className={' pb-2 '} key={'see-more'}
                                                                 onPress={() => router.push({
                                                                     pathname: "/comment",
                                                                     params: {id: data?.id},
                                                                 })}>
                                            <Text className={'text-center text-red-500 '}>See
                                                more {data?.comments.length - 3} comments</Text>
                                        </TouchableOpacity>
                                        
                                    } else {
                                        return <Comment key={index} data={item}/>
                                    }
                                    
                                })}
                            </View>
                        </View>
                    </LinearGradient>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Id;