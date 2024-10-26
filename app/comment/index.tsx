import React, {useEffect, useState} from 'react';
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from "react-native";
import MoreAction from "@/components/MoreAction";
import {ProductModel} from "@/app/(tabs)";
import {averageRating} from "@/utils/averageRating";
import {AntDesign, Feather} from "@expo/vector-icons";
import Comment from "@/components/Comment";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FilterComment from "@/components/FilterComment";
import {groupComment} from "@/utils/groupComment";
import {setParams} from "expo-router/build/global-state/routing";

const Index = () => {
    const {id, rating} = useLocalSearchParams()
    const toolId = Array.isArray(id) ? id[0] : id;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductModel | null>(null);
    const API_URL = 'https://66ee3d34380821644cdf047b.mockapi.io/api/v1/Products';
    const router = useRouter();
    console.log("rating", rating)
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
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        for (let i = 0; i < fullStars; i++) {
            console.log(fullStars)
            stars.push(<FontAwesome
                key={`full-${i}`}
                name="star"
                size={25}
                color="gold"
            />);
        }
        if (hasHalfStar) {
            stars.push(
                <FontAwesome
                    key={`half-${fullStars}`}
                    name="star-half-empty"
                    size={25}
                    color="gold"
                />
            );
        }
        const totalStars = 5;
        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < totalStars; i++) {
            stars.push(
                <AntDesign key={`empty-${i}`} name="staro" size={25} color="lightgray"/>
            );
        }
        
        return <View className={'flex-row'}>{stars}</View>;
    };
    
    const RatingDisplay = ({rating}: { rating: number }) => (
        <View className={'flex-row items-center gap-1'}>
            {renderStars(rating)}
        </View>
    );
    
    const groupCmt = groupComment(data?.comments ?? [])
    
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: "Feedback",
                    headerRight: () => (
                        <TouchableOpacity>
                            <MoreAction/>
                        </TouchableOpacity>
                    )
                }}
            />
            <ScrollView style={{flex: 1}}>
                <View className={'flex-row px-5 py-4  justify-between items-center'}>
                    <View>
                        
                        <RatingDisplay rating={Number(averageRating(data?.comments ?? []))}/>
                        
                        
                        <View className={'flex-row '}>
                            <Text className={'ml-2 text-light text-lg'}>
                                {averageRating(data?.comments ?? [])}/5.0
                            </Text>
                            <Text className={'ml-2 text-light text-lg'}>
                                ({data?.comments.length} comments)
                            </Text>
                        </View>
                    </View>
                    {/*<FilterComment></FilterComment>*/}
                </View>
                <View className={'flex-row justify-evenly items-center px-2 py-2 '}>
                    {
                        [...Array(7)].map((_, index) => (
                            
                            (index === 6) ?
                                (<TouchableOpacity key={`comment-${index}`} onPress={() => router.setParams({rating: undefined})}
                                                   className={`  items-center p-3 border border-gray-50 ${!(Number(rating) >= 0 && Number(rating) < 6) && 'bg-[#e0f58c] font-bold'}`}>
                                    <Text
                                        className={`text-lg mr-2 ${!(Number(rating) >= 0 && Number(rating) < 6) && 'bg-[#e0f58c] font-semibold'}`}>All</Text>
                                    <Text key={`comment-${index}`}
                                        className={`text-lg   ${!(Number(rating) >= 0 && Number(rating) < 6) && 'bg-[#e0f58c] font-semibold shadow'}`}>({data?.comments.length})</Text>
                                </TouchableOpacity>) :
                                (<TouchableOpacity key={`comment-${index}`} onPress={() => router.setParams({rating: index})}
                                                   className={`  items-center p-3 border border-gray-50  ${(Number(rating) === index) && 'bg-[#e0f58c] font-bold'}`}>
                                    <View className={'flex-row'} key={`comment-${index}`}>
                                        <Text
                                            className={`text-lg mr-2 ${(Number(rating) === index) && 'bg-[#e0f58c] font-semibold'}`}>{index}</Text>
                                        <FontAwesome
                                            key={index}
                                            name="star"
                                            size={20}
                                            color="gold"
                                        />
                                    </View>
                                    <Text
                                        className={`text-lg mr-2 ${(Number(rating) === index) && 'bg-[#e0f58c] font-semibold shadow'}`}>({groupCmt[index].comments.length})</Text>
                                
                                </TouchableOpacity>)
                        
                        ))
                    }
                
                </View>
                <View>
                    {data?.comments?.length != 0 && !(Number(rating) >= 0 && Number(rating) < 6) &&
                        data?.comments?.map((item, index) => {
                            return <Comment key={index} data={item}/>
                        })}
                </View>
                <View>
                    {
                        !(Number(rating) >= 0 && Number(rating) < 6) &&
                        data?.comments?.length == 0 && (<Text className={'text-center p-2  '}>No comment here</Text>)
                    }
                </View>
                <View>
                    {
                        (Number(rating) >= 0 && Number(rating) < 6) &&
                        groupCmt[Number(rating)].comments?.length == 0 && (
                            <Text className={'text-center p-2  '}>No comment here</Text>)
                    }
                </View>
                <View>
                    {
                        (Number(rating) >= 0 && Number(rating) < 6) &&
                        groupCmt[Number(rating)].comments?.length != 0 && groupCmt[Number(rating[0] ?? 0)].comments?.map((item, index) => {
                            return <Comment key={index} data={item}/>
                        })
                    }
                </View>
            
            </ScrollView>
        
        </>
    )
        ;
};

export default Index;