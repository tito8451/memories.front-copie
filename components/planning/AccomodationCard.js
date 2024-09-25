import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Input from '../Input';
import InputDate from '../InputDate';
import ButtonUD from '../ButtonUpdateDelete';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { formattedDate } from '../../utils/functions';
import { useDispatch } from 'react-redux';
import { deletePlanning, updatePlanning } from '../../reducers/planning';
import InputNumber from '../InputNumber';
//import {API_KEY} from '@env';

const API_KEY = 'http://192.168.1.59:3000';

export default function Accomodation({ infos, travelId, setIsLoading }) {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(!infos._id);

  const [hotelName, setHotelName] = useState(infos.hotelName || '');
  const [address, setAddress] = useState(infos.address || '');
  const [checkInDate, setCheckInDate] = useState(
    infos.checkInDate ? formattedDate(infos.checkInDate) : ''
  );
  const [checkOutDate, setCheckOutDate] = useState(
    infos.checkOutDate ? formattedDate(infos.checkOutDate) : ''
  );
  const [notes, setNotes] = useState(infos.comments || '');
  const [price, setPrice] = useState(infos.price ? infos.price.toString() : '0');

  const sendInfos = (infosToSend) => {
    setIsLoading(true);

    let route = infos._id
      ? `update?travelId=${travelId}&accommodationId=${infos._id}`
      : `newAccomodation?_id=${travelId}`;
    let method = infos._id ? 'PUT' : 'POST';

    fetch(`${API_KEY}/accomodation/${route}`, {
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
            updatePlanning({
              category: 'accommodations',
              updatedData: data.accommodation,
            })
          );
          setIsLoading(false);
        }
      });
  };

  const handleValidation = () => {
    const formData = new FormData();

    if (hotelName !== infos.hotelName) {
      formData.append('hotelName', hotelName);
    }

    if (address !== infos.address) {
      formData.append('address', address);
    }

    if (checkInDate !== infos.checkInDate) {
      formData.append('checkInDate', checkInDate);
    }

    if (checkOutDate !== infos.checkOutDate) {
      formData.append('checkOutDate', checkOutDate);
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
      `${API_KEY}/accomodation/deleteAccommodation?travelId=${travelId}&accommodationId=${infos._id}`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(
          deletePlanning({ category: 'accommodations', idToDelete: infos._id })
        );
        setIsLoading(false);
      });
  };

  return (
    <View style={tw`w-[90%] m-auto bg-[#f7ebda] rounded-[.625rem] p-2 mt-3`}>
      <View style={tw`flex-row mb-3 items-center justify-between`}>
        <Text style={[tw`font-bold text-[1rem] p-2`, { color: '#073040' }]}>
          Logement
        </Text>
        {isEditing ? (
          <View style={tw`flex items-end mt-[.5rem]`}>
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

      <View>
        {isEditing ? (
          <>
            <View style={tw`flex-row justify-between items-start`}>
              <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>Du</Text>
                <InputDate
                  size="small"
                  placeholder="Arrivée"
                  value={checkInDate}
                  setValue={setCheckInDate}
                />
          </View>

          <View style={tw`flex-row justify-between items-start`}>
            <Text style={[tw`text-[1rem] p-2 font-bold`, { color: '#073040' }]}>Au</Text>
              <InputDate
                size="small"
                placeholder="Départ"
                value={checkOutDate}
                setValue={setCheckOutDate}
              />
          </View>
          </>
        ) : (
          <View style={tw`w-full flex flex-row items-center pl-[.5rem]`}>
            <FontAwesome name="calendar" size={16} color="#D8725B" />
            <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>
                  {checkInDate}
            </Text>
            <Text style={tw`text-[0.9rem] text-[#073040]`}>-</Text>
            <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>
                {checkOutDate}
              </Text>
          </View>
        )}
        <View
          style={tw`flex-row ${
            isEditing ? 'justify-around items-start' : 'pl-[.5rem] items-center'
          }`}
        >
          {!isEditing && (
            <FontAwesome name="hotel" size={16} color="#D8725B" />
          )}
          <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>
            Hôtel
          </Text>
          {isEditing ? (
            <Input
              size="small"
              placeholder="Nom de l'hôtel"
              value={hotelName}
              setValue={setHotelName}
            />
          ) : (
            <Text style={[tw`text-[0.9rem] p-2`, { color: '#073040' }]}>
              {hotelName}
            </Text>
          )}
        </View>
        <View
          style={tw`flex-row ${
            isEditing ? 'justify-around items-start' : 'pl-[.5rem] items-center'
          }`}
        >
          {!isEditing && (
            <FontAwesome name="map-marker" size={16} color="#D8725B" />
          )}
          <Text style={[tw`text-[0.9rem] p-2 font-bold`, { color: '#073040' }]}>
            Adresse
          </Text>
          {isEditing ? (
            <Input
              size="small"
              placeholder="Adresse du logement"
              value={address}
              setValue={setAddress}
            />
          ) : (
            <Text style={[tw`text-[0.9rem] p-2`, { color: '#073040' }]}>
              {address}
            </Text>
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
    </View>
  );
}
