import { TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

export default function Button({title, onClick, marginBottom, marginTop}) {
 const handleClick = () => {
    onClick(title);
 };

 return (
    <TouchableOpacity
        style={tw`${marginTop ? 'mt-[1.4rem]' : ''} ${marginBottom ? 'mb-[4rem]' : ''} bg-[#073040] rounded-[1.875rem] w-[65%] py-[.5rem] flex items-center justify-center`}
        onPress={() => handleClick()}
      >
        <Text style={tw`text-[#F2DCC2] text-[1rem]`}>{title}</Text>
    </TouchableOpacity>
 );
}
