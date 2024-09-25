import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useSelector, useDispatch } from 'react-redux';
import { initAllImages } from '../reducers/allImages';
import ModalBigPhotos from '../components/imagesscreen/ModalBigPhotos';
import Loader from '../components/loaders/Loader';

const API_KEY='http://192.168.1.59:3000';

export default function ImagesScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const images = useSelector((state) => state.allImages.value);

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleShowImage = (photo) => {
    setPhoto(photo);
    setShowModal(!showModal);
  };

  useFocusEffect(
    useCallback(() => {
      const getImages = fetch(`${API_KEY}/allPictures`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setAvatarUrl(data.avatarUrl);
            dispatch(initAllImages(data.allImages));
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      return () => getImages;
    }, [])
  );

  return (
    <SafeAreaView style={tw`items-center bg-[#F2DDC2] flex-1 w-full h-full`}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Text style={tw`font-bold text-[1.5rem] m-3 text-[#073040]`}>
            Gallerie
          </Text>
          {images && images.length > 0 ? (
            <ScrollView style={tw`w-full h-full px-[.5rem]`}>
              <View style={tw`flex flex-row items-center w-full h-full flex-wrap`}>
                {images.map((image, index) => (
                  <TouchableOpacity key={index} style={styles.imageContainer} onPress={() => handleShowImage(image)}>
                    <Image source={{ uri: image }} style={styles.image} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={tw`items-center flex justify-center w-full h-full`}>
              <Text style={tw`text-[1.5rem]`}>Aucune image</Text>
            </View>
          )}
        </>
      )}
      <ModalBigPhotos showModal={showModal} setShowModal={setShowModal} photo={photo} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '50%',
    aspectRatio: 1,
    padding: 2,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});
