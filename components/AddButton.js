import { View, ScrollView, TouchableOpacity, Text, Keyboard } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function AddButton({ onClick }) {
  return (
    <TouchableOpacity onPress={onClick} style={tw`m-[1rem] bg-[#073040] rounded-full w-[3rem] h-[3rem] flex items-center justify-center`}>
        <FontAwesome name="plus" color="#F2DCC2" size={24} />
    </TouchableOpacity>
  );
}