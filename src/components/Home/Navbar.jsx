import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IconButton, Button, Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = (props) => {
    const { toggleColorMode } = useColorMode();
    const iconColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Box padding='1rem' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
