import { useState } from 'react';
import './App.css';
import ReactLoading from 'react-loading';
import { IoArrowBack } from "react-icons/io5";


const md5 = require('md5');

function App() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState('');
    const [status, setStatus] = useState(-1);

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true);
        var statuss = -1

        fetch(`http://localhost:9002/api/login?username=${event.target[0].value}&passwordHash=${md5(event.target[1].value)}`)
            .then(response => {
                statuss = response.status
                return response.json()
            })
            .then(data => {
                setLoading(false)
                setLoggedIn(true)
                setStatus(statuss)
                if (statuss != 200)
                    setInfo((data.error))
                else
                    setInfo(JSON.stringify(data, null, 2))
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setLoading(false);
                setLoggedIn(false);
            });
    }

    return (
        <div className="App">

            {loading ?
                <div className="box">
                    <ReactLoading type={'spinningBubbles'} color={'rgb(6, 46, 62)'} height={65} width={65} />
                </div>
                :
                loggedIn ?
                    <div className="box">
                        <div className="back" onClick={() => { setLoggedIn(false) }}>
                            <IoArrowBack size={35} />
                            <h2>Back</h2>
                        </div>
                        <div className={status==200?"info":"info err"}
                            style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                            {info}
                        </div>
                    </div>
                    :
                    <div className="box">
                        <h1>LOGIN</h1>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <label>Username</label>
                            <input autoComplete='off' name="username" type="text" />
                            <label>Password</label>
                            <input autoComplete='off' name="password" type="password" />
                            <button type="submit">Sign In</button>
                        </form>
                    </div>
            }

        </div>
    );
}

export default App;
