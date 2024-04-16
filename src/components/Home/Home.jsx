import { Box, useColorModeValue } from '@chakra-ui/react';

const Home = () => {
    const bg = useColorModeValue('white', '#111827');
    return (
        <Box bg={bg} h="100vh" color="white">
        </Box>
    );
};

export default Home;
