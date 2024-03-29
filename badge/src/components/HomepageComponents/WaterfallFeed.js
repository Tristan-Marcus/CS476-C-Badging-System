import React from "react"
import { useState } from "react";

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useCollectionData } from 'react-firebase-hooks/firestore'

import "./WaterfallFeed.css"

const auth = firebase.auth();
const firestore = firebase.firestore();

function WaterfallFeed() {
    return(
        <div class="waterfall-feed-container">
            <div class="feed-title">
                Reward Feed
            </div>
            <div class="feed-div">
                <ChatRoom />
            </div>
        </div>
    );
}

function ChatRoom() {
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, {idField: 'id'});
    const [formValue, setFormValue] = useState('');

    const sendMessage = async(e) => {
        e.preventDefault();
        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });
    }

    return (
        <>
            <div>
                {messages && messages.map(msg => <RewardMessage key={msg.id} message={msg} />)}
            </div>
            <form onSubmit={sendMessage}>

                <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
                <button class="send-button" type="submit">SEND</button>

            </form>
        </>
    );
}

function RewardMessage(props) {
    const{ text, uid, photoURL} = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
    
    return (
        <div classname={`message ${messageClass}`}>
            <img src={photoURL} />
            <p>
                {text}
            </p>
        </div>
    );
}

export default WaterfallFeed;