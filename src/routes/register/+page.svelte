<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let email = '';
  let error = '';
  let success = '';

  function goToLogin() {
    goto('/login');
  }

  async function register() {
    error = '';
    success = '';
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      });
      if (res.ok) {
        success = 'Registration successful! Redirecting to login...';
        setTimeout(() => goto('/login'), 1500);
      } else {
        const data = await res.text();
        error = data || 'Registration failed.';
      }
    } catch (e) {
      error = 'Network error.';
    }
  }
</script>

<div class="container">
  <form class="card" on:submit|preventDefault={register}>
    <h1>Register</h1>
    <label>
      Username
      <input type="text" bind:value={username} required />
    </label>
    <label>
      Email
      <input type="email" bind:value={email} required />
    </label>
    <label>
      Password
      <input type="password" bind:value={password} required />
    </label>
    <button type="submit">Register</button>
    {#if error}
      <p class="error">{error}</p>
    {/if}
    {#if success}
      <p class="success">{success}</p>
    {/if}
    <button type="button" class="login-btn" on:click={goToLogin}>Back to Login</button>
  </form>
</div>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ece9f7 0%, #cfd9df 100%);
  }
  .card {
    background: #fff;
    padding: 2.5rem 2rem;
    border-radius: 1.2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    min-width: 320px;
    max-width: 90vw;
  }
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    text-align: center;
    color: #3a3a3a;
  }
  label {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    color: #555;
    gap: 0.3rem;
  }
  input {
    padding: 0.7rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    background: #f9fafb;
    transition: border 0.2s;
  }
  input:focus {
    border: 1.5px solid #7c3aed;
    outline: none;
    background: #fff;
  }
  button {
    margin-top: 0.5rem;
    padding: 0.8rem 0;
    background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 2px 8px rgba(124,58,237,0.08);
  }
  button:hover {
    background: linear-gradient(90deg, #6366f1 0%, #7c3aed 100%);
  }
  .error {
    color: #e11d48;
    text-align: center;
    margin-top: 0.5rem;
    font-size: 1rem;
  }
  .success {
    color: #059669;
    text-align: center;
    margin-top: 0.5rem;
    font-size: 1rem;
  }
  .login-btn {
    margin-top: 0.7rem;
    background: #fff;
    color: #7c3aed;
    border: 1.5px solid #7c3aed;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.7rem 0;
    transition: background 0.2s, color 0.2s;
  }
  .login-btn:hover {
    background: #7c3aed;
    color: #fff;
  }
</style> 