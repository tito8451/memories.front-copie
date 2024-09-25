import { View, Image, TouchableOpacity, Keyboard } from 'react-native';
import tw from 'twrnc';
import Input from '../Input';
import InputDate from '../InputDate';
import { useState, useEffect } from 'react';
import ButtonLarge from '../ButtonLarge';
import { useDispatch, useSelector } from 'react-redux';
import { addTravel } from '../../reducers/travel';
import * as ImagePicker from 'expo-image-picker';
import Loader from '../loaders/Loader';
//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';

export default function NewTravel({ navigation, newTravelName, onClick }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [destination, setDestination] = useState(
    newTravelName ? newTravelName : ''
  );
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState();

  const handleAddImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission d'accès à la galerie requise");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const createNewTravel = async (latitude, longitude) => {
    const formData = new FormData();

    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('destination', destination);
    formData.append('departure', departureDate);
    formData.append('return', returnDate);

    if (selectedImageUri) {
      formData.append('coverImage', {
        uri: selectedImageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }

    fetch(`${API_KEY}/travel/newTravel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user.token}`,
      },
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.result) {
          onClick();
          dispatch(addTravel(data.trip));
          navigation.navigate('Travel', { travelId: data.trip._id });
          setIsLoading(false);
        }
      });
  };

  const handleCreateNewTravel = () => {
    if (destination && departureDate && returnDate) {
      setIsLoading(true);

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destination}&limit=1`
      )
        .then((response) => response.json())
        .then((data) => {
          const latitude = data[0].lat;
          const longitude = data[0].lon;
          if (latitude && longitude) {
            createNewTravel(latitude, longitude);
          }
        });
    }
  };

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
    <View
      style={tw`w-full flex flex-col items-center justify-between h-full ${
        isKeyboardVisible ? 'absolute top-50' : ''
      }`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <View style={tw`w-full flex flex-col items-center mt-[4rem]`}>
            <Input
              value={destination}
              setValue={setDestination}
              placeholder="Destination"
              size="normal"
            />
            <InputDate
              size="normal"
              placeholder="Date de départ"
              marginTop
              value={departureDate}
              setValue={setDepartureDate}
            />
            <InputDate
              size="normal"
              placeholder="Date de retour"
              marginTop
              value={returnDate}
              setValue={setReturnDate}
            />
            {selectedImageUri ? (
              <TouchableOpacity
                onPress={handleAddImage}
                style={tw`w-[80%] h-[50%] mt-[1rem] rounded-[.5rem]`}
              >
                <Image
                  source={{ uri: selectedImageUri }}
                  style={tw`w-full h-full rounded-[.5rem]`}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <ButtonLarge
                icon="plus"
                title="Ajout image de couverture"
                onClick={handleAddImage}
                image
              />
            )}
          </View>
          <ButtonLarge
            title="Créer un nouveau voyage"
            icon="check"
            onClick={handleCreateNewTravel}
          />
        </>
      )}
    </View>
  );
}
