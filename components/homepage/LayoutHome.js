import { View, Text } from 'react-native';
import tw from 'twrnc';

export default function LayoutHome({children, type }) {
 const title = type === 'new' ? 'Nouveau voyage' : 'Mes voyages';

 return (
    <View style={tw`w-full h-full flex flex-col items-center`}>
        <View style={tw`w-full flex items-center`}>
            <Text style={tw`text-[1.375rem] font-bold text-[#073040]`}>{title}</Text>
            <View style={tw`h-0.5 bg-[#073040] w-[80%] mt-[1rem]`} />
        </View>
        <View style={tw`w-full h-[75%] flex flex-col items-center`}>
            {children}
        </View>
    </View>
 );
}