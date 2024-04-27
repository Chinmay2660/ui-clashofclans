import React, { useState, useEffect } from 'react';
import backImg from '../../assets/others/Halloween_2020.png';
import { Box, useColorModeValue, Text, Flex, Input, Button, Switch, InputLeftElement, InputGroup } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { getClanInfo, getPlayerInfo, hideLoader, setIsClanSearch, showLoader } from '../../Store/Actions';
import { MdTag } from 'react-icons/md';
import Loader from '../Loader'

const Search = (props) => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    // use clan Tag = 2P9C9U9Y
    // use player tag = 29PUGJQ9P

    const handleSearch = () => {
        if (props.isClanSearch) {
            props.showLoader()
            props.getClanInfo(searchText);
            props.hideLoader()
        } else {
            props.showLoader()
            props.getPlayerInfo(searchText);
            props.hideLoader()
        }
    };

    const handleSwitch = () => {
        props.setIsClanSearch(!props.isClanSearch);
        setSearchText('');
    };

    return (
        <>
            <Box position="relative" color="white" h="82.5vh" mt='5rem' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={-1} style={{
                    backgroundImage: `url(${backImg})`, backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(2px)',
                }}
                />
                <Box
                    h="50vh"
                    w={{base:'80vw', md:'40vw'}}
                    borderRadius='1rem'
                    backgroundColor={useColorModeValue("white", "#1e293b")}
                    boxShadow="md"
                    padding='2rem'
                    color='white'
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text fontSize="2xl" fontWeight="bold" mb="1rem">Welcome Chief!</Text>
                    <Flex align="center" justify="center" mb="1rem">
                        <Text fontSize="md" mr="1rem">Clan Tag</Text>
                        <Switch colorScheme="blue" isChecked={!props.isClanSearch} onChange={handleSwitch} size="md" />
                        <Text fontSize="md" ml="1rem">Player Tag</Text>
                    </Flex>
                    <Flex justifyContent="center" alignItems="center" mb="1rem">
                        <InputGroup w="80%">
                            <InputLeftElement
                                pointerEvents="none"
                                children={<MdTag color="gray.300" />}
                            />
                            <Input
                                placeholder={props.isClanSearch ? "Search Clan" : "Search Player"}
                                borderRadius="full"
                                size="md"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </InputGroup>
                    </Flex>
                    <Button
                        colorScheme="blue"
                        onClick={handleSearch}
                        w="50%"
                        size="md"
                    >
                        Search
                    </Button>
                </Box>
            </Box>
            {props.loader ? <Loader /> : null}
        </>
    );
};

const mapStateToProps = (state) => ({
    isClanSearch: state.isClanSearch,
    loader: state.loader
});

const mapDispatchToProps = {
    setIsClanSearch,
    getPlayerInfo,
    getClanInfo,
    showLoader,
    hideLoader
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);