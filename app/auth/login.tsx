import "@/global.css";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const params = useLocalSearchParams();
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [firstTimeDone, setFirstTimeDone] = useState(false); // Track if first-time password setup is done

  useEffect(() => {
    if (params.fromRegister === "true" && params.username) {
      setUsernameInput(params.username as string);
      setIsSettingPassword(true);
    }
  }, [params]);

  const handleUsernameChange = (text: string) => {
    if (/^\d+$/.test(text)) {
      if (text.length <= 5) setUsernameInput(text);
    } else {
      if (text.length <= 20) setUsernameInput(text);
    }
  };

  const handleLogin = () => {
    if (isSettingPassword && !firstTimeDone) {
      // First-time setup: check password and confirm
      const trimmedPassword = password.trim();
      const trimmedConfirm = confirmPassword.trim();

      if (!trimmedPassword || !trimmedConfirm) {
        alert("Please fill in both password fields!");
        return;
      }

      if (trimmedPassword !== trimmedConfirm) {
        alert("Passwords don't match!");
        return;
      }

      // Save credentials here (replace with API call)
      console.log("Account created:", { username: usernameInput, password: trimmedPassword });

      // Hide confirm password for next step
      setFirstTimeDone(true);
      setPassword(""); // Clear password to re-enter assigned password
      setConfirmPassword("");
      alert("Password set! Please enter your password to continue.");
    } else {
      // Regular login
      if (!password.trim()) {
        alert("Please enter your password!");
        return;
      }

      console.log("Logging in:", { username: usernameInput, password });
      // Replace with actual login logic/API call
      router.replace("/(tabs)/home");
    }
  };

  const goToRegister = () => {
    router.push("/auth/register");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Text className="text-3xl font-bold text-gray-800 mb-8">
        {isSettingPassword && !firstTimeDone
          ? "Set Your Password"
          : "Welcome Back 👋"}
      </Text>

      <TextInput
        className="w-full p-4 border border-gray-300 rounded-lg mb-4"
        placeholder="Username/RSBSA (3 digits)"
        keyboardType="default"
        value={usernameInput}
        onChangeText={handleUsernameChange}
        editable={!isSettingPassword} // username fixed after registration
      />

      <TextInput
        className="w-full p-4 border border-gray-300 rounded-lg mb-6"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isSettingPassword && !firstTimeDone && (
        <TextInput
          className="w-full p-4 border border-gray-300 rounded-lg mb-6"
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}

      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-bold text-lg">
          {isSettingPassword && !firstTimeDone ? "Create Password" : "Login"}
        </Text>
      </TouchableOpacity>

      {!isSettingPassword && (
        <TouchableOpacity onPress={goToRegister}>
          <Text className="text-blue-500">
            Don't have an account? <Text className="font-bold">Register</Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
