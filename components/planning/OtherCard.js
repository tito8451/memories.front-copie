import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Input from '../Input';
import InputDate from '../InputDate';
import ButtonUD from '../ButtonUpdateDelete';
import InputHour from '../InputHour';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { formattedDate } from '../../utils/functions';
import { useDispatch } from 'react-redux';
import { deletePlanning, updatePlanning } from '../../reducers/planning';
import InputNumber from '../InputNumber';

//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';

export default function Other({ infos, travelId, setIsLoading }) {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(!infos._id);

  const [title, setTitle] = useState(infos.title || '');
  const [activityDate, setActivityDate] = useState(
    infos.date ? formattedDate(infos.date) : ''
  );
  const [activityHour, setActivityHour] = useState(infos.hour || '');
  const [notes, setNotes] = useState(infos.comments || '');
  const [price, setPrice] = useState(infos.price ? infos.price.toString() : '0');

  const sendInfos = (infosToSend) => {
    setIsLoading(true);

    let route = infos._id
      ? `updateOther?travelId=${travelId}&otherId=${infos._id}`
      : `newOther?travelId=${travelId}`;
    let method = infos._id ? 'PUT' : 'POST';

    fetch(`${API_KEY}/other/${route}`, {
      method: method,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: infosToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setIsEditing(false);
          dispatch(
            updatePlanning({ category: 'others', updatedData: data.other })
          );
          setIsLoading(false);
        }
      });
  };

  const handleValidation = () => {
    const formData = new FormData();

    if (title !== infos.title) {
      formData.append('title', title);
    }

    if (activityDate !== infos.date) {
      formData.append('date', activityDate);
    }

    if (activityHour !== infos.hour) {
      formData.append('hour', activityHour);
    }

    if (notes !== infos.comments) {
      formData.append('comments', notes);
    }

    if (price !== infos.price) {
      formData.append('price', parseFloat(price));
    }

    sendInfos(formData);
  };

  const handleUpdate = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    setIsLoading(true);

    fetch(
      `${API_KEY}/other/deleteOther?travelId=${travelId}&otherId=${infos._id}`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch(deletePlanning({ category: 'others', idToDelete: infos._id }));
        setIsLoading(false);
      });
  };

  return (
    <View style={tw`w-[90%] m-auto bg-[#f7ebda] rounded-[.625rem] p-2 mt-3`}>
      <View style={tw`flex flex-row mb-3 items-center justify-between`}>
        {isEditing ? (
          <Input
            size="small"
            style={[tw`font-bold text-[1rem] p-2`, { color: '#073040' }]}
            placeholder="Nom de l'activité"
            value={title}
            setValue={setTitle}
          />
        ) : (
          <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>
            {title}
          </Text>
        )}
        {isEditing ? (
          <View style={tw`flex items-end`}>
            <TouchableOpacity
              style={tw`bg-[#073040] flex items-center py-[.3rem] px-[.5rem] rounded-[.5rem]`}
              onPress={handleValidation}
            >
              <FontAwesome name="check" size={16} color="#F2DCC2" />
            </TouchableOpacity>
          </View>
        ) : (
          <ButtonUD
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            isEditing={isEditing}
          />
        )}
      </View>
      <View style={tw`flex-row ${
            isEditing ? 'justify-around items-start' : 'pl-[.5rem] items-center'
          }`}>
          {isEditing ? (
            <>
              <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>Date</Text>
              <InputDate
                size="small"
                placeholder="Date"
                value={activityDate}
                setValue={setActivityDate}
              />
            </>
          ) : (
            <>
              <FontAwesome name="calendar" size={16} color="#D8725B" />
              <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>
                {activityDate}
              </Text>
            </>
          )}
      </View>

      <View style={tw`flex-row ${
            isEditing ? 'justify-around items-start' : 'pl-[.5rem] items-center'
          }`}>
          {isEditing ? (
            <>
              <Text style={[tw`text-[1rem] p-2 font-bold`, { color: '#073040' }]}>Heure</Text>
              <InputHour value={activityHour} setValue={setActivityHour} />
            </>
          ) : (
            <>
              <FontAwesome name="hourglass" size={16} color="#D8725B" />
              <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>
              {activityHour}
            </Text>
            </>
          )}
      </View>
      <View
          style={tw`flex-row ${
            isEditing ? 'justify-around items-start' : 'pl-[.5rem] items-center'
          }`}
        >
          {!isEditing && (
            <FontAwesome name="comment" size={16} color="#D8725B" />
          )}
          <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>
            Notes
          </Text>
          {isEditing ? (
            <Input
              size="small"
              placeholder="Commentaire"
              value={notes}
              setValue={setNotes}
              multiline
            />
          ) : (
            <Text style={[tw`text-[0.9rem] p-2`, { color: '#073040' }]}>
              {notes}
            </Text>
          )}
        </View>
        <View style={tw`w-full flex flex-row items-center justify-end ${isEditing ? 'pr-4' : ''}`}>
          <View style={tw`w-[40%] flex-row items-center`}>
            {!isEditing && (
              <FontAwesome name="tag" size={16} color="#D8725B" style={tw`mb-2`} />
            )}
            <Text style={[tw`text-[1rem] px-2 pb-2 font-bold`, { color: '#073040' }]}>Prix</Text>
            <InputNumber value={price} setValue={setPrice} isEditing={isEditing} />
          </View>
        </View>
    </View>
  );
}
