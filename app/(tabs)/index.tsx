import {
    
    Animated, View,
    
} from 'react-native';
import ScrollView = Animated.ScrollView;
import Search from "@/components/Search";
import React from "react";
import CardBrand from "@/components/CardBrand";
import {LinearGradient} from "expo-linear-gradient";
import ListProduct from "@/components/ListProduct";
import MoreAction from "@/components/MoreAction";

export interface ProductModel {
    id: string;
    artName: string;
    price: number;
    description: string;
    glassSurface: boolean;
    image: string;
    brand: string;
    limitedTimeDeal: number;
    comments: IComment[];
}

export interface IComment {
    rating: number;
    content: string;
    username: string;
    date_time: string
}

export default function TabOneScreen() {
    
    return (
        
        <View style={{flex: 1}}>
            <LinearGradient colors={["#f7e4e5", "#fff"]} className={''}>
                <Search/>
                <CardBrand/>
                <View className={'py-2'}></View>
                
                
                <ListProduct/>
            
            </LinearGradient>
        </View>
    
    );
}
