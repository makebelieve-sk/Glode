import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal, TouchableHighlight, Alert } from 'react-native';

import { ModalForm } from './modal-form';

export const AddLamp = () => {
    const [ modalVisible, setModalVisible ] = useState<boolean>(false);
    const [ showForm, setShowForm ] = useState<boolean>(false); 

    return (
        <View style={styles.mainWrapper}>
            <TouchableOpacity onPress={() => {
                setModalVisible(true);
            }} style={styles.buttonTextMore}>
                <Text style={styles.textAddMore}>ДОБАВИТЬ ЛАМПУ</Text>
            </TouchableOpacity>

            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>                                
                        { showForm ? 
                            <ModalForm showForm={showForm} setShowForm={setShowForm} setModalVisible={setModalVisible} /> : 

                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>ПРАВИЛЬНАЯ СЕТЬ LAMPA?</Text> 

                                <View style={styles.flexButtons}>
                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                        onPress={() => setShowForm(!showForm)}
                                    >
                                        <Text style={styles.textStyle}>ДА</Text>
                                    </TouchableHighlight>

                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={styles.textStyle}>НЕТ</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        }
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        width: `90%`,
        flex: 1,
    },
    buttonTextMore: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        backgroundColor: `#fff`,
        borderRadius: 50
    },
    textAddMore: {
        fontFamily: 'merri-weather-bold',
        fontWeight: `bold`,
        fontSize: 20,
        padding: 10,
        paddingBottom: 20,
        paddingTop: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        alignItems: `center`,
        width: `40%`
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        fontFamily: 'merri-weather-bold'
    },
    flexButtons: {
        flexDirection: `row`,
        width: `80%`,
        justifyContent: `space-evenly`
    },
    textStyle: {
        fontFamily: 'merri-weather-bold',
        fontSize: 20,
    }
});