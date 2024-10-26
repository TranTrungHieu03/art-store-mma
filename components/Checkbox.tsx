// CustomCheckBox.js
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors'; // Adjust this path to your Colors module

interface CustomCheckBoxProps {
    isChecked: boolean;
    onPress: () => void;
    label?: string;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ isChecked, onPress, label }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
        >
            {/* Box with checkmark or empty state */}
            <View
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: Colors.primaryColor,
                    backgroundColor: isChecked ? Colors.primaryColor : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {isChecked && <Feather name="check" size={16} color="white" />}
            </View>
            
            {/* Optional Label Text */}
            {label && (
                <Text style={{ marginLeft: 8, fontSize: 16, color: Colors.primaryColor }}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default CustomCheckBox;
