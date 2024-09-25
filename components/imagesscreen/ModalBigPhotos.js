import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, Text, Modal } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ModalBigPhotos({ showModal, setShowModal, photo}) {
  return (
    <Modal transparent={true} animationType="slide" visible={showModal}>
        <View
            style={tw`bg-opacity-50 bg-black h-full w-full flex items-center justify-center`}
        >
            <View
            style={tw`rounded-[.5rem] p-[.5rem] flex flex-col w-[90%]`}
            >
                <TouchableOpacity style={tw`mb-[1rem] w-[1.5rem] bg-[#073040] flex items-center p-[.3rem] rounded-[.5rem]`} onPress={() => setShowModal(false)}>
                    <FontAwesome
                    name="times"
                    size={16}
                    color="#F2DCC2"
                    />
                </TouchableOpacity>
                <Image source={{ uri: photo }} style={tw`w-full h-[85%] rounded-[.5rem]`} resizeMode="cover" />
            </View>
        </View>
    </Modal>
  );
}