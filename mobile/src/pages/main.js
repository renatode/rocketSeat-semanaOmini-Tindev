import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { View, SafeAreaView, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import api from '../services/api'

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsAMatch from '../assets/itsamatch.png';
import Swipeable from 'react-native-gesture-handler/Swipeable';


export default function Main({ navigation }) {
    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]);
    const [devMatch, setdevMatch] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: { user:  id }
            });
            setUsers(response.data);
        }
        loadUsers();
    }, [id]);

    useEffect(() => {
        const socket = io('http://10.0.26.161:3333', {
            query: { user: id }
        });

        socket.on('match', dev => {
            setdevMatch(dev);
        })
    }, [id]);

    async function handleLike () {
        const [userToLike, ... usersList] = users;

        api.post(`/devs/${userToLike._id}/likes`, null, {
            headers: { user: id }
        });

        setUsers(usersList);
    }

    async function handleDisLike () {
        const [userToLike, ... usersList] = users;

        api.post(`/devs/${userToLike._id}/dislikes`, null, {
            headers: { user: id }
        });

        setUsers(usersList);
    }

    async function handleLogout () {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={style.container}>
            <TouchableOpacity onPress={handleLogout} >
                <Image style={style.logo} source={logo} />
            </TouchableOpacity>
            <View style={style.cardsContainer}>
                { users.length === 0 ? 
                    (
                        <Text style={style.empty}>Acabou :(</Text>
                    ) 
                    :
                    (
                        users.map((user, index) => (
                            <View key={user._id} style={[style.card, { zIndex: users.length - index }]}>
                                <Image source={ { uri: user.avatar } } style={style.avatar} /> 
                                <View style={style.footer}>
                                    <Text style={style.name}>{ user.name }</Text>
                                    <Text style={style.bio} numberOfLines={3}> {user.bio} </Text>
                                </View>
                            </View>
                        ))
                    )
                }
            </View>

            { users.length > 0 && (
                <View style={style.buttonsContainer}>
                    <TouchableOpacity style={style.button} onPress={handleDisLike}>
                        <Image source={dislike} />
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button} onPress={handleLike}>
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            ) }

            { devMatch && (
                <View style={style.matchContainer}>
                    <Image style={style.matchImage} source={itsAMatch} />
                    <Image style={style.matchAvatar} source={{ uri: devMatch.avatar }}  />
                    <Text style={style.matchName} > {devMatch.name} </Text>
                    <Text style={style.matchBio} > {devMatch.bio} </Text>

                    <TouchableOpacity onPress={ () => setdevMatch(null) }>
                        <Text style={style.matchClose} > FECHAR </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logo: {
        marginTop: 30   
    },
    empty:{
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500
    },
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    avatar: {
        flex: 1,
        height: 300
    },
    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        zIndex: 8999
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    matchContainer:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9990
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30,
        zIndex: 9991
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain'
    },
    matchName: {
       fontSize: 26,
       fontWeight: 'bold' ,
       color: '#FFF',
       zIndex: 9992
    },
    matchBio: {
        marginTop: 10,
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },
    matchClose:{
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }
});