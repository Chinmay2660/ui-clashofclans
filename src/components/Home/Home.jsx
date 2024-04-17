import { Box, useColorModeValue } from '@chakra-ui/react';

const Home = () => {
    const bg = useColorModeValue('white', '#111827');
    return (
        <Box bg={bg} color="white" h="100vh">
            <Box h="30vh" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box h='23vh' w='70vh' mr='2rem'>
                    test
                </Box>
                <Box h='23vh' w='70vh' ml='2rem'>
                    test
                </Box>
            </Box>
            <Box h="60vh" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box h='45vh' w='150vh'>
                    test
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
