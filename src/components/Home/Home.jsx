import { Box, useColorModeValue, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import wizardImg from '../../assets/backgroundPng/MagicWardenCropped.png'
import hogRiderImg from '../../assets/backgroundPng/SuperHogRider.png'
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { setIsClanSearch } from '../../Store/Actions';
import { connect } from 'react-redux';

const Home = (props) => {
    const bg = useColorModeValue('white', '#111827');
    const navigate = useNavigate()

    const handlePlayerSearch = () => {
        navigate('/search')
        props.setIsClanSearch(false)
    }

    const handleClanSearch = () => {
        navigate('/search')
        props.setIsClanSearch(true)
    }

    return (
        <Box bg={bg} color="white" h="100%">
        {/* Flexbox container for the search boxes */}
        <Box
          // h={{ base: "60vh", md: "30vh" }}
          pt="2rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          {/* Player search box */}
          <Box
            h={{ base: "30vh", md: "25vh" }}
            w={{ base: "90%", md: "30%" }}
            mb={{ base: "2rem", md: "0" }}
            mr={{ base: "0", md: "2rem" }}
            onClick={handlePlayerSearch}
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-start"
            borderRadius="1rem"
            cursor="pointer"
            backgroundImage={`url(${wizardImg})`}
            backgroundSize="cover"
            backgroundColor="#6420AA"
            _hover={{ transform: "scale(1.02)" }}
          >
            <Text ml="1rem" fontSize="lg" fontWeight="bold" mb="0.5rem">
              Search Player
            </Text>
            <Box ml="1rem" display="flex" justifyContent="flex-start" alignItems="center">
              <Text mb="1rem">Enter your player tag</Text>
              <AiOutlineSearch style={{ marginBottom: "0.8rem", marginLeft: "0.3rem" }} size={18} color="white" />
            </Box>
          </Box>
  
          {/* Clan search box */}
          <Box
            h={{ base: "30vh", md: "25vh" }}
            w={{ base: "90%", md: "30%" }}
            ml={{ base: "0", md: "2rem" }}
            onClick={handleClanSearch}
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-start"
            borderRadius="1rem"
            cursor="pointer"
            backgroundImage={`url(${hogRiderImg})`}
            backgroundSize="cover"
            backgroundColor="#41B06E"
            _hover={{ transform: "scale(1.02)" }}
          >
            <Text ml="1rem" fontSize="lg" fontWeight="bold" mb="0.5rem">
              Search Clan
            </Text>
            <Box ml="1rem" display="flex" justifyContent="flex-start" alignItems="center">
              <Text mb="1rem">Enter your clan tag</Text>
              <AiOutlineSearch style={{ marginBottom: "0.8rem", marginLeft: "0.3rem" }} size={18} color="white" />
            </Box>
          </Box>
        </Box>
  
        {/* Box with text content */}
        <Box
          // h={{ base: "40vh", md: "50vh" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding="2rem"
          color="white"
        >
          <Box
            h="auto"
            w={{ base: "100%", md: "70vw", lg:'65vw' }}
            borderRadius="1rem"
            backgroundColor="#1e293b"
            padding="2rem"
            textAlign="left"
            paddingBottom="10%"
          >
            <Text mb="1rem">
              Track and analyze your progress in Clash of Clans with ease. Simply enter your player tag or clan tag in the form below to retrieve valuable insights and statistics.
            </Text>
            <Text mb="1rem">With our Profile Tracker, you can:</Text>
            <UnorderedList mb="1rem" pl="1.5rem">
              <ListItem>View your player profile information, including your level, trophies, and achievements.</ListItem>
              <ListItem>Monitor your clan's performance, such as its members, clan level, top members with war stars, etc.</ListItem>
            </UnorderedList>
          </Box>
        </Box>
      </Box>
    );
};

const mapStateToProps = (state) => ({
    isClanSearch: state.isClanSearch
});

const mapDispatchToProps = {
    setIsClanSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

