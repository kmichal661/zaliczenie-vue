<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const router = useRouter();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');

const REGISTER_MUTATION = gql`
  mutation Register($input: UserInput) {
    register(input: $input) {
      token
      user { userId email firstName lastName }
    }
  }
`;

const { mutate: registerMut, loading, error } = useMutation(REGISTER_MUTATION);

const handleRegister = async () => {
  if (!email.value || !password.value) {
    alert('Please provide email and password');
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match');
    return;
  }
  try {
    const res: any = await registerMut({ input: { email: email.value, password: password.value, firstName: firstName.value || null, lastName: lastName.value || null } });
    const token = res?.data?.register?.token;
    const userId = res?.data?.register?.user?.userId;
    if (!token) return;
    localStorage.setItem('token', token);
    if (userId) localStorage.setItem('userId', userId);
    window.dispatchEvent(new Event('auth-change'));
    await router.push('/');
  } catch (e) {
    console.error('Register error', e);
    alert('Registration failed');
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <Card class="w-[420px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>

      <CardContent class="space-y-4">
        <Input v-model="email" placeholder="Email" />
        <div class="flex gap-2">
          <Input v-model="firstName" placeholder="First name" />
          <Input v-model="lastName" placeholder="Last name" />
        </div>
        <Input v-model="password" type="password" placeholder="Password" />
        <Input v-model="confirmPassword" type="password" placeholder="Confirm password" />

        <Button class="w-full" @click="handleRegister" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Create account' }}
        </Button>

        <p class="text-sm text-center">
          Already have an account?
          <a class="text-blue-600 underline cursor-pointer" @click.prevent="router.push('/login')">Login</a>
        </p>

        <p v-if="error" class="text-red-500 text-sm">Registration failed</p>
      </CardContent>
    </Card>
  </div>
</template>