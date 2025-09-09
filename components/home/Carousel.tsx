import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(screenWidth - 32); // Account for padding
  const scrollViewRef = useRef<ScrollView | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const carouselImages = [
    {
      id: 1,
      source: require("@/assets/images/Pulay.jpg"),
      title: "Rice Field Management",
      description: "Monitor your crops with AI-powered pest detection",
    },
    {
      id: 2,
      source: require("@/assets/images/Pulay.jpg"),
      title: "Smart Agriculture",
      description: "Advanced farming techniques for better yields",
    },
    {
      id: 3,
      source: require("@/assets/images/Pulay.jpg"),
      title: "Crop Protection",
      description: "Early pest detection saves your harvest",
    },
  ];

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % carouselImages.length;
        goToSlide(nextIndex);
        return nextIndex;
      });
    }, 10000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: containerWidth * index,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    stopAutoSlide();
    const newIndex =
      currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
    startAutoSlide();
  };

  const goToNext = () => {
    stopAutoSlide();
    const newIndex = (currentIndex + 1) % carouselImages.length;
    goToSlide(newIndex);
    startAutoSlide();
  };

  const handleScroll = (event: any) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / containerWidth
    );
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const handleContainerLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const handleDotPress = (index: number) => {
    stopAutoSlide();
    goToSlide(index);
    startAutoSlide();
  };

  return (
    <View className="relative" onLayout={handleContainerLayout}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        decelerationRate="fast"
        snapToInterval={containerWidth}
        snapToAlignment="start"
        style={{ width: "100%", height: 200, borderRadius: 20 }}
      >
        {carouselImages.map((item) => (
          <View
            key={item.id}
            style={{ width: containerWidth, height: 200, position: "relative" }}
          >
            <Image
              source={item.source}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: 20,
              }}
            />
            <View
              style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 2,
                }}
              >
                {item.title}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Arrows */}
      <TouchableOpacity
        onPress={goToPrevious}
        style={{
          position: "absolute",
          left: 10,
          top: 100,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 25,
          padding: 8,
        }}
      >
        <ChevronLeft size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={goToNext}
        style={{
          position: "absolute",
          right: 10,
          top: 100,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 25,
          padding: 8,
        }}
      >
        <ChevronRight size={20} color="white" />
      </TouchableOpacity>

      {/* Pagination Dots */}
      <View
        style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}
      >
        {carouselImages.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDotPress(index)}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              marginHorizontal: 4,
              backgroundColor: index === currentIndex ? "#B6EC80" : "#ffffff",
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default Carousel;
