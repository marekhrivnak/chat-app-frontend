<script lang="ts">
  export let rooms = [];
  export let selectedRoom = null;
  export let onSelectRoom: (room: any) => void;
  export let onCreateRoom: () => void;
  export let showCreateModal: boolean;
  export let setShowCreateModal: (v: boolean) => void;
  export let newRoomName: string;
  export let setNewRoomName: (v: string) => void;
  export let createRoomError: string;
  export let createRoom: () => void;
  export let loadingRooms: boolean;
</script>

<aside class="rooms-list">
  <div class="rooms-header">
    <h2>Rooms</h2>
    <button class="create-room-btn" on:click={() => setShowCreateModal(true)} title="Create Room">+</button>
  </div>
  {#if loadingRooms}
    <div class="spinner"></div>
  {:else}
    <ul>
      {#each rooms as room}
        <li class:selected={selectedRoom && selectedRoom.id === room.id} on:click={() => onSelectRoom(room)}>
          <span class="room-avatar">
            <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=room${room.id}`} alt="room avatar" />
          </span>
          <span>{room.name}</span>
        </li>
      {/each}
    </ul>
  {/if}
  {#if showCreateModal}
    <div class="modal-backdrop" on:click={() => setShowCreateModal(false)}></div>
    <div class="modal animate-in">
      <h3>Create New Room</h3>
      <form on:submit|preventDefault={createRoom}>
        <input type="text" bind:value={newRoomName} on:input={e => setNewRoomName(e.target.value)} placeholder="Room name" />
        <button type="submit">Create</button>
        <button type="button" class="cancel-btn" on:click={() => setShowCreateModal(false)}>Cancel</button>
        {#if createRoomError}
          <p class="error">{createRoomError}</p>
        {/if}
      </form>
    </div>
  {/if}
</aside>

<style>
  .rooms-list {
    background: #fff;
    padding: 2rem 1.5rem 2rem 1.5rem;
    border-radius: 1.2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    min-width: 270px;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    height: fit-content;
  }
  .rooms-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .rooms-header h2 {
    margin: 0;
    color: #7c3aed;
    font-size: 1.2rem;
    font-weight: 700;
  }
  .create-room-btn {
    width: 2.2rem;
    height: 2.2rem;
    background: linear-gradient(90deg, #6366f1 0%, #7c3aed 100%);
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(124,58,237,0.08);
  }
  .create-room-btn:hover {
    background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
    box-shadow: 0 4px 16px rgba(124,58,237,0.12);
  }
  .rooms-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .rooms-list li {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.7rem 1rem;
    border-radius: 0.7rem;
    background: #f3f4f6;
    cursor: pointer;
    font-size: 1.08rem;
    font-weight: 500;
    transition: background 0.2s, color 0.2s;
    border: 2px solid transparent;
    position: relative;
  }
  .rooms-list li.selected, .rooms-list li:hover {
    background: #e0e7ff;
    color: #7c3aed;
    border: 2px solid #7c3aed33;
  }
  .room-avatar img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #fff;
    border: 1.5px solid #ece9f7;
  }
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.2);
    z-index: 10;
    animation: fadeIn 0.2s;
  }
  .modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 2rem 2.5rem;
    border-radius: 1.2rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    z-index: 11;
    min-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    animation: popIn 0.25s cubic-bezier(.4,2,.6,1);
  }
  .modal h3 {
    margin: 0 0 0.5rem 0;
    color: #7c3aed;
    font-size: 1.2rem;
    text-align: center;
  }
  .modal input {
    padding: 0.7rem 1rem;
    border: 1.5px solid #d1d5db;
    border-radius: 2rem;
    font-size: 1rem;
    background: #f9fafb;
    transition: border 0.2s;
  }
  .modal input:focus {
    border: 1.5px solid #7c3aed;
    outline: none;
    background: #fff;
  }
  .modal button {
    padding: 0.7rem 0;
    background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
    color: #fff;
    border: none;
    border-radius: 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 0.5rem;
  }
  .modal button.cancel-btn {
    background: #e5e7eb;
    color: #333;
    margin-top: 0;
  }
  .modal button.cancel-btn:hover {
    background: #d1d5db;
  }
  .error {
    color: #e11d48;
    text-align: center;
    margin-top: 0.5rem;
    font-size: 1rem;
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