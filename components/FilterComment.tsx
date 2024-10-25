import React, {useState} from 'react';
import {Divider} from "react-native-paper";
import {Feather} from "@expo/vector-icons";
import {Modal, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {IGroupComment} from "@/utils/groupComment";
import {useRouter} from "expo-router";

const FilterComment = ({groupComment, id}: { groupComment: IGroupComment[], id?: string }) => {
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    
    return (
        <>
            <TouchableOpacity className={'flex-row '} onPress={openMenu}>
                <Text className={`font-normal px-2  text-red-500 `}>
                    Filter
                </Text>
                <Feather name={'filter'} size={20} color={'red'}/>
            </TouchableOpacity>
            <Modal visible={visible} transparent={true} animationType="fade"
                   style={{backgroundColor: "transparent"}}>
                <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity style={{flex: 1}} onPress={closeMenu} activeOpacity={1}/>
                    <View className={'p-4 absolute bg-white flex gap-4  shadow-md rounded w-300'}
                          style={{right: 60, top: 300}}>
                        {
                            [...Array(6)].map((_, index) => (
                                <View className={'flex-row items-start gap-2'} key={index}>
                                    <View>
                                        < TouchableOpacity onPress={() => router.push({
                                            pathname: "/comment",
                                            params: {id: id ?? 0, rating: index},
                                        })}>
                                            <View className={'flex-row gap-1'}>
                                                {[...Array(index)].map((_, i) => (
                                                    <FontAwesome
                                                        key={i}
                                                        name="star"
                                                        size={20}
                                                        color="gold"
                                                    />
                                                ))}
                                                {[...Array(5 - index)].map((_, i) => (
                                                    <FontAwesome
                                                        key={i + 5}
                                                        name="star"
                                                        size={20}
                                                        color="grey"
                                                    />
                                                ))}
                                            </View>
                                        </TouchableOpacity>
                                        <Divider className={'my-2'}/>
                                    </View>
                                    
                                    <Text className={'ml-2'}>
                                        ({groupComment[index].comments.length})
                                    </Text>
                                
                                </View>
                            ))
                        }
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
        ;
};

export default FilterComment;
