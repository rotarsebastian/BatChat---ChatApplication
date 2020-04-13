const express = require('express');
const router = express.Router();
const { getCurrentRooms, isRoomNameAvailable, getMoreRooms, getFirstRooms, getTouchedRoom } = require('../utils/rooms');
const Room = require('../models/Room');

router.post('/', (req, res) => {
    const { roomName, username } = req.body;

    Room.findOne({ name: roomName }).collation({ locale: 'en', strength: 2 })
    .then(room => {
        if(room) return res.send({ status: 0, message: 'Room already existing!', code: 115 });

        const newRoom = new Room({
            name: roomName,
            users: [],
            messages: [],
        });

        // Save room
        newRoom.save()
            .then(async(room) => { 
                const rooms = await getCurrentRooms();
                globalVersion++;
                touchedRoom = { ...room._doc, isNew: '1816b4f4-666a-432b-b4eb-96be70e886c1' };
                return res.send({ status: 1, message: `SUCCESS: Room ${room.name} is now created!`, rooms, code: 200 });
            })
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/morerooms/:skip', (req, res) => {
    const { skip } = req.params;
    getMoreRooms(parseInt(skip, 10), rooms => {
        if(rooms) res.send({ status: 1, rooms });
    });
});

router.get('/available/:roomName', (req, res) => {
    const { roomName } = req.params;
    const foundRoom = isRoomNameAvailable(decodeURIComponent(roomName));
    if(foundRoom === -1) res.status(200).json({ status: 1, isAvailable: 1});
        else res.status(200).json({ status: 0, isAvailable: 0});
});

// #####################################
router.get('/sse', (req, res) => {
    let localVersion = 0;
    res.set('Content-Type', 'text/event-stream');
    res.set('Connection', 'keep-alive');
    res.set('Cache-Control', 'no-cache');
    res.set('Access-Control-Allow-Origin', '*');
    console.log('Client connected to SSE!');
    setInterval(async() => {
        res.status(200).write('data: 0' + '\n\n');
        if(localVersion < globalVersion) {
            const data = await getCurrentRooms();
            let roomToModify = null;
            let isNew = false;
            if(!touchedRoom.hasOwnProperty('isNew')) roomToModify = getTouchedRoom(touchedRoom);
                else {
                    isNew = true;
                    roomToModify = touchedRoom;
                }
            res.status(200).write(`data: ${JSON.stringify(data)}||${JSON.stringify({ touchedRoom: roomToModify })}||${JSON.stringify({ isNew })}` + '\n\n');
            localVersion = globalVersion;
        }
    }, 1000);

    res.on('close', () => {
        if (!res.finished) {
            console.log("SSE is now CLOSED");
        }
    });
});

module.exports = router;