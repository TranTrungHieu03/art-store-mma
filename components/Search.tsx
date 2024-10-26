import React, {useCallback, useState} from 'react';
import { Keyboard, TextInput, TouchableOpacity, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import {useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const {brand} = useLocalSearchParams();
    const router = useRouter();
    const brandQuery = Array.isArray(brand) ? brand[0] : brand;
    
    useFocusEffect(
        useCallback(() => {
            return () => {
                setSearchQuery('');
                router.setParams({artName: ''});
            };
        }, [])
    );
    
    const handleSearch = () => {
        Keyboard.dismiss();
        setShowSuggestions(false);
        if (searchQuery === '') {
            router.push('/');
            if (brandQuery !== undefined) {
                router.setParams({brand: brandQuery});
            }
        } else {
            router.setParams({artName: searchQuery});
        }
    };
    
    const handleClearSearch = () => {
        setSearchQuery('');
        setShowSuggestions(false);
        router.setParams({artName: ''});
        Keyboard.dismiss()
    };
    
    return (
        <View className="p-4 relative">
            {/* Search Input with Prefix Icon */}
            <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
                <Feather name="search" size={20} color="grey" style={{marginRight: 8}}/>
                <TextInput
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        setShowSuggestions(text.length > 0);
                    }}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    className="flex-1"
                />
                {searchQuery && (
                    <TouchableOpacity onPress={handleClearSearch} className="p-2">
                        <Feather name="x-circle" color="grey" size={20}/>
                    </TouchableOpacity>
                )}
            </View>
            
            {/* Suggestions List */}
            {showSuggestions && (
                <View className="absolute  top-[62px] left-4 right-4 bg-white border border-gray-300 rounded-md z-10">
                    
                    <TouchableOpacity
                        onPress={() => {
                            setSearchQuery(searchQuery);
                            setShowSuggestions(false);
                            handleSearch();
                        }}
                        className="p-2 border-b border-gray-200  flex-row justify-between items-center"
                    >
                        <TextInput>{searchQuery}</TextInput>
                        <Feather name={'arrow-right'} size={24} color="grey" className={'px-2'}/>
                    </TouchableOpacity>
                    
                
                </View>
            )}
        </View>
    );
};

export default Search;