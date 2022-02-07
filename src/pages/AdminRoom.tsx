// import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import deleteImg from '../assets/images/delete.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
// import { useAuth } from '../hooks/useAuth';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  // const [newQuestion, setNewQuestion] = useState('');
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const history = useHistory();

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom(roomId: string) {
    if (window.confirm('Tem certeza que deseja encerrar esta sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        closedAt: new Date(),
      });
      history.push(`/`);
    }
  }
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            <RoomCode code={params.id} />
            <Button onClick={() => handleEndRoom(roomId)} isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length === 0 && (<span>0 pergunta(s)</span>)}
          {questions.length > 0 && (<span>{questions.length} pergunta(s)</span>)}
        </div>

        <div className="question-list">
          {questions.length === 0 && (<span>Não há perguntas ainda</span>)}
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button 
                  type="button" 
                  onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}