import { Box, useColorModeValue, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import wizardImg from '../../assets/backgroundPng/MagicWardenCropped.png'
import hogRiderImg from '../../assets/backgroundPng/SuperHogRider.png'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const bg = useColorModeValue('white', '#111827');
    const navigate = useNavigate()

    const handlePlayerSearch = () => {
        navigate('/search')
    }

    const handleClanSearch = () => {
        navigate('/search')
    }

    return (
        <Box bg={bg} color="white" h="82.5vh" mt='5rem' >
            <Box h="30vh" pt='1rem' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box h='23vh' w='75vh' mr='2rem' onClick={handlePlayerSearch} style={{ borderRadius: '1rem', cursor: 'pointer', backgroundImage: `url(${wizardImg})`, backgroundSize: '100%', backgroundPosition: '50% 50%', backgroundRepeat: 'no-repeat', backgroundColor: '#6420AA' }}>

                </Box>
                <Box h='23vh' w='75vh' ml='2rem' onClick={handleClanSearch} style={{ borderRadius: '1rem', cursor: 'pointer', backgroundImage: `url(${hogRiderImg})`, backgroundSize: '100%', backgroundPosition: '10% 10%', backgroundRepeat: 'no-repeat', backgroundColor: '#41B06E' }}>

                </Box>
            </Box>
            <Box h="50vh" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box h="43vh" w="160vh" borderRadius='1rem' backgroundColor='#1e293b' padding='2rem' color='white'>
                    <Text mb='1rem'>
                        Track and analyze your progress in Clash of Clans with ease. Simply enter your player tag or clan tag in the form below to retrieve valuable insights and statistics.
                    </Text>
                    <Text mb='1rem'>
                        With our Profile Tracker, you can:
                    </Text>
                    <UnorderedList mb='1rem' pl='1.5rem'>
                        <ListItem>View your player profile information, including your level, trophies, and achievements.</ListItem>
                        <ListItem>Monitor your clan's performance, such as its members, clan level, top members with war stars, etc.</ListItem>
                    </UnorderedList>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
