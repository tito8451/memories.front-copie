import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';
import tw from 'twrnc';
import ButtonLarge from '../ButtonLarge';
import DiaryCard from './DiaryCard';
import Header from '../Header';
import AddButton from '../AddButton';
import Loader from '../loaders/Loader';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initDiary, addNewDiary } from '../../reducers/diary';
//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';

export default function Diary({ isDairyActive, setIsDairyActive, travel }) {
  const dispatch = useDispatch();
  const diaries = useSelector((state) => state.diary.value);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleNewDiary = () => {
    setIsLoading(true);
    fetch(`${API_KEY}/diary/newDiary?travelId=${travel._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '', description: '' }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addNewDiary(data.saved));
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    fetch(`${API_KEY}/diary?_id=${travel._id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(initDiary(data.diaries));
        setIsLoading(false);
      });
  }, [travel._id]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={tw`bg-[#F2DDC2] w-full h-full flex justify-between`}>
      <Header
        title={travel.destination}
        id={travel._id}
        isDairyActive={isDairyActive}
        setIsDairyActive={setIsDairyActive}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {diaries && diaries.length > 0 ? (
            <ScrollView style={tw`bg-[#F2DDC2] w-full h-full`}>
              <View style={tw`w-full h-full p-[.5rem]`}>
                {diaries.map((diary, index) => {
                  return (
                    <View key={`${index}_card`} style={tw`w-full`}>
                      <DiaryCard
                        diary={diary}
                        travelId={travel._id}
                        setIsLoading={setIsLoading}
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          ) : (
            <View style={tw`w-full h-[80%] flex items-center justify-center`}>
              <ButtonLarge
                title="Commencer mon carnet de voyage"
                onClick={handleNewDiary}
              />
            </View>
          )}
        </>
      )}
      {diaries && diaries.length > 0 && !isKeyboardVisible && (
        <AddButton onClick={handleNewDiary} />
      )}
    </View>
  );
}
