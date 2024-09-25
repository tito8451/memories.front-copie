import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  Image,
} from 'react-native';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import InputDate from './InputDate';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { reverseDate } from '../utils/functions';
import { useDispatch } from 'react-redux';
import { updateTravel } from '../reducers/travel';
import Loader from './loaders/Loader';
//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';
import * as ImagePicker from 'expo-image-picker';

export default function Header({ isDairyActive, setIsDairyActive, id }) {
  const dispatch = useDispatch();
  const travels = useSelector((state) => state.travel.value);

  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [travel, setTravel] = useState();

  const [title, setTitle] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [coverImage, setCoverImage] = useState();

  const updateInfos = (infos) => {
    setIsLoading(true);

    fetch(`${API_KEY}/travel/update?_id=${travel._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: infos,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(updateTravel(data.trip));
          setIsLoading(false);
        }
      });
  };

  const handleChangeImage = async () => {
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
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleChange = async () => {
    const formData = new FormData();

    if (title !== travel.destination) {
      await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${title}&limit=1`
      )
        .then((response) => response.json())
        .then((data) => {
          formData.append('latitude', parseFloat(data[0].lat));
          formData.append('longitude', parseFloat(data[0].lon));
          formData.append('destination', title);
        });
    }

    if (departureDate !== reverseDate(travel.departure)) {
      formData.append('departure', departureDate);
    }

    if (returnDate !== reverseDate(travel.return)) {
      formData.append('return', returnDate);
    }

    if (
      (travel.coverImage && coverImage !== travel.coverImage.secure_url) ||
      (!travel.coverImage && coverImage)
    ) {
      formData.append('image', {
        uri: coverImage,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }

    updateInfos(formData);
    setEdit(false);
  };

  useEffect(() => {
    let result = [];
    if (id) {
      result = travels.filter((travel) => travel._id === id);
      setTitle(result[0].destination);
      setDepartureDate(reverseDate(result[0].departure));
      setReturnDate(reverseDate(result[0].return));
      setCoverImage(result[0].coverImage && result[0].coverImage);
      setTravel(result[0]);
      setIsLoading(false);
    }
  }, [id]);

  return (
    <View style={tw`w-full`}>
      {isLoading ? (
        <Loader />
      ) : (
        <TouchableHighlight onLongPress={() => setEdit(true)}>
          <View
            style={tw`bg-[#D8725B] pt-[2.5rem] px-[1rem] pb-[1rem] flex ${
              edit ? 'flex-col' : 'flex-row items-center justify-between'
            }`}
          >
            <View style={tw`flex flex-row items-center`}>
              {travel && (
                <TouchableOpacity onPress={handleChangeImage} disabled={!edit}>
                  {coverImage ? (
                    <Image
                      source={{ uri: coverImage }}
                      alt="photo"
                      style={tw`w-[2.5rem] h-[2.5rem] rounded-[.5rem]`}
                    />
                  ) : (
                    <Image
                      source={require('../assets/favicon.png')}
                      alt="photo"
                      style={tw`w-[2.5rem] h-[2.5rem] rounded-[.5rem] border border-black`}
                    />
                  )}
                </TouchableOpacity>
              )}
              <TextInput
                value={title}
                onChangeText={(value) => setTitle(value)}
                editable={edit}
                style={tw`ml-[.5rem] ${
                  edit
                    ? 'my-[1rem] p-[.5rem] rounded-[.5rem] bg-[#D9D9D9] text-black w-[60%] text-[1.5rem]'
                    : 'text-[#073040] text-[2rem]'
                }`}
              />
            </View>
            <View style={tw`flex flex-col items-center `}>
              <View
                style={tw`flex flex-row items-center ${edit ? 'w-full' : ''}`}
              >
                <Text
                  style={tw`text-[#F2DDC2] font-bold pr-[.5rem] text-[.875rem]`}
                >
                  DU
                </Text>
                {edit ? (
                  <InputDate
                    value={departureDate}
                    setValue={setDepartureDate}
                    size="normal"
                  />
                ) : (
                  <Text style={tw`text-[#073040] text-[1rem]`}>
                    {departureDate}
                  </Text>
                )}
              </View>
              <View
                style={tw`flex flex-row items-center ${edit ? 'w-full' : ''}`}
              >
                <Text
                  style={tw`text-[#F2DDC2] font-bold pr-[.5rem] text-[.875rem]`}
                >
                  AU
                </Text>
                {edit ? (
                  <InputDate
                    value={returnDate}
                    setValue={setReturnDate}
                    size="normal"
                  />
                ) : (
                  <Text style={tw`text-[#073040] text-[1rem]`}>{returnDate}</Text>
                )}
              </View>
            </View>
            {edit && (
              <View style={tw`w-full flex items-end`}>
                <TouchableOpacity
                  onPress={handleChange}
                  style={tw`py-[.3rem] px-[.5rem] bg-[#073040] rounded-[.5rem] mt-[.5rem]`}
                >
                  <FontAwesome name="check" size={24} color="#F2DDC2" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableHighlight>
      )}
      <View
        style={tw`flex flex-row items-center justify-between px-[.5rem] pt-[.5rem] w-full`}
      >
        <TouchableOpacity
          style={tw`w-[48%] p-[.5rem] flex items-center rounded-[.5rem] ${
            isDairyActive
              ? 'bg-transparent border border-[#073040]'
              : 'bg-[#073040]'
          }`}
          onPress={() => setIsDairyActive(false)}
        >
          <Text
            style={tw`${isDairyActive ? 'text-[#073040]' : 'text-[#F2DDC2]'}`}
          >
            Programme
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`w-[48%] p-[.5rem] flex items-center rounded-[.5rem] ${
            isDairyActive
              ? 'bg-[#073040]'
              : 'bg-transparent border border-[#073040]'
          }`}
          onPress={() => setIsDairyActive(true)}
        >
          <Text
            style={tw`${isDairyActive ? 'text-[#F2DDC2]' : 'text-[#073040]'}`}
          >
            Carnet de voyage
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
