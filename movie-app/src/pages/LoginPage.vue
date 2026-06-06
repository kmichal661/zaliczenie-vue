<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const router = useRouter();

const email = ref("");
const password = ref("");

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        userId
        email
        firstName
        lastName
      }
    }
  }
`;

const { mutate: login, loading, error } = useMutation(LOGIN_MUTATION);

const handleLogin = async () => {
  try {
    const res = await login({
      email: email.value,
      password: password.value,
    });

    const token = res?.data?.login?.token;

    console.log("LOGIN RESPONSE:", res);
    console.log("TOKEN:", token);

    if (!token) return;

    localStorage.setItem("token", token);
    const userId = res?.data?.login?.user?.userId;
    if (userId) localStorage.setItem("userId", userId);

    // notify other parts of the app about login (Navbar listens for this)
    window.dispatchEvent(new Event("auth-change"));

    await router.push("/"); // IMPORTANT: await navigation

    // Optionally reload to ensure Apollo auth header picks up the token
    // window.location.reload();
  } catch (err) {
    console.error("Login error:", err);
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent class="space-y-4">
        <Input v-model="email" placeholder="Email" />
        <Input v-model="password" type="password" placeholder="Password" />

        <Button class="w-full" @click="handleLogin" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </Button>

        <p class="text-sm text-center">
          Don't have an account?
          <a
            class="text-blue-600 underline cursor-pointer"
            @click.prevent="router.push('/register')"
            >Create one</a
          >
        </p>

        <p v-if="error" class="text-red-500 text-sm">Invalid credentials</p>
      </CardContent>
    </Card>
  </div>
</template>
