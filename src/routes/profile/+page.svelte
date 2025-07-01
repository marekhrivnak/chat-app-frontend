<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';

  let username: string = '';
  let email: string = '';
  let profileImage: string | null = null;
  let fileInput: HTMLInputElement | null = null;
  let token: string | null = null;

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
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || 'User';
      email = payload.email || '';
    } catch {
      username = 'User';
      email = '';
    }
    await fetchProfileImage();
  });

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && username && token) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        // Save to backend
        await fetch(`http://localhost:8080/api/users/${username}/profile-image`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ profileImage: imageData })
        });
        profileImage = imageData;
      };
      reader.readAsDataURL(file);
    }
  }

  async function removeProfileImage() {
    if (username && token) {
      await fetch(`http://localhost:8080/api/users/${username}/profile-image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profileImage: null })
      });
      profileImage = null;
    }
  }

  function triggerFileInput() {
    fileInput?.click();
  }

  function goToProfile() {
    goto('/profile');
  }
  function logout() {
    localStorage.removeItem('token');
    goto('/login');
  }

  function goHome() {
    goto('/');
  }
</script>

<Header {username} {profileImage} onProfile={goToProfile} onLogout={logout} on:home={goHome} />

<div class="profile-container">
  <div class="profile-card">
    <div class="avatar-wrapper" on:click={triggerFileInput} tabindex="0" aria-label="Change profile picture">
      <img
        class="avatar"
        src={profileImage || `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`}
        alt="avatar"
      />
      <div class="avatar-overlay">
        <svg class="camera-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-7h-1.17l-.58-1.55A2 2 0 0 0 16.35 7h-1.7a2 2 0 0 0-1.9 1.45L12.17 10H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Zm-8 7a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
      </div>
      <input type="file" accept="image/*" bind:this={fileInput} on:change={handleFileChange} class="file-input" />
    </div>
    <h2>{username}</h2>
    <p class="email">{email}</p>
    {#if profileImage}
      <button class="remove-btn" on:click={removeProfileImage}>Remove image</button>
    {/if}
  </div>
</div>

<style>
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: #f4f6fb;
  }
  .profile-card {
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    padding: 2.5rem 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    min-width: 320px;
  }
  .avatar-wrapper {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    transition: box-shadow 0.2s, transform 0.2s;
    box-shadow: 0 2px 8px rgba(124,58,237,0.10);
    border: 2.5px solid #ece9f7;
    margin-bottom: 0.5rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    background: #fff;
  }
  .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(60, 60, 60, 0.18);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.18s;
    pointer-events: none;
  }
  .avatar-wrapper:hover .avatar-overlay,
  .avatar-wrapper:focus .avatar-overlay {
    opacity: 1;
    pointer-events: auto;
  }
  .avatar-wrapper:hover,
  .avatar-wrapper:focus {
    box-shadow: 0 4px 16px rgba(124,58,237,0.18);
    transform: scale(1.045);
  }
  .camera-icon {
    width: 32px;
    height: 32px;
    opacity: 0.92;
    filter: drop-shadow(0 1px 2px rgba(60,60,60,0.12));
  }
  .file-input {
    display: none;
  }
  h2 {
    margin: 0;
    color: #7c3aed;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .email {
    margin: 0;
    color: #6366f1;
    font-size: 1.1rem;
    font-weight: 500;
    word-break: break-all;
  }
  .remove-btn {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 0.98rem;
    cursor: pointer;
    text-decoration: underline;
    margin-top: 0.2rem;
  }
  .remove-btn:hover {
    color: #b91c1c;
  }
</style> 