import React , { useState }  from 'react';
import './login.css';
import logo from '../assets/logo.svg';
import api from '../services/api';

export default function Login({history}) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await api.post('/devs', {
            username
        });

        const { _id } = response.data;

        history.push(`/dev/${_id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="TinDev" />
                <input type="text"
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Digite seu login do GitHub"
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

