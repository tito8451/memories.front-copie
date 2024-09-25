import { useState, useEffect } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import Login from '../components/login/Login';
import SignInUp from '../components/login/SignInUp';
import { useSelector } from 'react-redux';

export default function LoginScreen({navigation}) {
  const user = useSelector((state) => state.user.value);

  const [register, setRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const onClick = (value) => {
    setRegister(value === 'Sign up');
    setIsLogin(false);
  };

  useEffect(() => {
    if (user && user.token) {
      navigation.navigate('TabNavigator');
    }
  }, []);

  return (
    <View
      style={tw`flex flex-col items-center justify-center w-full h-full bg-[#D8725B] p-[1rem]`}
    >
      {isLogin ? (
        <Login onClick={onClick} />
      ) : (
        <SignInUp
          register={register}
          setRegister={setRegister}
          navigation={navigation}
        />
      )}
    </View>
  );
}
