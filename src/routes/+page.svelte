<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Room, Message } from '$lib/types';
  import { Client } from '@stomp/stompjs';
  import SockJS from 'sockjs-client';
  import Header from '$lib/components/Header.svelte';
  import RoomsList from '$lib/components/RoomsList.svelte';
  import ChatSection from '$lib/components/ChatSection.svelte';

  let token: string | null = null;
  let username: string;
  let rooms: Room[] = [];
  let selectedRoom: Room | null = null;
  let messages: Message[] = [];
  let newMessage = '';
  let showCreateModal = false;
  let newRoomName = '';
  let createRoomError = '';
  let loadingRooms = true;
  let loadingMessages = false;
  let stompClient: Client | null = null;
  let profileImage: string | null = null;

  const ROOMS_API = 'http://localhost:8080/api/rooms';
  const MESSAGES_API = 'http://localhost:8080/api/messages';
  const WS_URL = 'http://localhost:8080/ws';

  async function fetchProfileImage() {
    if (!username || !token) return;
    try {
      const res = await fetch(`http://localhost:8080/api/users/${username}/profile-image`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        profileImage = data.profileImage || null;
      } else {
        profileImage = null;
      }
    } catch {
      profileImage = null;
    }
  }

  onMount(async () => {
    token = localStorage.getItem('token');
    if (!token) {
      goto('/login');
      return;
    }
    // Decode JWT to get username (simple base64 decode, not secure for prod)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || 'User';
    } catch {
      username = 'User';
    }
    // Fetch rooms from backend
    try {
      const res = await fetch(ROOMS_API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        rooms = await res.json();
      }
    } catch (e) {
      console.error(e);
    } finally {
      loadingRooms = false;
    }
    await fetchProfileImage();
    connectWebSocket();
  });

  function connectWebSocket() {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient?.subscribe('/topic/public', (message) => {
          const msg = JSON.parse(message.body);
          if (selectedRoom && msg.roomId === selectedRoom.id) {
            messages = [...messages, msg];
            setTimeout(() => {
              const el = document.querySelector('.messages');
              if (el) el.scrollTop = el.scrollHeight;
            }, 50);
          }
        });
      }
    });
    stompClient.activate();
  }

  function selectRoom(room: Room) {
    selectedRoom = room;
  }

  async function fetchMessages() {
    loadingMessages = true;
    try {
      const res = await fetch(`${MESSAGES_API}?roomId=${selectedRoom?.id}` , {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        messages = await res.json();
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      loadingMessages = false;
    }
  }

  $: if (selectedRoom) fetchMessages();

  function sendMessage() {
    if (newMessage.trim() && selectedRoom && stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({ sender: username, content: newMessage, roomId: selectedRoom.id })
      });
      newMessage = '';
    }
  }

  function goToProfile() {
    goto('/profile');
  }

  function logout() {
    localStorage.removeItem('token');
    goto('/login');
  }

  async function createRoom() {
    createRoomError = '';
    if (!newRoomName.trim()) {
      createRoomError = 'Room name is required';
      return;
    }
    try {
      const res = await fetch(ROOMS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: newRoomName })
      });
      if (res.ok) {
        const room = await res.json();
        rooms = [...rooms, room];
        showCreateModal = false;
        newRoomName = '';
      } else {
        createRoomError = await res.text();
      }
    } catch (e) {
      createRoomError = 'Network error.';
    }
  }

  function goHome() {
    goto('/');
  }
</script>

{#if token}
  <Header {username} {profileImage} onProfile={goToProfile} onLogout={logout} on:home={goHome} />
  <main class="main">
    <div class="content">
      <RoomsList
        {rooms}
        {selectedRoom}
        onSelectRoom={selectRoom}
        onCreateRoom={createRoom}
        {showCreateModal}
        setShowCreateModal={v => showCreateModal = v}
        {newRoomName}
        setNewRoomName={v => newRoomName = v}
        {createRoomError}
        {createRoom}
        {loadingRooms}
      />
      <ChatSection
        {selectedRoom}
        {messages}
        {loadingMessages}
        {newMessage}
        setNewMessage={v => newMessage = v}
        {sendMessage}
        {username}
      />
    </div>
  </main>
{/if}

<style>
  :global(body) {
    font-family: 'Inter', system-ui, sans-serif;
    background: #f4f6fb;
    margin: 0;
    padding: 0;
  }
  .main {
    min-height: 90vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: #f4f6fb;
    padding: 0;
  }
  .content {
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: 2rem auto;
    gap: 2rem;
    flex: 1;
  }
</style>
