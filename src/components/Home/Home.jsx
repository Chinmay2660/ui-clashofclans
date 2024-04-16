import { Box, useColorModeValue } from '@chakra-ui/react';
import Navbar from './Navbar';

const Home = () => {
    const bg = useColorModeValue('white', '#111827');
    return (
        <Box bg={bg} h="100vh" color="white">
            <Navbar />
        </Box>
    );
};

export default Home;
