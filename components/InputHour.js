import { View, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function InputHour({value, setValue}) {
  const handleTimeChange = (text) => {
    setValue(text);
  };

  return (
    <View
      style={tw`bg-[#D9D9D9] text-black rounded-[.625rem] mb-[.6rem] w-[80%] h-[2rem]`}
    >
      <TouchableOpacity
        style={tw`p-[.2rem] flex items-center flex-row justify-between`}
      >
        <TextInput
          value={value || '00:00'}
          onChangeText={handleTimeChange}
          placeholder="HH:mm"
          style={tw`p-[.2rem] flex items-center flex-row justify-between mx-[.6rem]`}
        />
        <FontAwesome name="hourglass" size={16} style={tw`mx-[.6rem]`} />
      </TouchableOpacity>
    </View>
  );
}
