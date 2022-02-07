import { FormEvent } from "react";
import { useHistory } from "react-router-dom";
import { database } from "../services/firebase";

type RoomProps = {
  roomId: string;
  roomName: string;
  questionsCount: number;
};

export function Room({ roomId, roomName, questionsCount }: RoomProps) {

  const history = useHistory();

  async function handleJoinRoom(event: FormEvent, roomId : string) {
    event.preventDefault();

    if (roomId.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomId}`).get();
    
    if (!roomRef.exists()) {
      alert('Room does not exist!');
      return;
    }

    if (roomRef.val().closedAt) {
      alert('Room already closed');
      return;
    }

    history.push(`/rooms/${roomId}`);
  }

  return (
    <div className="room" key={roomId} onClick={event => handleJoinRoom(event, roomId)}>
      <div className="room-info">
        <p><b>Sala: </b>{roomName}</p>
        <p>{questionsCount} sugestões</p>
      </div>
    </div>
  )
}