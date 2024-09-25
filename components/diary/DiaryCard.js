import React, { useState, useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, TextInput, Text } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { updateDiary, deleteDiary } from '../../reducers/diary';
import * as ImagePicker from 'expo-image-picker';
import ModalPhotos from './ModalPhotos';
import Loader from '../loaders/Loader';
import ButtonUD from '../ButtonUpdateDelete';
//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';

export default function DiaryCard({ diary, travelId, setIsLoading }) {
  const dispatch = useDispatch();
  const textRef = useRef();
  const [textHeight, setTextHeight] = useState(0);

  const [edit, setEdit] = useState(
    diary.title === '' && diary.description === ''
  );
  
  const [showModal, setShowModal] = useState(false);

  const [editTitle, setEditTitle] = useState(diary.title);
  const [editContent, setEditContent] = useState(diary.description);
  const [editPhotos, setEditPhotos] = useState([]);

  const updateTextHeight = () => {
    if (textRef.current) {
      textRef.current.measure((fx, fy, width, height, px, py) => {
        setTextHeight(height);
      });
    }
  };

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
      setEditPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const showAllImage = () => {
    setShowModal(true);
  };

  const handleChangeImage = () => {
    if (diary.moment_pictures.length === 0 && editPhotos.length > 0) {
      return true;
    }

    if (diary.moment_pictures.length > 0) {
      for (let i = 0; i < editPhotos.length; i += 1) {
        if (
          !diary.moment_pictures[i] ||
          diary.moment_pictures[i] !== editPhotos[i]
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const updateInfos = (infos) => {
    setIsLoading(true);
    fetch(`${API_KEY}/diary/update?diaryId=${diary._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: infos,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(updateDiary(data.diary));
          setEdit(false);
          setIsLoading(false);
        }
      });
  };

  const handleChange = () => {
    const formData = new FormData();

    if (diary.title !== editTitle) {
      formData.append('title', editTitle);
    }

    if (diary.description !== editContent) {
      formData.append('description', editContent);
    }

    if (handleChangeImage()) {
      editPhotos.map((photoUrl) => {
        if (photoUrl.startsWith('file')) {
          formData.append('picture', {
            uri: photoUrl,
            type: 'image/jpeg',
            name: 'photo.jpg',
          });
        }
      });
    }

    updateInfos(formData);
  };

  const handleDelete = () => {
    setIsLoading(true);
    fetch(`${API_KEY}/diary/?travelId=${travelId}&diaryId=${diary._id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(deleteDiary(diary._id));
        setEdit(false);
        setIsLoading(false);
      });
  };

  const displayOthersPhotos = () => {
    if (editPhotos.length > 0) {
      const othersPhotos = [];

      for (let i = 1; i < editPhotos.length; i++) {
        othersPhotos.push(
          <View
            key={i}
            style={tw`flex items-center w-[50%] pt-[1rem] pr-[.5rem]`}
          >
            <Image
              source={{ uri: editPhotos[i] }}
              alt={`photo-${i}`}
              style={tw`rounded-[.5rem] w-full h-[8rem] mr-[.5rem]`}
            />
          </View>
        );
      }

      return othersPhotos;
    }
  };

  useEffect(() => {
    if (diary.moment_pictures.length > 0) {
      const array = [];
      diary.moment_pictures.map((picture) => {
        array.push(picture);
      });
      setEditPhotos(array);
      updateTextHeight();
    }
  }, [diary]);

  return (
    <View>
      <View style={tw`bg-white/40 rounded-[.5rem] w-full p-[.5rem] mb-[.5rem]`}>
        <View style={tw`flex flex-row items-center justify-between`}>
          <TextInput
            placeholder="Titre"
            onChangeText={(value) => setEditTitle(value)}
            style={tw`text-[1rem] text-black ${
              edit ? 'bg-white p-[.5rem] w-[80%]' : ''
            }`}
            editable={edit}
            value={editTitle}
          />
          {edit ? (
            <View style={tw`flex items-end mt-[.5rem]`}>
              <TouchableOpacity
                style={tw`bg-[#073040] flex items-center py-[.3rem] px-[.5rem] rounded-[.5rem]`}
                onPress={handleChange}
              >
                <FontAwesome name="check" size={16} color="#F2DCC2" />
              </TouchableOpacity>
            </View>
          ) : (
            <ButtonUD
              handleUpdate={() => setEdit(true)}
              handleDelete={handleDelete}
              isEditing={edit}
            />
          )}
        </View>
        {edit && (
          <View style={tw`w-full pt-[.5rem] flex flex-row items-center`}>
            {editPhotos.length < 3 && (
              <TouchableOpacity
                onPress={handleAddImage}
                style={tw`bg-white h-[8rem] w-[8rem] rounded-[.5rem] flex items-center justify-center`}
              >
                <FontAwesome name="image" size={98} style={tw`opacity-60`} />
                <FontAwesome
                  name="plus"
                  size={48}
                  style={tw`opacity-60 mr-[.5rem] absolute`}
                />
              </TouchableOpacity>
            )}
            {editPhotos.length > 0 && (
              <TouchableOpacity
                onPress={showAllImage}
                style={tw`h-[8rem] w-[8rem] rounded-[.5rem] ml-[.5rem] flex items-center justify-center`}
              >
                <Image
                  source={{ uri: editPhotos[editPhotos.length - 1] }}
                  style={tw`w-full h-full rounded-[.5rem]`}
                  resizeMode="cover"
                />
                {editPhotos.length > 1 && (
                  <View style={tw`flex flex-row absolute items-center`}>
                    <FontAwesome
                      name="plus"
                      size={32}
                      color="black"
                      style={tw`opacity-60 mr-[.5rem]`}
                    />
                    <Text
                      style={tw`text-black text-[2rem] opacity-60 font-bold`}
                    >
                      {editPhotos.length - 1}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={tw`flex flex-row w-full items-start pt-[.5rem]`}>
          {!edit && editPhotos.length > 0 && (
            <View
              style={[
                tw`w-[40%] rounded-[.5rem] min-h-[7rem]`,
                { height: textHeight },
              ]}
            >
              <Image
                source={{ uri: editPhotos[0] }}
                alt="photo"
                style={[
                  tw`w-full rounded-[.5rem] min-h-[7rem]`,
                  { height: textHeight },
                ]}
              />
            </View>
          )}
          <TextInput
            placeholder="Description"
            onChangeText={(value) => setEditContent(value)}
            multiline={true}
            editable={edit}
            ref={textRef}
            onLayout={updateTextHeight}
            style={tw`text-black ${
              edit
                ? 'h-[10rem] bg-white p-[.5rem] w-full'
                : `${editPhotos.length > 0 ? 'w-[60%] ml-[.5rem]' : 'w-full'}`
            }`}
            textAlignVertical={`${edit ? 'top' : 'middle'}`}
            value={editContent}
          />
        </View>
        {!edit && editPhotos && editPhotos.length > 1 && (
          <View style={tw`flex flex-row items-center w-full`}>
            {displayOthersPhotos()}
          </View>
        )}
      </View>
      <ModalPhotos
        showModal={showModal}
        setShowModal={setShowModal}
        editPhotos={editPhotos}
        setEditPhotos={setEditPhotos}
      />
    </View>
  );
}
