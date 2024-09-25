import { useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import TravelCard from './TravelCard';
import tw from 'twrnc';
import ButtonLarge from '../ButtonLarge';
import { useSelector, useDispatch } from 'react-redux';
import { initTravel } from '../../reducers/travel';
//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';

export default function TravelList({ setNewTravel, navigation, onClick }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const travel = useSelector((state) => state.travel.value);

  const handleNewTravel = () => {
    setNewTravel(true);
  };

  useEffect(() => {
    fetch(`${API_KEY}/travel?token=${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(initTravel(data.trips));
      });
  }, []);

  return (
    <View
      style={tw`w-full flex flex-col items-center justify-between h-full pt-[2rem]`}
    >
      {travel && travel.length > 0 && (
        <ScrollView>
          {travel.map((data, i) => (
            <TravelCard
              key={i}
              navigation={navigation}
              travel={data}
              onClick={onClick}
            />
          ))}
        </ScrollView>
      )}
      <ButtonLarge
        title="Ajouter un nouveau voyage"
        icon="plus"
        onClick={handleNewTravel}
      />
    </View>
  );
}
