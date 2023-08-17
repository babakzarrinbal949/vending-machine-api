import React, { useState } from 'react';
import { loginUser } from '../api';
import 'bootstrap/dist/css/bootstrap.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = async () => {
        setError(false);
        try {
            if (username.trim() !== '' && password.trim() !== '') {
                const { token, balance } = await loginUser(username, password);
                localStorage.setItem('access-token', token);
                localStorage.setItem('balance', balance);
                window.location.href = '/';
            } else {
                throw new Error('Username or Password incorrect');
            }
        } catch (error) {
            console.error(error.message);
            setError(true);
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div className="container">
            <section className="vh-100 gradient-custom">
                <div className="container pb-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white">
                                <div className="card-body p-5 text-center">

                                    <div className="mb-md-5 mt-md-4 pb-5">
                                        {error &&
                                            (
                                                <p className="alert alert-danger">Username or password Incorrect</p>
                                            )
                                        }

                                        <h2 className="fw-bold mb-5 text-uppercase">Login</h2>

                                        <div className="form-outline form-white mb-4">
                                            <input type="text"
                                                   placeholder="Username"
                                                   onChange={handleUsernameChange}
                                                   value={username}
                                                   className="form-control form-control-lg"/>
                                        </div>

                                        <div className="form-outline form-white mb-4">
                                            <input type="password"
                                                   placeholder="Password"
                                                   onChange={handlePasswordChange}
                                                   value={password}
                                                   className="form-control form-control-lg"/>
                                        </div>

                                        <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot
                                            password?</a></p>

                                        <button onClick={handleLogin} className="btn btn-outline-light btn-lg px-5" type="submit">Login
                                        </button>

                                        <div className="d-flex justify-content-center text-center mt-4 pt-1">
                                            <a href="#!" className="text-white"><i
                                                className="fab fa-facebook-f fa-lg"></i></a>
                                            <a href="#!" className="text-white"><i
                                                className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                            <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                                        </div>

                                    </div>

                                    <div>
                                        <p className="mb-0">Don't have an account? <a href="#!"
                                                                                      className="text-white-50 fw-bold">Sign
                                            Up</a>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;
