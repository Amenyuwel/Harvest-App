import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { UserPlus, ArrowLeft, Save } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { useRegister } from "../../hooks/useRegister";

export default function RegisterScreen() {
  const {
    rsbsa,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    fullName,
    selectedCrop,
    setSelectedCrop,
    area,
    setArea,
    selectedBarangay,
    setSelectedBarangay,
    contact,
    setContact,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    generatedId,
    crops,
    cropsLoading,
    barangays,
    barangaysLoading,
    handleRegister,
    handleBack,
  } = useRegister();

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <View className="max-w-2xl w-full self-center">
        <View className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center gap-2 mb-6"
          >
            <ArrowLeft size={20} color="#4B5563" />
            <Text className="text-sm text-gray-600">Back to RSBSA Entry</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-8">
            <View className="items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <UserPlus size={32} color="#16A34A" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Register New Farmer
            </Text>
            <Text className="text-gray-600 text-center">
              Complete your registration to access the RSBSA system
            </Text>
          </View>

          {/* Registration Form */}
          <View className="space-y-6">
            {/* RSBSA Display */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                RSBSA Code
              </Text>
              <View className="bg-gray-50 px-4 py-3 rounded-lg border">
                <Text className="font-mono text-lg text-center tracking-wider">
                  {rsbsa}
                </Text>
              </View>
            </View>

            {/* Name Fields */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Juan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  autoCapitalize="words"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </Text>
                <TextInput
                  value={middleName}
                  onChangeText={setMiddleName}
                  placeholder="Santos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  autoCapitalize="words"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Cruz"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Full Name Display */}
            {fullName ? (
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Full Name (Auto-generated)
                </Text>
                <View className="bg-gray-50 px-4 py-3 rounded-lg border">
                  <Text className="text-gray-700">{fullName}</Text>
                </View>
              </View>
            ) : null}

            {/* Area Field */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Farm Area (hectares) *
              </Text>
              <TextInput
                value={area}
                onChangeText={setArea}
                placeholder="1.5"
                keyboardType="decimal-pad"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </View>

            {/* Crop Picker */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Primary Crop *
              </Text>
              <View className="border border-gray-300 rounded-lg bg-white">
                <Picker
                  selectedValue={selectedCrop}
                  onValueChange={setSelectedCrop}
                  enabled={!cropsLoading}
                >
                  <Picker.Item label="Select a crop" value="" />
                  {crops.map((crop) => (
                    <Picker.Item
                      key={crop.cropId}
                      label={crop.cropName}
                      value={crop.cropId}
                    />
                  ))}
                </Picker>
              </View>
              {cropsLoading ? (
                <Text className="text-gray-400 mt-2">Loading...</Text>
              ) : null}
            </View>

            {/* Barangay Picker */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Barangay *
              </Text>
              <View className="border border-gray-300 rounded-lg bg-white">
                <Picker
                  selectedValue={selectedBarangay}
                  onValueChange={setSelectedBarangay}
                  enabled={!barangaysLoading}
                >
                  <Picker.Item label="Select a barangay" value="" />
                  {barangays.map((b) => (
                    <Picker.Item
                      key={b.barangayId}
                      label={b.barangayName}
                      value={b.barangayId}
                    />
                  ))}
                </Picker>
              </View>
              {barangaysLoading ? (
                <Text className="text-gray-400 mt-2">Loading...</Text>
              ) : null}
            </View>

            {/* Contact Field */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </Text>
              <TextInput
                value={contact}
                onChangeText={setContact}
                placeholder="09123456789"
                keyboardType="phone-pad"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </View>

            {/* Password Fields */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Password *
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </View>
            </View>

            {/* Generated ID */}
            {generatedId ? (
              <View className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Text className="text-sm font-medium text-green-800 mb-2">
                  Your Generated Farmer ID
                </Text>
                <View className="bg-white px-4 py-3 rounded-lg border border-green-300">
                  <Text className="font-mono text-lg text-center text-green-700 font-semibold tracking-wider">
                    {generatedId}
                  </Text>
                </View>
                <Text className="text-xs text-green-600 mt-2">
                  This ID will be used for your account identification
                </Text>
              </View>
            ) : null}

            {/* Error */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="text-red-700 text-sm">{error}</Text>
              </View>
            ) : null}

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={
                isLoading ||
                !firstName ||
                !lastName ||
                !selectedCrop ||
                !selectedBarangay ||
                !area ||
                !contact ||
                !password ||
                !confirmPassword
              }
              className="w-full bg-green-600 py-3 px-4 rounded-lg flex-row items-center justify-center gap-2"
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#fff" />
                  <Text className="text-white ml-2">Registering...</Text>
                </>
              ) : (
                <>
                  <Save size={20} color="#fff" />
                  <Text className="text-white font-medium ml-2">
                    Register Farmer
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Required Fields Note */}
            <View className="items-center">
              <Text className="text-xs text-gray-500">
                Fields marked with * are required
              </Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Text className="text-sm font-medium text-blue-800 mb-2">
            Registration Information
          </Text>
          <Text className="text-xs text-blue-700 mb-2">
            Your farmer ID follows the format: 126303-[Barangay ID]-[Your RSBSA]
          </Text>
          <Text className="text-xs text-blue-700">
            After registration, you can log in using your RSBSA code and the
            password provided by your local agricultural office.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
