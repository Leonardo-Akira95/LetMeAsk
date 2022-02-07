import { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import { Room } from '../components/Room';
import { database } from '../services/firebase';

import '../styles/list-room.scss';

type roomType = {
  id: string;
  roomName: string;
  authorId: string;
  closedAt: string | undefined;
  questionCount: number;
};

type FirebaseRooms = Record<string, {
  authorId: string;
  closedAt: string | undefined;
  title: string;
  questions: Record<string, {
    author: {
      avatar: string;
      name: string;
    }
    content: string;
    likes: Record<string, {
      authorId: string;
    }>
  }>
}>

export function ListRooms() {
  const [rooms, setRooms] = useState<roomType[]>([]);

  useEffect(() => {
    const roomsRef = database.ref('rooms');
    roomsRef.on('value', room => {
      const FirebaseRooms: FirebaseRooms = room.val();
      const parsedRooms = Object.entries(FirebaseRooms).map(([key, value]) => {
        return {
          id: key,
          roomName: value.title,
          closedAt: value.closedAt ?? '',
          authorId: value.authorId,
          questionCount: value.questions ? Object.entries(value.questions).length : 0
        }
      });

      setRooms(parsedRooms);
    }, (errorObject) => {
      console.log('Error: ' + errorObject.name);
    });

  }, []);

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <h1>Lista de salas</h1>
          <div className="list-rooms">
            {rooms.map((room) => {
              return (
                <Room
                  key={room.id}
                  roomId={room.id}
                  roomName={room.roomName}
                  questionsCount={room.questionCount}
                />
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}