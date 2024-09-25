import { View } from 'react-native';
import { useState, useEffect } from 'react';
import tw from 'twrnc';
import Diary from '../components/diary/Diary';
import { useSelector } from 'react-redux';
import Planning from '../components/planning/Planning';
//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';

export default function TravelScreen({ route }) {
  const { travelId } = route.params;
  const travels = useSelector((state) => state.travel.value);

  const [travelInfos, setTravelInfos] = useState({});

  const [isDairyActive, setIsDairyActive] = useState(true);

  useEffect(() => {
    const result = travels.filter((item) => item._id === travelId);
    setTravelInfos(result[0]);
  }, [travelId]);

  return (
    <View style={tw`bg-[#F2DDC2] w-full h-full`}>
      {isDairyActive ? (
        <Diary
          isDairyActive={isDairyActive}
          setIsDairyActive={setIsDairyActive}
          travel={travelInfos}
        />
      ) : (
        <Planning
          isDairyActive={isDairyActive}
          setIsDairyActive={setIsDairyActive}
          travel={travelInfos}
        />
      )}
    </View>
  );
}
