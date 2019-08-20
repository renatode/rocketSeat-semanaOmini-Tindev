import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import io from 'socket.io-client';

import './main.css'

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsAMatch from '../assets/itsamatch.png';

export default function Main({ match }){
    const [users, setUsers] = useState([]);
    const [devMatch, setdevMatch] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: { user:  match.params.id }
            });
            setUsers(response.data);
        }
        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', dev => {
            setdevMatch(dev);
        })
    }, [match.params.id]);

    async function handleLike (id) {
        api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id }
        });

        setUsers(users.filter(user => user._id !== id));

        console.log('like ==> ', id);
    }

    async function handleDisLike (id) {
        api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id }
        });

        setUsers(users.filter(user => user._id !== id));

        console.log('dislike ==> ', id);
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="TinDev" />
            </Link>
            
            { users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.avatar} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>
                                    {user.bio}
                                </p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleDisLike(user._id)}>
                                    <img src={dislike} alt="dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="like" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : 
            (
                <div className="empty">Acabou :(</div>
            )}

            { devMatch && (
                <div className="match-container">
                    <img src={itsAMatch} alt="It´s a Match!" />
                    <img className="avatar" src={devMatch.avatar} alt="Avatar" />
                    <strong> {devMatch.name} </strong>
                    <p> {devMatch.bio} </p>
                    <button type="button" onClick={ () => setdevMatch(null) } >FECHAR</button>
                </div>
            ) }
            
        </div>
    );
}