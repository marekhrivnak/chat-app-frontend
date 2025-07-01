<script lang="ts">
  import type { Room, Message } from '../types';
  import { afterUpdate } from 'svelte';
  import { onMount } from 'svelte';
  export let selectedRoom: Room | null = null;
  export let messages: Message[] = [];
  export let loadingMessages: boolean = false;
  export let newMessage: string = '';
  export let setNewMessage: (v: string) => void;
  export let sendMessage: () => void;
  export let username: string;

  let prevRoomId: number | null = null;
  let token: string | null = null;
  let userImages: Record<string, string | null> = {};

  onMount(() => {
    token = localStorage.getItem('token');
  });

  // Fetch and cache profile images for all unique senders
  $: {
    const uniqueSenders = Array.from(new Set(messages.map(m => m.sender)));
    uniqueSenders.forEach(async (sender) => {
      if (userImages[sender] === undefined && token) {
        try {
          const res = await fetch(`http://localhost:8080/api/users/${sender}/profile-image`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            userImages[sender] = data.profileImage || null;
          } else {
            userImages[sender] = null;
          }
        } catch {
          userImages[sender] = null;
        }
      }
    });
  }

  afterUpdate(() => {
    if (selectedRoom && selectedRoom.id !== prevRoomId && !loadingMessages) {
      const el = document.querySelector('.messages');
      if (el) el.scrollTop = el.scrollHeight;
      prevRoomId = selectedRoom.id;
    }
  });
</script>

<section class="chat-section">
  {#if !selectedRoom}
    <div class="empty-chat">
      <h2>Welcome 👋</h2>
      <p>Select a room or create a new one to start chatting.</p>
    </div>
  {:else}
    <div class="chat-container">
      <div class="chat-header">
        <h2>{selectedRoom.name}</h2>
      </div>
      <div class="messages">
        {#if loadingMessages}
          <div class="spinner"></div>
        {:else}
          {#each messages as msg, i (msg.id || msg.content + msg.timestamp + i)}
            <div class="message {msg.sender === username ? 'me' : ''}">
              <div class="msg-meta">
                <img src={userImages[msg.sender] || `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.sender}`} alt="avatar" class="msg-avatar" />
                <span class="msg-user">{msg.sender}</span>
                <span class="msg-time">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
              </div>
              <div class="msg-bubble">{msg.content}</div>
            </div>
          {/each}
        {/if}
      </div>
      <form class="send-form" on:submit|preventDefault={sendMessage}>
        <input type="text" bind:value={newMessage} on:input={(e: Event) => setNewMessage((e.target as HTMLInputElement)?.value)} placeholder="Type a message..." autocomplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>
  {/if}
</section>

<style>
  .chat-section {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    padding: 2rem 2.5rem;
    min-height: 500px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
  .empty-chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #7c3aed;
    gap: 0.7rem;
    opacity: 0.8;
  }
  .chat-container {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    height: 100%;
    min-height: 400px;
  }
  .chat-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .chat-header h2 {
    margin: 0;
    color: #7c3aed;
    font-size: 1.2rem;
    font-weight: 700;
  }
  .messages {
    min-height: 200px;
    max-height: 320px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    background: #f9fafb;
    border-radius: 0.7rem;
    padding: 1rem;
    scroll-behavior: smooth;
    transition: background 0.2s;
  }
  .message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
    margin-bottom: 0.2rem;
    animation: fadeIn 0.3s;
  }
  .message.me {
    align-items: flex-end;
  }
  .msg-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: #7c3aed;
    margin-bottom: 0.1rem;
  }
  .msg-avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: #fff;
    border: 1.5px solid #ece9f7;
  }
  .msg-user {
    font-weight: 600;
    color: #6366f1;
  }
  .msg-time {
    font-size: 0.85rem;
    color: #a1a1aa;
    margin-left: 0.3rem;
  }
  .msg-bubble {
    background: #ece9f7;
    color: #333;
    padding: 0.7rem 1.1rem;
    border-radius: 1.2rem 1.2rem 1.2rem 0.4rem;
    font-size: 1.08rem;
    max-width: 80vw;
    min-width: 2.5rem;
    word-break: break-word;
    box-shadow: 0 2px 8px rgba(124,58,237,0.04);
    transition: background 0.2s;
  }
  .message.me .msg-bubble {
    background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
    color: #fff;
    border-radius: 1.2rem 1.2rem 0.4rem 1.2rem;
    align-self: flex-end;
  }
  .send-form {
    display: flex;
    gap: 0.7rem;
    margin-top: 0.5rem;
    align-items: center;
  }
  .send-form input {
    flex: 1;
    padding: 0.7rem 1rem;
    border: 1.5px solid #d1d5db;
    border-radius: 2rem;
    font-size: 1rem;
    background: #f9fafb;
    transition: border 0.2s;
    outline: none;
  }
  .send-form input:focus {
    border: 1.5px solid #7c3aed;
    background: #fff;
  }
  .send-form button {
    padding: 0.7rem 1.5rem;
    background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
    color: #fff;
    border: none;
    border-radius: 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 2px 8px rgba(124,58,237,0.08);
  }
  .send-form button:hover {
    background: linear-gradient(90deg, #6366f1 0%, #7c3aed 100%);
  }
  .spinner {
    margin: 2rem auto;
    border: 4px solid #ece9f7;
    border-top: 4px solid #7c3aed;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    animation: spin 1s linear infinite;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.8) translate(-50%, -50%); }
    100% { opacity: 1; transform: scale(1) translate(-50%, -50%); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style> 