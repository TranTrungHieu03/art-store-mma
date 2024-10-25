import React from "react";
import {Image, ToastAndroid, TouchableOpacity} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import Toast from "react-native-toast-message";
import {useWishlist} from "@/components/useProductContext";
import {ProductModel} from "@/app/(tabs)";

type Props = {
    item: ProductModel | null;
};

const BtnFavorite = ({item}: Props) => {
    const {
        addWishlist,
        removeFromWishlist,
        isWishlisted,
    } = useWishlist();
    const favorited = isWishlisted(item?.id ?? '');
    
    const showToast = () => {
        Toast.show({
            type: !favorited ? "success" : "info",
            text1: !favorited
                ? `Added ${item?.artName} to Favorite`
                : `Removed ${item?.artName} from Favorite`,
        });
    };
    
    const handleFavoritePress = async () => {
        if (favorited) {
            await removeFromWishlist(item?.id ?? "");
        } else {
            await addWishlist(item?.id ?? "");
        }
        showToast();
    };
    return (
        <TouchableOpacity
            className="absolute z-10 top-2 right-2 "
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={handleFavoritePress}
        >
            {!favorited ? <Feather name="heart" size={28} color={"#ccc"}/> :
                <Image source={require('@/assets/images/icons8-heart-30.png')} style={{width: 32, height: 32}}/>}
        </TouchableOpacity>
    );
};

export default BtnFavorite;
