import request from 'request-promise';

export const createRoom = async(roomName, username) => {
    
    try {
        const options = {
            method: 'POST',
            uri: 'http://127.0.0.1:9000/rooms',
            body: { roomName, username },
            json: true 
        };
        const response = await request(options);
        return response;
    }
    catch(err) {
        return console.log('Server under maintanence!', err);
    }
};

export const isRoomNameAvailable = async(roomName) => {
    try {
        const options = {
            method: 'GET',
            uri: `http://127.0.0.1:9000/rooms/available/${encodeURIComponent(roomName)}`,
            json: true 
        };
        const response = await request(options);
        return response;
    }
    catch(err) {
        return console.log('Server under maintanence!', err);
    }
};

export const getMoreRooms = async(skip) => {
    try {
        const options = {
            method: 'GET',
            uri: `http://127.0.0.1:9000/rooms/morerooms/${skip}`,
            json: true 
        };
        const response = await request(options);
        return response;
    }
    catch(err) {
        return console.log('Server under maintanence!', err);
    }
};

export const deleteRoom = async(room, token) => {
    try {
        const options = {
            method: 'POST',
            uri: 'http://127.0.0.1:9000/rooms/delete',
            body: { room, token },
            json: true 
        };
        const response = await request(options);
        return response;
    }
    catch(err) {
        return console.log('Server under maintanence!', err);
    }
};

