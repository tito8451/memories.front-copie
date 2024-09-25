import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';

export default function ButtonLarge({ title, icon, onClick, image }) {
  const handleClick = () => {
    onClick(title);
  };

  return (
    <TouchableOpacity style={tw`flex flex-row bg-[#073040] items-center justify-center rounded-[.625rem] ${image ? 'w-[80%] mt-[1rem] p-[.7rem]' : 'w-[90%] p-[1rem]'}`} onPress={() => handleClick()}>
      {icon && <FontAwesome name={icon} color="#F2DCC2" size={16} />}
      <Text style={tw`text-[1rem] text-[#F2DCC2] ${icon ? 'ml-[.5rem]' : ''}`}>{title}</Text>
    </TouchableOpacity>
  );
}

