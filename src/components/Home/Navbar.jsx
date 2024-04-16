import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IconButton, Text, Button, Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = (props) => {
    const { toggleColorMode } = useColorMode();
    const iconColor = useColorModeValue('gray.600', 'gray.300');

    const handleHome = () => {
        console.log("test")
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
        <Box style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button variant='ghost' mr='0.5rem' onClick={handleHome}>Home</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleLowBatteryTeam}>Low Battery Team</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleSearch}>Search</Button>
            {/* <Button variant='ghost' mr='0.5rem' onClick={handleProfile}>Profile</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleSignIn}>Sign Up</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleLogIn}>Log in</Button> */}
            <IconButton
                aria-label="Toggle dark mode"
                icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
                onClick={toggleColorMode}
                color={iconColor}
                variant="ghost"
            />
        </Box>
    );
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
