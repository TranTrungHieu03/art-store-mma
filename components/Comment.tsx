import React from 'react';
import {Text, View} from "react-native";
import {IComment} from "@/app/(tabs)";
import {Divider} from "react-native-paper";
import {AntDesign} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Comment = ({data}: { data: IComment }) => {
    return (
        <View>
            <Divider/>
            <View className={' px-5 py-2'}>
                <View className={'flex-row justify-between items-center'}>
                    <Text className={'font-medium text-md py-1'}>{data.username}</Text>
                    <View className={'flex-row gap-1'}>
                        {[...Array(data.rating)].map((_, i) => (
                            <FontAwesome
                                key={i}
                                name="star"
                                size={16}
                                color="gold"
                            />
                        ))}
                        {[...Array(5 - data.rating)].map((_, i) => (
                            <FontAwesome
                                key={i+5}
                                name="star"
                                size={16}
                                color="grey"
                            />
                        ))}
                    </View>
                </View>
                <Text className={'text-md font-light'}>{data.content}</Text>
                <View className={'flex-row items-center justify-end'}>
                    <Text className={'font-medium text-sm  '}>{data.date_time}</Text>
                </View>
            </View>
        </View>
    );
};

export default Comment;