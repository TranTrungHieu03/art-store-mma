import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, Tabs} from 'expo-router';
import {Alert, Pressable, Text, TouchableOpacity} from 'react-native';

import Colors from '@/constants/Colors';
import {useColorScheme} from '@/components/useColorScheme';
import {useClientOnlyValue} from '@/components/useClientOnlyValue';
import {useWishlist} from "@/components/useProductContext";
import Toast from "react-native-toast-message";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const {clearWishlist, wishlist} = useWishlist()
    const handleDelete = () => {
        Alert.alert(
            "Confirm Remove",
            `Do you wanna remove all from your wishlist?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        await clearWishlist()
                    },
                },
            ],
            {cancelable: true}
        );
    };
    
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerTitle: "Art Store",
                    tabBarIcon: ({color}) => <TabBarIcon name="home" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="two"
                options={{
                    title: 'Wishlist',
                    headerTitle: `Wishlist (${wishlist.length ?? 0})`,
                    tabBarIcon: ({color}) => <TabBarIcon name="heart" color={color}/>,
                    headerRight: () => (
                        <TouchableOpacity onPress={handleDelete} disabled={wishlist.length === 0}>
                            <Text
                                className={`  font-medium px-2 mr-2 ${wishlist.length === 0 ? `text-gray-200 bg-gray-100` : 'text-red-500'}`}>Clear
                                all</Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </Tabs>
    );
}
