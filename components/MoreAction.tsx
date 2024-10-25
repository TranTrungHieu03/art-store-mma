import React, {useState} from 'react';
import {Divider, Menu, Provider} from "react-native-paper";
import {Feather} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Text, TouchableOpacity, View} from "react-native";

const MoreAction = () => {
    const router = useRouter();
    
    const [visible, setVisible] = useState(false);
    
    const openMenu = () => setVisible(true);
    
    const closeMenu = () => setVisible(false);
    return (
        <Provider>
            <View>
                <TouchableOpacity onPress={openMenu}>
                    <Feather name="more-vertical" size={25} className="ml-2"/>
                </TouchableOpacity>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<View/>}>
                    <Menu.Item onPress={() => router.push(`..//(tabs)`)} title="Home"/>
                    <Menu.Item onPress={() => router.push(`../(tabs)/two`)} title="Wishlist"/>
                    <Divider/>
                
                </Menu>
            </View>
        </Provider>
    );
};

export default MoreAction;