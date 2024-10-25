import React, {useState} from 'react';
import {Divider} from "react-native-paper";
import {Feather} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Modal, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const MoreAction = () => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    
    return (
        <>
            <TouchableOpacity onPress={openMenu}>
                <Feather name="more-vertical" size={25} style={{marginLeft: 8}}/>
            </TouchableOpacity>
            <Modal visible={visible} transparent={true} animationType="fade"
                   style={{backgroundColor: "transparent"}}>
                <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity style={{flex: 1}} onPress={closeMenu} activeOpacity={1}/>
                    <View className={'p-4 absolute bg-white  shadow-md rounded'} style={{right: 15, top: 42}}>
                        < TouchableOpacity onPress={() => {
                            router.push('/');
                            closeMenu()
                        }}>
                            <Text className={'text-lg p-2'}>Home</Text>
                        </TouchableOpacity>
                        <Divider/>
                        <TouchableOpacity onPress={() => {
                            router.push('/two');
                            closeMenu()
                            
                        }}>
                            <Text className={'text-lg p-2'}>Wishlist</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
        ;
};

export default MoreAction;
