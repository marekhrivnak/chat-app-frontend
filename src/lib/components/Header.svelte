<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let username: string;
  export let profileImage: string | null = null;
  export let onProfile: () => void;
  export let onLogout: () => void;

  type HeaderEvents = {
    home: void;
  };

  const dispatch = createEventDispatcher<HeaderEvents>();
  function goHome() {
    dispatch('home');
  }
</script>

<header class="header">
  <div class="logo" on:click={goHome} tabindex="0" title="Go to home">💬 Chat App</div>
  <div class="header-actions">
    <div class="user-info" on:click={onProfile} title="Go to profile">
      <img src={profileImage || `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`} alt="avatar" class="avatar" />
      <span class="username">{username}</span>
    </div>
    <button class="logout-btn" on:click={onLogout}>Logout</button>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 2rem;
    background: #fff;
    color: #7c3aed;
    box-shadow: 0 2px 8px rgba(124,58,237,0.06);
    border-bottom: 1px solid #ece9f7;
  }
  .logo {
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #7c3aed;
    cursor: pointer;
    outline: none;
    transition: background 0.2s;
    border-radius: 0.5rem;
    padding: 0.2rem 0.7rem;
  }
  .logo:hover, .logo:focus {
    background: #f3f4f6;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    padding: 0.3rem 0.7rem;
    border-radius: 2rem;
    transition: background 0.2s;
  }
  .user-info:hover {
    background: #f3f4f6;
  }
  .username {
    font-weight: 600;
    font-size: 1.1rem;
    color: #3a3a3a;
  }
  .avatar {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #ece9f7;
  }
  .logout-btn {
    padding: 0.6rem 1.2rem;
    background: #e11d48;
    color: #fff;
    border: none;
    border-radius: 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 2px 8px rgba(225,29,72,0.08);
  }
  .logout-btn:hover {
    background: #be123c;
  }
</style> 