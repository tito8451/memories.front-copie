import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Button from './Button';
import { format } from 'date-fns';

const { width, height } = Dimensions.get('window');

export default function InputDate({
  size,
  placeholder,
  marginTop,
  value,
  setValue,
}) {
  const inputHeight = () => {
    switch (size) {
      default:
      case 'normal':
        return 'h-[2.5rem]';
      case 'small':
        return 'h-[2rem]';
    }
  };

  const [date, setDate] = useState();
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveDate = () => {
    const formattedDate = format(new Date(date), 'dd/MM/yyyy');
    setValue(formattedDate);
    setShowModal(false);
  };

  return (
    <View
      style={tw`${marginTop ? 'mt-[1rem]' : ''} ${
        size === 'small' ? 'px-[.5rem]' : 'p-[.5rem]'
      } bg-[#D9D9D9] text-black rounded-[.625rem] mb-[.6rem] ${inputHeight()} w-[80%]`}
    >
      <TouchableOpacity
        onPress={handleOpenModal}
        style={tw`p-[.2rem] flex items-center flex-row justify-between`}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          onFocus={handleOpenModal}
        />
        <FontAwesome name="calendar" size={16} />
      </TouchableOpacity>

      <Modal transparent={true} animationType="slide" visible={showModal}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              width: width * 0.85,
              height: height * 0.5,
              borderRadius: 8,
              backgroundColor: 'white',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={handleCloseModal}
              style={tw`mb-[1rem] w-full`}
            >
              <Text style={tw`text-[1rem] font-bold`}>x</Text>
            </TouchableOpacity>
            <CalendarPicker
              onDateChange={handleDateChange}
              selectedDayColor="#D8725B"
              width={300}
            />
            <Button title="Valider" onClick={handleSaveDate} marginTop />
          </View>
        </View>
      </Modal>
    </View>
  );
}
