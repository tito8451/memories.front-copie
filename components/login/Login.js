import { View, Image } from 'react-native';
import tw from 'twrnc';
import Button from '../Button';

export default function LoginScreen({ onClick }) {
  return (
    <>
      <View style={tw`h-[60%] w-full flex items-center justify-center`}>
        <Image
          source={require('../../assets/logo-blanc-hd.png')}
          alt="logo"
          style={tw`h-[20rem] w-[20rem]`}
        />
      </View>
      <View style={tw`h-[40%] w-full flex flex-col items-center`}>
        <Button
          title="Sign in"
          onClick={onClick}
          marginBottom
        />
        <Button
          title="Sign up"
          onClick={onClick}
          marginBottom
        />
      </View>
    </>
  );
}

