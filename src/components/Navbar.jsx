import React from 'react';
import { connect } from 'react-redux';
import { IconButton, Button, Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import COC_LOGO from '../assets/others/COC_LOGO.png'

const Navbar = (props) => {
    const { toggleColorMode } = useColorMode();
    const navigate = useNavigate()
    const iconColor = useColorModeValue('#111827', 'white');
    const bg = useColorModeValue('white', '#111827');

    const handleHome = () => {
        navigate('/')
    }

    const handleLowBatteryTeam = () => {
        console.log("test")
    }

    const handleSearch = () => {
        console.log("test")
    }

    const handleProfile = () => {
        console.log("test")
    }

    const handleSignIn = () => {
        console.log("test")
    }

    const handleLogIn = () => {
        console.log("test")
    }

    return (
        <Box bg={bg} style={{ position: 'sticky', borderBottom: '1px solid rgb(125 211 252)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={COC_LOGO} style={{ height: '3rem', width: '7rem', marginRight: 'auto' }} alt='COC LOGO' />
            </div>
            <div>
                <Button variant='ghost' mr='0.5rem' onClick={handleHome}>Home</Button>
                <Button variant='ghost' mr='0.5rem' onClick={handleLowBatteryTeam}>Low Battery Team</Button>
                <Button variant='ghost' mr='0.5rem' onClick={handleSearch}>Search</Button>
                {/* <Button variant='ghost' mr='0.5rem' onClick={handleProfile}>Profile</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleSignIn}>Sign Up</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleLogIn}>Log in</Button> */}
                {/* <IconButton
                aria-label="Toggle dark mode"
                icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
                onClick={toggleColorMode}
                color={iconColor}
                variant="ghost"
            /> */}
            </div>
        </Box>
    );
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
