import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IconButton, Button, Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import COC_LOGO from '../assets/others/COC_LOGO.png'
import {CloseIcon, HamburgerIcon} from '@chakra-ui/icons'

const Navbar = (props) => {
    const { toggleColorMode } = useColorMode();
    const navigate = useNavigate()
    const iconColor = useColorModeValue('#111827', 'white');
    const bg = useColorModeValue('white', '#111827');
    const [showDrawer, setShowDrawer] = useState(false)

    const handleHome = () => {
        navigate('/')
        setShowDrawer(false)
    }

    const handleLowBatteryTeam = () => {
        navigate('/myteam')
        setShowDrawer(false)
    }

    const handleSearch = () => {
        navigate('/search')
        setShowDrawer(false)
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

    const handleDrawerClick = () => {
        setShowDrawer((prevState) => !prevState)
    }

    return (
        <Box bg={bg} style={{ borderBottom: '2px solid rgb(125 211 252)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={COC_LOGO} style={{ height: '3rem', width: '7rem', marginRight: 'auto' }} alt='COC LOGO' />
            </div>
            <div className='navbar-button'>
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
            {/* navbar drawer code  */}
            <HamburgerIcon fontSize="2rem" className='navbar-drawer-button' onClick={handleDrawerClick}/>
            {showDrawer &&(
                <Box style={{position:'absolute', top:'0', right:'0', display:'flex', alignItems:'start', flexDirection:'column', backgroundColor:bg, height:'100%', width:'50%', zIndex:'1'}}>
                    <CloseIcon style={{position:'absolute', right:'20px', top:'20px'}} onClick={()=>setShowDrawer(false)}/>
                    <Box paddingTop="50px">
                        <Button variant='ghost' mr='0.5rem' onClick={handleHome}>Home</Button>
                        <Button variant='ghost' mr='0.5rem' onClick={handleLowBatteryTeam}>Low Battery Team</Button>
                        <Button variant='ghost' mr='0.5rem' onClick={handleSearch}>Search</Button>
                    </Box>
                </Box>
            )
            }
        </Box>
    );
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
