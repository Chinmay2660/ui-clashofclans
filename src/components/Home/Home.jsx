import { Box, useColorModeValue } from '@chakra-ui/react';
import wizardImg from '../../assets/backgroundPng/MagicWardenCropped.png'
import hogRiderImg from '../../assets/backgroundPng/SuperHogRider.png'

const Home = () => {
    const bg = useColorModeValue('white', '#111827');

    const handlePlayerSearch = () => {

    }

    const handleClanSearch = () => {

    }

    return (
        <Box bg={bg} color="white" h="100vh" mt='5rem'>
            <Box h="30vh" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box h='23vh' w='70vh' mr='2rem' onClick={handlePlayerSearch} style={{ borderRadius: '1rem', backgroundImage: `url(${wizardImg})`, backgroundSize: '100%', backgroundPosition: '50% 50%', backgroundRepeat: 'no-repeat', marginLeft: '1rem', backgroundColor: '#6420AA' }}>

                </Box>
                <Box h='23vh' w='70vh' mr='2rem' onClick={handleClanSearch} style={{ borderRadius: '1rem', backgroundImage: `url(${hogRiderImg})`, backgroundSize: '100%', backgroundPosition: '10% 10%', backgroundRepeat: 'no-repeat', marginLeft: '1rem', backgroundColor: '#41B06E' }}>

                </Box>
            </Box>
            <Box h="60vh" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box h='45vh' w='150vh' style={{ borderRadius: '1rem' }}>
                    test
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
