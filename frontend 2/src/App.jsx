// App.js

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import { Provider } from "@/components/ui/provider"

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarBg = useColorModeValue(
    scrolled
      ? "rgba(255, 255, 255, 0.8)"
      : "linear-gradient(to right, #667eea, #764ba2)",
    "rgba(0, 0, 0, 0.8)"
  );

  return (
    <Box>
      {/* Navbar */}
      <Flex
        as="nav"
        position="fixed"
        top="0"
        width="100%"
        py={4}
        px={8}
        alignItems="center"
        boxShadow={scrolled ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none"}
        bg={navbarBg}
        backdropFilter="blur(10px)"
        zIndex="999"
      >
        <Breadcrumb spacing="8px" separator="›" color="white">
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Features</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex ml="auto" alignItems="center">
          <Link href="/signup" color="white" mx="4">
            Sign Up
          </Link>
          <Link href="/signin" color="white">
            Sign In
          </Link>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Flex mt="100px" px="8" py="4">
        <Box w="20%" p="4" bg="gray.100" borderRadius="md">
          <Flex direction="column" align="flex-start">
            <Link mb="4" fontSize="lg" fontWeight="bold">
              Sign Language Detector
            </Link>
            <Link mb="4" fontSize="lg" fontWeight="bold">
              Chat Bot Assistance
            </Link>
            <Link mb="4" fontSize="lg" fontWeight="bold">
              Multimedia
            </Link>
            <Link mb="4" fontSize="lg" fontWeight="bold">
              Accessibility
            </Link>
            <Link mb="4" fontSize="lg" fontWeight="bold">
              Jobs & Schemes
            </Link>
          </Flex>
        </Box>
        <Box w="80%" p="4" ml="4" bg="white" boxShadow="md" borderRadius="md">
          {/* Main Content */}
          <Flex justifyContent="center" alignItems="center" h="100%">
            <Box w="60%" h="300px" bg="purple.50" borderRadius="lg" boxShadow="xl" />
          </Flex>
        </Box>
      </Flex>

      {/* Chatbot Icon */}
      <motion.div
        style={{
          position: "fixed",
          bottom: "20px",
          
          zIndex: "1000",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <IconButton
          aria-label="Chatbot"
          icon={<FaRobot />}
          size="lg"
          colorScheme="purple"
          borderRadius="full"
          boxShadow="lg"
        />
      </motion.div>
    </Box>
  );
}

export default App;
