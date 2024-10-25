import React, {useState} from 'react';
import {Keyboard, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "@/constants/Colors";
import {Feather} from "@expo/vector-icons";
import {useLocalSearchParams, useRouter} from "expo-router";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const {brand} = useLocalSearchParams();
    const router = useRouter()
    const brandQuery = Array.isArray(brand) ? brand[0] : brand;
    
    const handleSearch = () => {
        Keyboard.dismiss();
        if (searchQuery === "") {
            router.push("/");
            if (brandQuery !== undefined) {
                router.setParams({brand: brandQuery});
            }
        } else {
            router.setParams({artName: searchQuery});
        }
    };
    return (
        <View className="p-4 flex-row items-center">
            <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                className="border border-gray-300 rounded-md p-2 flex-1 relative"
                style={{backgroundColor: "#fff"}}
            />
            {searchQuery && <TouchableOpacity onPress={() => {
                setSearchQuery('')
                router.setParams({artName: ''});
                // Keyboard.();
            }} className={'p-2'}>
                <Feather name={'x-circle'} color={'grey'} size={24}
                         className={'absolute z-10 right-[30px] -top-2 transform '}/>
            </TouchableOpacity>}
            <TouchableOpacity
                onPress={handleSearch}
                className="ml-2 rounded p-2  "
                style={{backgroundColor: Colors.primaryColor}}>
                <Feather name="search" size={24} color={'#fff'}/>
            </TouchableOpacity>
        </View>
    );
};

export default Search;