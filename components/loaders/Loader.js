import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

export default function Loader() {
  return (
    <View style={tw`w-full h-full items-center flex justify-center`}>
      <View style={tw`h-[40%]`}>
        <ActivityIndicator
          overlayColor="rgba(255,255,255,0.5)"
          size="large"
          color="#073040"
          style={styles.loader}
        />
        <Text style={tw`text-[1rem] text-[#073040] font-bold`}>
          Chargement...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    transform: [{ scale: 2 }],
    marginTop: 30,
    marginBottom: 0,
    width: 100,
    height: 100,
  },
});
