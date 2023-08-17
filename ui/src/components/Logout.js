import React from 'react';

const Logout = () => {
    localStorage.removeItem('access-token');

    return window.location.href = '/';
}

export default Logout;