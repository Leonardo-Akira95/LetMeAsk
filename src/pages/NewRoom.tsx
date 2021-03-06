

import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Components
import { Button } from '../components/Button';

// Assets 
import '../styles/auth.scss';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
// Services
import { database } from '../services/firebase';

// Hooks
import { useAuth } from '../hooks/useAuth';

export function NewRoom(){
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    if (newRoom.trim() === ''){
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    });

    console.log(firebaseRoom);

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input type="text" placeholder="Digite o código da sala" onChange={event => setNewRoom(event.target.value)} value={newRoom} />
            <Button type="submit">
              Criar sala
            </Button>
            <p>
              Quer entrar em uma sala existente? <Link to="/#">Clique aqui</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}