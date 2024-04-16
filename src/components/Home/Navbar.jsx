import React from 'react';
import { connect } from 'react-redux';
import { Button, Box, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
    const navigate = useNavigate()
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
        <Box bg={bg} style={{ position: 'sticky', borderBottom: '1px solid rgb(125 211 252)', padding: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button variant='ghost' mr='0.5rem' onClick={handleHome}>Home</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleLowBatteryTeam}>Low Battery Team</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleSearch}>Search</Button>
            {/* <Button variant='ghost' mr='0.5rem' onClick={handleProfile}>Profile</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleSignIn}>Sign Up</Button>
            <Button variant='ghost' mr='0.5rem' onClick={handleLogIn}>Log in</Button> */}
        </Box>
    );
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
