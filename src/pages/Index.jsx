import { useState, useEffect } from "react";
import { Box, Button, Container, Flex, Heading, Image, Input, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import { FaSearch, FaArrowUp, FaArrowDown, FaStar } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [coins, setCoins] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchCoins();
    fetchFavorites();
  }, []);

  const fetchCoins = async () => {
    const fetchedCoins = await client.getWithPrefix("coin:");
    if (fetchedCoins) {
      setCoins(fetchedCoins.map((coin) => ({ key: coin.key, ...coin.value })));
    }
  };

  const fetchFavorites = async () => {
    const fetchedFavorites = await client.get("favorites");
    if (fetchedFavorites) {
      setFavorites(fetchedFavorites[0].value);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const addToFavorites = async (coin) => {
    const newFavorites = [...favorites, coin];
    const success = await client.set("favorites", newFavorites);
    if (success) {
      setFavorites(newFavorites);
      toast({
        title: "Added to favorites",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const removeFromFavorites = async (coinId) => {
    const newFavorites = favorites.filter((coin) => coin.id !== coinId);
    const success = await client.set("favorites", newFavorites);
    if (success) {
      setFavorites(newFavorites);
      toast({
        title: "Removed from favorites",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const filteredCoins = coins.filter((coin) => coin.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container maxW="container.xl">
      <VStack spacing={8}>
        <Heading>Coin98 Explorer</Heading>
        <Flex>
          <Input placeholder="Search for a coin..." value={searchTerm} onChange={handleSearch} />
          <Button leftIcon={<FaSearch />} ml={2}>
            Search
          </Button>
        </Flex>
        <Stack direction={["column", "row"]} spacing={6}>
          <Box w={["100%", "50%"]}>
            <Heading size="md">All Coins</Heading>
            {filteredCoins.map((coin) => (
              <Flex key={coin.id} align="center" justify="space-between" p={4} borderWidth="1px" borderRadius="lg">
                <Text>
                  {coin.name} ({coin.symbol})
                </Text>
                <Button onClick={() => addToFavorites(coin)} leftIcon={<FaStar />}>
                  Favorite
                </Button>
              </Flex>
            ))}
          </Box>
          <Box w={["100%", "50%"]}>
            <Heading size="md">Favorites</Heading>
            {favorites.map((coin) => (
              <Flex key={coin.id} align="center" justify="space-between" p={4} borderWidth="1px" borderRadius="lg">
                <Text>
                  {coin.name} ({coin.symbol})
                </Text>
                <Button onClick={() => removeFromFavorites(coin.id)} colorScheme="red" leftIcon={<FaStar />}>
                  Remove
                </Button>
              </Flex>
            ))}
          </Box>
        </Stack>
      </VStack>
    </Container>
  );
};

export default Index;
