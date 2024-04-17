import React from 'react';
import backImg from '../../assets/others/Halloween_2020.png';
import { Box, useColorModeValue, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const navigate = useNavigate();

    return (
        <Box position="relative" color="white" h="82.5vh" mt='5rem'>
            <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={-1} style={{
                backgroundImage: `url(${backImg})`, backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                filter: 'blur(2px)',
            }}
            />
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

export default Search;
