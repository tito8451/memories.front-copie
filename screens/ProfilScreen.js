import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import { useState } from 'react';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../components/Input';
import * as ImagePicker from 'expo-image-picker';

import { updateUser, deleteUser } from '../reducers/user';
import { API_KEY } from '@env';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [isEdit, setIsEdit] = useState(false);
  const [isSelect, setIsSelect] = useState(false);

  const [username, setUsername] = useState(user.account.username);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleUpdate = () => {
    const updatedData = {
      username,
      firstname,
      lastname,
      email,
      avatar,
    };
    fetch(`${API_KEY}/user/updateUser?token=${user.token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(updateUser(updatedData));
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des données :', error);
      });
    setIsEdit(!isEdit);
  };

  const handleChooseImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission d'accès à la galerie requise");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.uri);
    }
  };

  // check box for delete account
  const handleSelect = () => {
    setIsSelect(!isSelect);
  };

  const handleDelete = () => {
    if (!isSelect) {
      alert('Veuillez cocher la case pour supprimer votre compte');
    } else {
      fetch(`${API_KEY}/user/deleteUser?token=${user.token}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            navigation.navigate('Login');
            dispatch(deleteUser());
          } else {
            alert("Échec de la suppression de l'utilisateur.");
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la suppression de l'utilisateur :",
            error
          );
        });
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`w-full h-full bg-[#D8725B] pt-[4rem] flex items-center`}
    >
      <View style={tw`w-full flex flex-col items-center`}>
        <View>
          {isEdit ? (
            avatar ? (
              <TouchableOpacity
                onPress={() => handleChooseImage()}
                style={tw`h-28 w-24 p-[0.25rem] items-center rounded-full`}
              >
                <Image
                  source={{ uri: avatar }}
                  style={tw`w-24 h-28 rounded-full overflow-hidden`}
                />
                <View
                  style={tw`absolute w-25 h-30 rounded-full overflow-hidden bg-[#073040]/70 items-center justify-center`}
                >
                  <FontAwesome name="edit" size={40} style={tw`text-white`} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleChooseImage()}
                style={tw`p-[2rem] bg-white/60 rounded-full flex items-center`}
              >
                <FontAwesome name="user" size={48} />
              </TouchableOpacity>
            )
          ) : avatar ? (
            <View style={tw`h-28 w-24 p-[0.25rem] items-center rounded-full`}>
              <Image
                source={{ uri: avatar }}
                style={tw`w-24 h-28 rounded-full overflow-hidden`}
              />
            </View>
          ) : (
            <View
              style={tw`p-[2rem] bg-white/60 rounded-full flex items-center`}
            >
              <FontAwesome name="user" size={48} />
            </View>
          )}
        </View>

        <TouchableOpacity style={tw`w-[70%] flex items-center`}>
          <TextInput
            style={tw`${
              isEdit ? 'border-b-2 border-[#e49c8c]' : 'font-bold'
            } my-[1rem] text-white text-[1rem]`}
            value={username}
            editable={isEdit}
            onChangeText={(value) => setUsername(value)}
          />
        </TouchableOpacity>
      </View>

      <View style={tw`w-full flex items-center flex-col`}>
        <Text style={tw`text-[1.3rem] text-white mb-[1rem]`}>
          Mes informations personnelles
        </Text>
        <View style={tw`w-[90%] flex flex-col items-center`}>
          {isEdit ? (
            <Input
              value={firstname}
              setValue={setFirstname}
              placeholder="Prénom"
              size="normal"
            />
          ) : (
            <Text
              style={[
                tw`w-[80%] h-2.5rem bg-[#e49c8c] text-black rounded-[.625rem] pl-[.5rem] mb-[.6rem] text-[0.9rem] p-2`,
                { color: '#073040' },
                { textAlignVertical: 'center' },
              ]}
            >
              {firstname}
            </Text>
          )}

          {isEdit ? (
            <Input
              value={lastname}
              setValue={setLastname}
              placeholder="Nom de famille"
              size="normal"
            />
          ) : (
            <Text
              style={[
                tw`w-[80%] h-2.5rem bg-[#e49c8c] text-black rounded-[.625rem] pl-[.5rem] mb-[.6rem] text-[0.9rem] p-2`,
                { color: '#073040' },
                { textAlignVertical: 'center' },
              ]}
            >
              {lastname}
            </Text>
          )}

          {isEdit ? (
            <Input
              value={email}
              setValue={setEmail}
              placeholder="Email"
              size="normal"
            />
          ) : (
            <Text
              style={[
                tw`w-[80%] h-2.5rem bg-[#e49c8c] text-black rounded-[.625rem] pl-[.5rem] mb-[.6rem] text-[0.9rem] p-2`,
                { color: '#073040' },
                { textAlignVertical: 'center' },
              ]}
            >
              {email}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => handleUpdate()}
          style={tw`w-[80%] flex flex-row items-center justify-center bg-[#073040] text-white rounded-[.625rem] p-[.625rem]`}
        >
          <FontAwesome
            name={isEdit ? 'check' : 'edit'}
            size={24}
            style={tw`text-white mr-4`}
          />
          <Text style={tw`text-white`}>{isEdit ? 'Valider' : 'Modifier'}</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`mt-[2rem] w-full flex items-center flex-col`}>
        <Text style={tw`text-[1.3rem] text-white mb-[1rem]`}>
          Supprimer mon compte
        </Text>
        <View
          style={tw`flex flex-row items-center justify-between w-full px-[1rem] mb-[1rem]`}
        >
          <TouchableOpacity
            onPress={() => handleSelect()}
            style={tw`flex items-center justify-center m-auto ${
              isSelect ? 'bg-[#073040] text-white' : 'bg-[#D9D9D9] w-8 h-8'
            } rounded-[.625rem] p-2`}
          >
            <FontAwesome
              name={isSelect ? 'check' : ''}
              size={16}
              style={tw`${isSelect ? 'text-white' : ''}`}
            />
          </TouchableOpacity>

          <Text style={tw`w-[85%] text-justify`}>
            Je confirme vouloir supprimer mon compte. Cette action est
            irréversible. Toutes les données transmises seront supprimées de nos
            serveurs.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete()}
          style={tw`w-[80%] flex items-center bg-[#D9D9D9] rounded-[.625rem] p-[.625rem]`}
        >
          <Text style={tw`text-black`}>Confirmer la suppression du compte</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
