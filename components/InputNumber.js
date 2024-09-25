import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';


export default function InputNumber({ value, setValue, isEditing}) {
  const handleNumberChange = (text) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(text)) {
      setValue(text);
    }
  };

  return (
    <View style={tw`${isEditing ? 'bg-[#D9D9D9] h-[2rem] w-[80%]' : ''} rounded-[.625rem] mb-[.6rem] flex items-center`}>
        <TouchableOpacity
        style={tw`p-[.2rem] flex items-center flex-row justify-between`}
        >
            <TextInput
                style={tw`${isEditing ? '' : 'text-[1rem]'} p-[.2rem] font-bold text-[#073040] flex items-center flex-row justify-between ml-[.6rem] text-black`}
                keyboardType="numeric"
                onChangeText={handleNumberChange}
                value={value}
                editable={isEditing}
            />
            <FontAwesome name="euro" color="#073040" size={16} style={tw`mx-[.6rem]`} />
      </TouchableOpacity>
    </View>
  );
};

