import React from 'react';
import {Text, View} from "react-native";

const DiscountCard = ({discount}:{discount: number}) => {
    return (
        <View className={'absolute z-10 bottom-1 left-0 bg-red-600 rounded-r-full'}>
            <Text className={'font-light text-white px-2 py-0.5 rounded text-sm'}>
                {discount*100}% OFF
            </Text>
        </View>
    );
};

export default DiscountCard;