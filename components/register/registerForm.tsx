import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { UserPlus, Save } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import RegisterSuccess from "./RegisterSuccess"; // Use the renamed dialog

interface RegisterFormProps {
  rsbsa: string;
  firstName: string;
  setFirstName: (val: string) => void;
  middleName: string;
  setMiddleName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  fullName: string;
  area: string;
  setArea: (val: string) => void;
  selectedCrop: string;
  setSelectedCrop: (val: string) => void;
  crops: { cropId: string; cropName: string }[];
  cropsLoading: boolean;
  selectedBarangay: string;
  setSelectedBarangay: (val: string) => void;
  barangays: { barangayId: string; barangayName: string }[];
  barangaysLoading: boolean;
  contact: string;
  setContact: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  generatedId?: string;
  error?: string;
  isLoading: boolean;
  handleRegister: () => void;
  handleBack: () => void;
  showSuccessDialog: boolean;
  handleSuccessDialogClose: () => void;
}

export default function RegisterForm({
  rsbsa,
  firstName,
  setFirstName,
  middleName,
  setMiddleName,
  lastName,
  setLastName,
  fullName,
  area,
  setArea,
  selectedCrop,
  setSelectedCrop,
  crops,
  cropsLoading,
  selectedBarangay,
  setSelectedBarangay,
  barangays,
  barangaysLoading,
  contact,
  setContact,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  generatedId,
  error,
  isLoading,
  handleRegister,
  handleBack,
  showSuccessDialog,
  handleSuccessDialogClose,
}: RegisterFormProps) {
  return (
    <>
      {/* Header */}
      <View className="items-center mt-24 mb-8">
        <View className="items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <UserPlus size={32} color="#16A34A" />
        </View>
        <Text className="text-2xl font-heading text-gray-800 mb-2">
          Register New Farmer
        </Text>
        <Text className="text-gray-600 font-body font-bold text-center">
          Complete your registration to access the RSBSA system
        </Text>
      </View>
      <View className="bg-card rounded-2xl p-8 shadow-xl ">
        {/* --- FORM START --- */}
        <View className="space-y-4">
          {/* RSBSA Display */}
          <View>
            <Text className="text-sm font-body font-bold text-black mb-2">
              RSBSA Code
            </Text>
            <View className="bg-card px-4 py-3 rounded-lg border border-button">
              <Text className="font-mono text-lg text-center tracking-wider">
                {generatedId || rsbsa}
              </Text>
            </View>
          </View>

          {/* Name Fields */}
          <View className="flex-row gap-4 mt-4">
            <View className="flex-1">
              <Text className="text-sm font-body font-bold text-gray-700 mb-2">
                First Name *
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Juan"
                placeholderTextColor="#9ca3af"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                autoCapitalize="words"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-body font-bold text-gray-700 mb-2">
                Middle Name
              </Text>
              <TextInput
                value={middleName}
                onChangeText={setMiddleName}
                placeholder="Santos"
                placeholderTextColor="#9ca3af"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                autoCapitalize="words"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-body font-bold text-gray-700 mb-2">
                Last Name *
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Cruz"
                placeholderTextColor="#9ca3af"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Full Name Display */}
          {fullName ? (
            <View>
              <Text className="text-sm font-body font-bold text-gray-700 mb-2">
                Full Name (Auto-generated)
              </Text>
              <View className="bg-gray-50 px-4 py-3 rounded-lg border">
                <Text className="text-gray-700">{fullName}</Text>
              </View>
            </View>
          ) : null}

          {/* Area Field */}
          <View className="mt-4">
            <Text className="text-sm font-body font-bold text-gray-700 mb-2">
              Farm Area (hectares) *
            </Text>
            <TextInput
              value={area}
              onChangeText={(text) => {
                // allow numbers with max 2 decimal places
                const numeric = text
                  .replace(/[^0-9.]/g, "") // remove non-numeric except "."
                  .replace(/(\..*?)\..*/g, "$1") // prevent more than one "."
                  .replace(/(\.\d{2})\d+/g, "$1"); // limit to 2 decimals
                setArea(numeric);
              }}
              placeholder="1.5"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </View>

          {/* Crop Picker */}
          <View className="mt-4">
            <Text className="text-sm font-body font-bold text-gray-700 mb-2">
              Primary Crop *
            </Text>
            <View className="border border-gray-300 rounded-lg bg-card">
              <Picker
                selectedValue={selectedCrop}
                onValueChange={setSelectedCrop}
                enabled={!cropsLoading}
              >
                <Picker.Item label="Select a crop" value="" />
                {crops.map((crop) => (
                  <Picker.Item
                    key={crop.cropId}
                    label={
                      crop.cropName.charAt(0).toUpperCase() +
                      crop.cropName.slice(1).toLowerCase()
                    }
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
          <View className="mt-4 bg-card">
            <Text className="text-sm font-body font-bold text-gray-700 mb-2">
              Barangay *
            </Text>
            <View className="border border-gray-300 rounded-lg bg-card">
              <Picker
                selectedValue={selectedBarangay}
                onValueChange={(itemValue) => setSelectedBarangay(itemValue)}
              >
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
          <View className="mt-4">
            <Text className="text-sm font-body font-bold text-gray-700 mb-2">
              Contact Number *
            </Text>
            <TextInput
              value={contact}
              onChangeText={setContact}
              placeholder="09123456789"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </View>

          {/* Password Fields */}
          <View className="flex-row gap-4 mt-4">
            <View className="flex-1">
              <Text className="text-sm font-body font-bold text-gray-700 mb-2">
                Password *
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-body font-bold text-gray-700 mb-2">
                Confirm Password *
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </View>
          </View>

          {/* Generated ID */}
          {generatedId ? (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <Text className="text-sm font-body font-bold text-green-800 mb-2">
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
            <View className="bg-error rounded-lg p-3">
              <Text className="text-error text-sm">{error}</Text>
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
            className=" bg-button p-4 rounded-lg flex-row items-center justify-center mt-4 gap-2"
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
                <Text className="text-white font-heading font-bold ml-2">
                  Register Farmer
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center justify-center p-4 rounded-lg mt-4 bg-back"
          >
            <Text className="text-sm text-white">Back to RSBSA Entry</Text>
          </TouchableOpacity>

          {/* Required Fields Note */}
          <View className="items-center mt-4 flex justify-center">
            <Text className="text-xs text-error">
              Fields marked with * are required
            </Text>
          </View>
        </View>
      </View>

      {/* Success Dialog */}
      <RegisterSuccess
        visible={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        title="Registration Successful!"
        message="Your farmer account has been created successfully. You can now login with your Farmer ID."
        farmerId={generatedId}
        buttonText="Continue to Login"
      />
    </>
  );
}
